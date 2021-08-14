import * as ejs from 'ejs';
import * as path from 'path';
import { existsSync, mkdirSync, readdirSync, writeFileSync } from 'fs';
import slugify from 'slugify';

import { languages } from './schemas';

const languagesMap = Object.keys(languages).map((language) => ({
  language,
  languageMap: require(`./languagesMap/${language}Template`).languageMap,
}));

/**
 * Generate the helpers (structure of the function for the challenge)
 * and the tests based on the json definition
 */
async function generateChallenges() {
  console.log('Creating challenges...');
  const challenges = readdirSync(path.join(__dirname, '../challenges')).map((challenge) =>
    path.join(__dirname, '../challenges', challenge)
  );
  const promises: Promise<void>[] = [];
  challenges.forEach((challenge) => {
    const challengeSpec = require(challenge);
    const name = slugify(challengeSpec.name, { lower: true });
    promises.push(generateHelpers(challengeSpec, name));
    promises.concat(generateTests(challengeSpec, name));
  });

  await Promise.all(promises);
  console.log('Challenges created');
}

generateChallenges();

/**
 * Generate the code's skeleton displayed for each challenge to help the user
 */
function generateHelpers(challengesSpec: any, name: string) {
  const dirPath = path.join(__dirname, `../dist/helpers/${name}`);
  if (!existsSync(dirPath)) {
    mkdirSync(dirPath, { recursive: true });
  }
  let additionalDataStructuresDefinition = new Array(languagesMap.length).fill('');
  if (challengesSpec.additionalDataStructure) {
    additionalDataStructuresDefinition = languagesMap.map(
      ({ languageMap }) => languageMap.additionalDataStructures[challengesSpec.additionalDataStructure].definition
    );
  }
  let data = {
    ...challengesSpec,
    helpers: languagesMap,
    functionName: challengesSpec.function.name,
    functionParams: challengesSpec.function.params,
    functionReturnType: challengesSpec.function.returnType,
    additionalDataStructuresDefinition,
  };
  return new Promise<void>((resolve, reject) => {
    ejs.renderFile(path.join(__dirname, './templates/helpers.ejs'), data, (err, str) => {
      if (err) {
        reject(err);
      }
      resolve(writeFileSync(path.join(__dirname, `../dist/helpers/${name}/index.js`), str));
    });
  });
}

/**
 * Generate the tests the challenge needs to pass, for each challenge
 */
function generateTests(challengesSpec: any, name: string) {
  const dirPath = path.join(__dirname, `../dist/tests/${name}`);
  if (!existsSync(dirPath)) {
    mkdirSync(dirPath, { recursive: true });
  }
  const promises: Promise<void>[] = [];
  languagesMap.forEach(({ language, languageMap }) => {
    let data = {
      ...challengesSpec,
      languageMap,
      functionName: challengesSpec.function.name,
      functionReturnType: challengesSpec.function.returnType,
      inputsType: challengesSpec.function.params.map((param: { type: string }) => param.type),
      additionalDataStructureImplementation:
        languageMap.additionalDataStructures[challengesSpec.additionalDataStructure]?.implementation || '',
    };
    let promise = new Promise<void>((resolve, reject) => {
      ejs.renderFile(path.join(__dirname, './templates/test.ejs'), data, (err, str) => {
        if (err) {
          reject(err);
        }
        resolve(writeFileSync(path.join(__dirname, `../dist/tests/${name}/test.${language}`), str));
      });
    });
    promises.push(promise);
  });
  return promises;
}
