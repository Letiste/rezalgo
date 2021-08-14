import * as fs from 'fs';
import * as path from 'path';
import { languages } from './schemas';
import Queue from './queue';
import {
  createContainer,
  deleteContainer,
  getStderrContainer,
  getStdoutContainer,
  startContainer,
  waitContainer,
} from './containerApiUtils';

/**
 * Interface specifying which parameters are necessary to run a challenge
 */
interface ChallengeInput {
  /** The name of the challenge to run, defined by name in the corresponding json */
  challenge: string;
  /** The language in which the challenge is runned */
  language: Language;
  /** The code to be executed */
  data: string;
  /** Time limit to consider the challenge as passed */
  timeLimit: number;
  /** Memory limit to consider the challenge as passed */
  memoryLimit: number;
  /** String to send if the challenge is passed */
  flag: string;
}

/**
 * Interface specifying which parameters are given back by the challenge
 */
interface ChallengeOutput {
  /** Stdout of the challenge */
  stdout: string;
  /** Stderr of the challenge */
  stderr: string;
  /** Time spent to run the challenge */
  time: number;
  /** Memory used to run the challenge */
  memory: number;
  /** String to send if the challenge is passed */
  success: string;
}

type Language = keyof typeof languages;
const MAX_CONTAINERS_RUNNING = Number(process.env.MAX_CONTAINERS_RUNNING) || 10;
const MAX_TIME_CONTAINER = Number(process.env.MAX_TIME_CONTAINER) || 5;
const MAX_MEMORY_CONTAINER = Number(process.env.MAX_MEMORY_CONTAINER) || 100;

let currentRunningContainers = 0;

/**
 * Start a container and execute the given code for a challenge and a language
 *
 * @param {@link ChallengeInput}
 * @returns information from the challenge
 */
export function runChallenge({ challenge, language, data, timeLimit, memoryLimit, flag }: ChallengeInput): Promise<ChallengeOutput> {
  const name = Date.now().toString();
  createTmpFile(challenge, language, name, data);
  return new Promise((resolve) => {
    const handleFinishedChallenge = ({ stdout, stderr }: { stdout: string; stderr: string }) => {
      removeTmpFile(`${name}.${language}`);
      currentRunningContainers = Math.max(0, currentRunningContainers - 1);
      Queue.runJob();
      resolve(processChallengeOutput(stdout, stderr, timeLimit, memoryLimit, flag));
    };

    currentRunningContainers++;
    if (currentRunningContainers > MAX_CONTAINERS_RUNNING) {
      Queue.addJob({
        fn: runContainer,
        params: { language, name },
        cb: handleFinishedChallenge,
      });
    } else {
      runContainer(language, `${name}.${language}`).then(handleFinishedChallenge);
    }
  });
}

/**
 * Process challenge output from stdout, stderr and conditions of success
 */
function processChallengeOutput(stdout: string, stderr: string, timeLimit: number, memoryLimit: number, flag: string): ChallengeOutput {
  const stdoutLines = stdout.split('\n');

  // first pop to remove blank string from last \n
  stdoutLines.pop();

  const time = getTime(stdoutLines.pop());
  if (time > timeLimit) {
    stderr += `Timit limit exceeded ${timeLimit}ms\n`;
  }
  const memory = getMemory(stdoutLines.pop());
  if (memory / 1024 ** 2 > memoryLimit) {
    stderr += `Memory usage exceeded ${memoryLimit}MB\n`;
  }
  const success = stderr ? '' : flag;
  return { stdout: stdoutLines.join('<br>'), success, time, memory, stderr: stderr.replace(/\n/g, '<br>') };
}

/**
 * Extract memory usage from given line
 */
function getTime(line: string | undefined): number {
  return (
    Number(
      line?.replace(/TIME DURATION: *([0-9]+)/, function (_, p1: string) {
        return p1;
      })
    ) || 0
  );
}

/**
 * Extract memory usage from given line
 */
function getMemory(line: string | undefined) {
  return (
    Number(
      line?.replace(/MEMORY USAGE: *([0-9]+)/, function (_, p1: string) {
        return p1;
      })
    ) || 0
  );
}

/**
 *
 * @param language The language in which the challenge is runned
 * @param name The name of the executed file
 * @returns The output of the container
 */
async function runContainer(language: Language, name: string): Promise<{ stdout: string; stderr: string }> {
  const { image, runner } = languages[language];
  const id = await createContainer(image, runner, name, MAX_MEMORY_CONTAINER);
  await startContainer(id);

  const stopContainer = new Promise<{ action: 'stop'; statusCode: number }>((resolve) =>
    setTimeout(resolve, MAX_TIME_CONTAINER * 1000, { action: 'stop', statusCode: 0 })
  );

  const { action, statusCode } = await Promise.race([stopContainer, waitContainer(id)]);
  if (action === 'stop') {
    deleteContainer(id);
    return { stdout: '', stderr: `Timit limit exceeded` };
  }

  if (action === 'wait' && statusCode === 137) {
    deleteContainer(id);
    return {
      stdout: '',
      stderr: 'Memory usage over the limit',
    };
  }

  const [stdout, stderr] = await Promise.all([getStdoutContainer(id), getStderrContainer(id)]);
  deleteContainer(id);
  return { stdout, stderr };
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

/**
 * Remove file by name from tmp folder
 * @param name Name of the file
 */
function removeTmpFile(name: string): void {
  fs.rmSync(`/tmp/${name}`);
}
