import fastify from 'fastify';
import pov from 'point-of-view';
import ejs from 'ejs';
import cors from 'fastify-cors';

const server = fastify({ logger: true });

server.register(pov, {
  engine: {
    ejs,
  },
});

server.register(cors, {
  origin: '*',
});

server.register(require('./src/routes'))

server.listen(3000, function (err, address) {
  if (err) {
    server.log.error(err);
    process.exit(1);
  }
  server.log.info(`server listening of ${address}`);
});
