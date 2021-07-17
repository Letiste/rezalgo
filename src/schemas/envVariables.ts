import { Validators } from "fastify-envalid";

export function validateEnvVariables(validators: Validators) {
  return {
    PORT: validators.port({default: 3000}),
    HOST: validators.host({default: '127.0.0.1'}),
    SOCKET_PATH: validators.str({desc: 'Path of the socket to make the unix socket request'}),
    DOCKER_API_VERSION: validators.str({desc: 'Version of the api in the request'}),
    MAX_CONTAINERS_RUNNING: validators.num({default: 10})
  }
}
