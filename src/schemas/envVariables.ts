import { Validators } from 'fastify-envalid';

export function validateEnvVariables(validators: Validators) {
  return {
    NODE_ENV: validators.str({default: 'development'}),
    PORT: validators.num({ default: 3000 }),
    HOST: validators.str({ devDefault: '127.0.0.1', desc: 'Host IP' }),
    SOCKET_PATH: validators.str({
      desc: 'Path of the socket to make the unix socket request',
    }),
    CONTAINER_API_VERSION: validators.str({
      desc: 'Version of the api in the request',
    }),
    MAX_CONTAINERS_RUNNING: validators.num({ default: 10 }),
    MAX_TIME_CONTAINER: validators.num({default: 5, desc: 'Time in seconds before a running container is forcefully stopped'}),
    MAX_MEMORY_CONTAINER: validators.num({default: 100, desc: 'Memory usage in megabytes allowed before a running container is forcefully stopped'}),
    LOG_LEVEL: validators.str({ default: 'info' }),
  };
}
