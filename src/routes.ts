import path from 'path';
import { FastifyInstance } from 'fastify';
import { readdirSync } from 'fs';
import { FromSchema } from 'json-schema-to-ts';

import { bodySchema, languages } from '../schemas';
import { podman } from './podman';

const challenges = readdirSync(path.join(__dirname, 'challenges')).map((file) => require(path.join(__dirname, 'challenges', file)));

const themes = readdirSync(path.join(__dirname, "../public/theme")).map((file) => file.split(".")[0])

export default async function routes(fastify: FastifyInstance) {
  for (const challenge of challenges) {
    fastify.get(`/${challenge.functionName}`, async (_, reply) => {
      reply.view('/view/index.ejs', {
        languages,
        challenge,
        helpers: require(path.join(__dirname, `../dist/helpers/${challenge.functionName}`))
          .helpers,
          themes
      });
    });

    fastify.post<{ Body: FromSchema<typeof bodySchema> }>(
      `/${challenge.functionName}`,
      { schema: { body: bodySchema } },
      async function (request) {
        const { language, data } = request.body;
        const { stdout, stderr } = await podman(challenge.functionName, language, data);
        let success = !stderr;
        return { stdout, stderr, success };
      }
    );
  }
}
