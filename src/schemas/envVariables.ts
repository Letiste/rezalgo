import { Validators } from 'fastify-envalid';

export function validateEnvVariables(validators: Validators) {
  return {
    NODE_ENV: validators.str({default: 'development'}),
    PORT: validators.num({ default: 3000 }),
    HOST: validators.str({ devDefault: '127.0.0.1' }),
    SOCKET_PATH: validators.str({
      desc: 'Path of the socket to make the unix socket request',
    }),
    DOCKER_API_VERSION: validators.str({
      desc: 'Version of the api in the request',
    }),
    MAX_CONTAINERS_RUNNING: validators.num({ default: 10 }),
    LOG_LEVEL: validators.str({ default: 'info' }),
  };
}
