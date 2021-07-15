import { exec } from 'child_process';
import * as fs from 'fs';
import * as path from 'path';
import * as http from 'http';
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
    const cb = ({stdout, stderr}: {stdout: string, stderr: string}) => {
      removeTmpFile(name);
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
      runContainer(language, name).then(cb)
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
  const output = await dockerSocketRequest('create', 'POST', JSON.stringify({Image: image, Cmd: [...runner.split(' '), `/app/${name}`], HostConfig: {Binds: [`/tmp/${name}:/app/${name}`]}}));
  const Id= JSON.parse(output).Id
  await dockerSocketRequest(`${Id}/start`, 'POST')
  await dockerSocketRequest(`${Id}/wait`, 'POST')
  const stdout =  await dockerSocketRequest(`${Id}/logs?stdout=1`, 'GET')
  const stderr =  await dockerSocketRequest(`${Id}/logs?stderr=1`, 'GET')
  dockerSocketRequest(Id, 'DELETE')
  return {stdout, stderr}
}

async function dockerSocketRequest(path: string, method: 'POST' | 'GET' | 'DELETE', data?: string) {
  return new Promise<any>((resolve, reject) => {

  const options = {
    socketPath: process.env.SOCKET_PATH || '/var/run/docker.sock',
    path: `/${process.env.DOCKER_API_VERSION || 'v1.41'}/containers/${path}`,
    method: method,
    headers: {'Content-Type': 'application/json'}
  }
  const callback = (res: http.IncomingMessage) => {
    console.log(`STATUS: ${res.statusCode}`);
    res.setEncoding('utf8');
    let output = Buffer.from('');
    res.on('data', (data: string | Buffer) => output = Buffer.concat([output, Buffer.from(data)]))
    res.on('close', () => resolve(output.toString()))
    res.on('error', (error: any) => reject(error))
  }
  const clientRequest = http.request(options, callback)
  if (data) {
    clientRequest.write(data)
  }
  clientRequest.end()
  })
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
