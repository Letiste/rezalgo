import { exec } from 'child_process';
import fs from 'fs';
import path from 'path';
import { languages } from './languages';

type Language = keyof typeof languages;

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

function execute(language: Language, name: string) {
  const { image, runner } = languages[language];
  return `podman run --rm -v /tmp/${name}:/app/${name} ${image} ${runner} /app/${name}`;
}

function createTmpFile(
  challenge: string,
  language: Language,
  name: string,
  data: string
): void {
  fs.writeFileSync(`/tmp/${name}`, `${data}\n`);
  const challengeData = fs
    .readFileSync(
      path.join(__dirname, `challenges/${challenge}/index.${language}`)
    )
    .toString();
  fs.writeFileSync(`/tmp/${name}`, challengeData, { flag: 'a+' });
}

function removeTmpFile(name: string): void {
  fs.rmSync(`/tmp/${name}`);
}
