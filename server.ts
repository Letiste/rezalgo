import path from 'path';
import fs from 'fs';
import fastify from 'fastify';
import pov from 'point-of-view';
import ejs from 'ejs';
import fastifyCompress from 'fastify-compress';
import cors from 'fastify-cors';
import fastifyStatic from 'fastify-static';
import fastifySwagger from 'fastify-swagger';

const server = fastify({ logger: false });

server.register(pov, {
  engine: {
    ejs,
  },
});

server.register(cors, {
  origin: '*',
});

server.register(fastifyCompress)

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
      license: { name: 'MIT License', url: "https://opensource.org/licenses/MIT" },
    },
  },
});

server.register(require('./src/routes'));

server.listen(3000, function (err, address) {
  if (err) {
    server.log.error(err);
    process.exit(1);
  }
  server.log.info(`server listening of ${address}`);
});

server.ready((err) => {
  if (err) throw err;
  fs.writeFileSync(
    path.join(__dirname, 'swagger.json'),
    JSON.stringify(server.swagger())
  );
});
