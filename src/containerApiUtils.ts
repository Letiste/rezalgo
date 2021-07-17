import * as http from 'http'

/**
 * Container API appends a header to the data streamed
 * when accessing logs
 */
const HEADER_LENGTH = 8

/**
 * Make a request to docker using unix socket
 * @param path Path of the request
 * @param method HTTP method
 * @param data Optional body data
 */
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
    res.on('data', (data: string | Buffer) => {
      if (path.includes('logs')) {
        // removing header from response
        output = Buffer.concat([output, Buffer.from(data).slice(HEADER_LENGTH)])
      } else {
        output = Buffer.concat([output, Buffer.from(data)])
    }
  })
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
 * Create a container to run a test
 *  
 * @param image Container image
 * @param runner Command to execute on container init to start the test
 * @param name Name of the test file
 */
export async function createContainer(image: string, runner: string, name: string): Promise<string> {
  const output = JSON.parse(await dockerSocketRequest('create', 'POST', JSON.stringify({Image: image, Cmd: [...runner.split(' '), `/app/${name}`], HostConfig: {Binds: [`/tmp/${name}:/app/${name}`]}})));
  if (!output.Id) {
    throw new Error(`Couldn't create the container from the image ${image}`)
  }
  return output.Id
}


/**
 * Start the specified container
 * 
 * @param id Container's id
 */
export async function startContainer(id: string): Promise<void> {
  await dockerSocketRequest(`${id}/start`, 'POST')
}

export async function waitContainer(id: string): Promise<void> {
  await dockerSocketRequest(`${id}/wait`, 'POST')
}

/**
 * Get the stdout of the specified container
 * 
 * @param id Container's id
 */
export async function getStdoutContainer(id: string): Promise<string> {
  return dockerSocketRequest(`${id}/logs?stdout=1`, 'GET')
}

/**
 * Get the stderr of the specified container
 * 
 * @param id Container's id
 */

export async function getStderrContainer(id: string): Promise<string> {
  return dockerSocketRequest(`${id}/logs?stderr=1`, 'GET')
}

/**
 * Delete the specified container
 * 
 * @param id Container's id
 */

export async function deleteContainer(id: string): Promise<string> {
  return dockerSocketRequest(id, 'DELETE')
}