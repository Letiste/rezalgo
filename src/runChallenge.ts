import { exec } from 'child_process';
import * as fs from 'fs';
import * as path from 'path';
import { languages } from './schemas';
import Queue from './queue';

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
    const cb = (_: any, stdout: string, stderr: string) => {
      removeTmpFile(name);
      currentRunningContainers = Math.max(0, currentRunningContainers - 1);
      Queue.runJob();
      resolve({ stdout, stderr });
    }

    currentRunningContainers++;
    if (currentRunningContainers > Number(MAX_CONTAINERS_RUNNING)) {
      Queue.addJob({
        fn: startContainer,
        params: { language, name },
        cb,
    });
    } else {
      exec(startContainer(language, name), cb);
    }
  });
}

/**
 * 
 * @param language The language in which the challenge is runned
 * @param name The name of the executed file
 * @returns The command to be executed to start the container
 */

function startContainer(language: Language, name: string): string {
  const { image, runner } = languages[language];
  return `podman run --rm -v /tmp/${name}:/app/${name} ${image} ${runner} /app/${name}`;
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
  fs.writeFileSync(`/tmp/${name}`, testData);
}

function removeTmpFile(name: string): void {
  fs.rmSync(`/tmp/${name}`);
}
