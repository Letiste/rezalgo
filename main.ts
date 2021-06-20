import fastify from 'fastify';
import pov from 'point-of-view';
import ejs from 'ejs';
import cors from 'fastify-cors';
import { podman } from './podman';
import { FromSchema } from 'json-schema-to-ts';
import { bodySchema } from './schemas';
import { languages } from './languages';
import { readdirSync } from 'fs';
import path from 'path';

const server = fastify({ logger: true });

server.register(pov, {
  engine: {
    ejs,
  },
});

server.register(cors, {
  origin: '*',
});

const challenges = readdirSync(path.join(__dirname, 'challenges'), {
  withFileTypes: true,
})
  .filter((files) => files.isDirectory())
  .map((dir) => dir.name);

for (const challenge of challenges) {
  server.get(`/${challenge}`, (_, reply) => {
    reply.view('/view/index.ejs', { languages, challenge });
  });

  server.post<{ Body: FromSchema<typeof bodySchema> }>(
    `/${challenge}`,
    { schema: { body: bodySchema } },
    async function (request) {
      const { language, data } = request.body;
      const { stdout, stderr } = await podman(challenge, language, data);
      return { stdout, stderr };
    }
  );
}

server.listen(3000, function (err, address) {
  if (err) {
    server.log.error(err);
    process.exit(1);
  }
  server.log.info(`server listening of ${address}`);
});
