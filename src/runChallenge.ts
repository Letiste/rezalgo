import * as fs from 'fs';
import * as path from 'path';
import { languages } from './schemas';
import Queue from './queue';
import { createContainer, deleteContainer, getStderrContainer, getStdoutContainer, startContainer, waitContainer } from './containerApiUtils';

type Language = keyof typeof languages;
const MAX_CONTAINERS_RUNNING = process.env.MAX_CONTAINERS_RUNNING || '10';

let currentRunningContainers = 0;

/**
 * Start a container and execute the given code for a challenge and a language
 * 
 * @param challenge The name of the challenge to run, defined by name in the corresponding json
 * @param language The language in which the challenge is runned
 * @param data The code to be executed
 * @returns stdout, information logged by the executed code and stderr, the errors that occured
 */

export function runChallenge(
  challenge: string,
  language: Language,
  data: string
): Promise<{ stdout: string; stderr: string }> {
  const name = Date.now().toString();
  createTmpFile(challenge, language, name, data);
  return new Promise((resolve) => {
    const cb = ({stdout, stderr}: {stdout: string, stderr: string}) => {
      removeTmpFile(`${name}.${language}`);
      currentRunningContainers = Math.max(0, currentRunningContainers - 1);
      Queue.runJob();
      resolve({ stdout, stderr });
    }

    currentRunningContainers++;
    if (currentRunningContainers > Number(MAX_CONTAINERS_RUNNING)) {
      Queue.addJob({
        fn: runContainer,
        params: { language, name },
        cb,
    });
    } else {
      runContainer(language, `${name}.${language}`).then(cb)
    }
  });
}

/**
 * 
 * @param language The language in which the challenge is runned
 * @param name The name of the executed file
 * @returns The output of the container
 */

async function runContainer(language: Language, name: string): Promise<{stdout: string, stderr: string}> {
  const { image, runner } = languages[language];
  const id = await createContainer(image, runner, name)
  await startContainer(id)
  await waitContainer(id)
  const [stdout, stderr] = await Promise.all([getStdoutContainer(id), getStderrContainer(id)])
  deleteContainer(id)
  return {stdout, stderr}
}


/**
 * 
 * @param challenge The name of the challenge to retrieve the file from
 * @param language The file extension
 * @param name 
 * @param data The code added to the file
 */

function createTmpFile(challenge: string, language: Language, name: string, data: string): void {
  const challengeData = fs.readFileSync(path.join(__dirname, `../tests/${challenge}/test.${language}`)).toString();
  const testData = challengeData.replace(/.+---WRITE USER CODE HERE---/, `${data}`);
  fs.writeFileSync(`/tmp/${name}.${language}`, testData);
}

function removeTmpFile(name: string): void {
  fs.rmSync(`/tmp/${name}`);
}
