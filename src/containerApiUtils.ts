import * as http from 'http';

/**
 * Container API appends a header to the data streamed
 * when accessing logs
 */
const HEADER_LENGTH = 8;

const httpAgent = new http.Agent({keepAlive: true})

/**
 * Make a request to docker using unix socket
 * @param path Path of the request
 * @param method HTTP method
 * @param data Optional body data
 */
async function dockerSocketRequest(
  path: string,
  method: 'POST' | 'GET' | 'DELETE',
  data?: string
) {
  return new Promise<any>((resolve, reject) => {
    const options: http.RequestOptions = {
      socketPath: process.env.SOCKET_PATH,
      path: `/${process.env.CONTAINER_API_VERSION}/libpod/containers/${path}`,
      method: method,
      headers: { 'Content-Type': 'application/json' },
      agent: httpAgent,
    };
    const callback = (res: http.IncomingMessage) => {
      console.log(`STATUS: ${res.statusCode}`);
      res.setEncoding('utf8');
      let output = Buffer.from('');
      res.on('data', (data: string | Buffer) => {
        if (path.includes('logs')) {
          // removing header from response
          output = Buffer.concat([
            output,
            Buffer.from(data).slice(HEADER_LENGTH),
            Buffer.from('\n'),
          ]);
        } else {
          output = Buffer.concat([output, Buffer.from(data)]);
        }
      });
      res.on('close', () => resolve(output.toString()));
      res.on('error', (error: any) => reject(error));
    };
    const clientRequest = http.request(options, callback);
    if (data) {
      clientRequest.write(data);
    }
    clientRequest.end();
  });
}

/**
 * Create a container to run a test
 *
 * @param image Container image
 * @param runner Command to execute on container init to start the test
 * @param name Name of the test file
 */
export async function createContainer(
  image: string,
  runner: string,
  name: string,
  memoryLimit: number
): Promise<string> {
  const memoryLimitMB = 1024 * 1024 * memoryLimit;
  const output = JSON.parse(
    await dockerSocketRequest(
      'create',
      'POST',
      JSON.stringify({
        image: image,
        command: [...runner.split(' '), `/app/${name}`],
        env: {JDK_SILENT_JAVA_OPTIONS: `-Xmx${memoryLimit}m -Xms${memoryLimit}m`},
        mounts: [
          { type: 'bind', source: `/tmp/${name}`, destination: `/app/${name}` },
        ],
        resource_limits: {
          memory: { limit: memoryLimitMB, swap: memoryLimitMB },
        },
      })
    )
  );
  if (!output.Id) {
    throw new Error(`Couldn't create the container from the image ${image}`);
  }
  return output.Id;
}

/**
 * Start the specified container
 *
 * @param id Container's id
 */
export async function startContainer(id: string): Promise<void> {
  return dockerSocketRequest(`${id}/start`, 'POST');
}
/**
 * Wait until the specified container stop
 * 
 * @param id Container's id
 */
export async function waitContainer(
  id: string
): Promise<{ action: 'wait'; statusCode: number }> {
  const statusCode = Number(await dockerSocketRequest(`${id}/wait`, 'POST'));
  return { action: 'wait', statusCode };
}

/**
 * Get the stdout of the specified container
 *
 * @param id Container's id
 */
export async function getStdoutContainer(id: string): Promise<string> {
  return dockerSocketRequest(`${id}/logs?stdout=1`, 'GET');
}

/**
 * Get the stderr of the specified container
 *
 * @param id Container's id
 */

export async function getStderrContainer(id: string): Promise<string> {
  return dockerSocketRequest(`${id}/logs?stderr=1`, 'GET');
}

/**
 * Delete the specified container
 *
 * @param id Container's id
 */

export async function deleteContainer(id: string): Promise<string> {
  return dockerSocketRequest(id, 'DELETE');
}
