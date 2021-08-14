import * as path from 'path';
import * as fs from 'fs';
import fastify from 'fastify';
import pov from 'point-of-view';
import * as ejs from 'ejs';
import cors from 'fastify-cors';
import fastifyStatic from 'fastify-static';
import fastifySwagger from 'fastify-swagger';
import fastifyHelmet from 'fastify-helmet';
import fastifyEnvalid from 'fastify-envalid';

import { validateEnvVariables } from './src/schemas';

const server = fastify({
  logger: {
    level: process.env.LOG_LEVEL || 'info',
    prettyPrint: process.env.NODE_ENV === 'production' ? false : true
  },
});

server.register(pov, {
  engine: {
    ejs,
  },
});

server.register(cors);

server.register(fastifyHelmet, { contentSecurityPolicy: false });

server.register(fastifyEnvalid);

server.register(fastifyStatic, {
  root: path.join(__dirname, 'public'),
  prefix: '/public/',
});

server.register(fastifySwagger, {
  exposeRoute: true,
  openapi: {
    openapi: '3',
    info: {
      title: 'RezAlgo',
      version: '1.0.0',
      contact: { email: 'contact@rezoleo.fr' },
      license: {
        name: 'MIT License',
        url: 'https://opensource.org/licenses/MIT',
      },
    },
  },
});

server.register(require('./src/routes'));

const PORT = process.env.PORT || '3000';
const HOST = process.env.HOST || '127.0.0.1';

server.listen({ port: Number(PORT), host: HOST }, function (err, address) {
  if (err) {
    server.log.error(err);
    process.exit(1);
  }
  server.log.info(`server listening at ${address}`);
});

server.ready((err) => {
  server.cleanEnv(process.env, validateEnvVariables(server.validators));
  if (err) throw err;
  fs.writeFileSync(
    path.join(__dirname, 'swagger.json'),
    JSON.stringify(server.swagger())
  );
});
