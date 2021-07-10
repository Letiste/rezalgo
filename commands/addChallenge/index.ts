import path from 'path';
import ejs from 'ejs';
import fs from 'fs';
import prompts, { PromptObject } from 'prompts';
import slugify from 'slugify';

function validate(inputName: string) {
  return (input: string) => {
    if (input.trim().length === 0) {
      return `${inputName} cannot be empty.`;
    }
    return true;
  };
}

const questions: PromptObject[] = [
  {
    type: 'text',
    name: 'name',
    message: 'Name of the new challenge: ',
    validate: validate('Name'),
  }
];

(async () => {
  const {name} = await prompts(questions);
  if (!name) {
    throw new Error("No challenge's name provided.");
  }
  const slugName = slugify(name, { lower: true });
  await new Promise<void>((resolve, reject) => {
    ejs.renderFile(path.join(__dirname, './challenge.ejs'), { name: name }, (err, str) => {
      if (err) {
        reject(err);
      }
      resolve(fs.writeFileSync(path.join(__dirname, `../../challenges/${slugName}.json`), str, {flag: 'wx'}));
    });
  });
  console.log(`New challenge file ${slugName}.json added in ${path.join(__dirname, '../../challenges')}`);
})();
