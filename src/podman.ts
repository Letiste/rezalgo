import { exec } from 'child_process';
import fs from 'fs';
import path from 'path';
import { languages } from '../schemas';

type Language = keyof typeof languages;

/**
 * Start a podman container and execute the given code for a challenge and a language
 * 
 * @param challenge The name of the challenge to run, defined by functionName in the corresponding json
 * @param language The language in which the challenge is runned
 * @param data The code to be executed
 * @returns stdout, information logged by the executed code and stderr, the errors that occured
 */

export function podman(
  challenge: string,
  language: Language,
  data: string
): Promise<{ stdout: string; stderr: string }> {
  const name = Date.now().toString();
  createTmpFile(challenge, language, name, data);
  return new Promise((resolve) => {
    exec(execute(language, name), (_, stdout: string, stderr: string) => {
      removeTmpFile(name);
      resolve({ stdout, stderr });
    });
  });
}

/**
 * 
 * @param language The language in which the challenge is runned
 * @param name The name of the executed file
 * @returns The command to be executed to start the podman's container
 */

function execute(language: Language, name: string): string {
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

function createTmpFile(
  challenge: string,
  language: Language,
  name: string,
  data: string
): void {
  fs.writeFileSync(`/tmp/${name}`, `${data}\n`);
  const challengeData = fs
    .readFileSync(
      path.join(__dirname, `../dist/tests/${challenge}/test.${language}`)
    )
    .toString();
  fs.writeFileSync(`/tmp/${name}`, challengeData, { flag: 'a+' });
}

function removeTmpFile(name: string): void {
  fs.rmSync(`/tmp/${name}`);
}
