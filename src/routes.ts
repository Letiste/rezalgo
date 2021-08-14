import * as path from 'path';
import { FastifyInstance } from 'fastify';
import { readdirSync } from 'fs';
import { FromSchema } from 'json-schema-to-ts';
import * as marked from 'marked';
import slugify from 'slugify';

import { containerInputSchema, containerOutputSchema, languages, postSchema, getSchema } from './schemas';
import { runChallenge } from './runChallenge';

const challenges = readdirSync(path.join(__dirname, '../challenges')).map((file) => require(path.join(__dirname, '../challenges', file)));
const themes = readdirSync(path.join(__dirname, '../public/theme')).map((file) => file.split('.')[0]);
const generatedRoutes: string[] = [];

/**
 * Generate routes dynamically based on the challenges folder files
 */
export default async function routes(fastify: FastifyInstance) {
  for (const challenge of challenges) {
    challenge.description = marked(challenge.description);
    for (const example of challenge.examples) {
      example.input = marked(example.input);
      example.output = marked(example.output);
    }
    const slugName = slugify(challenge.name, { lower: true });
    generatedRoutes.push(`/${slugName}`);
    fastify.get(`/${slugName}`, { schema: getSchema }, async (_, reply) => {
      reply.view('/view/index.ejs', {
        languages,
        challenge,
        helpers: require(path.join(__dirname, `../helpers/${slugName}`)).helpers,
        themes,
      });
    });

    fastify.post<{ Body: FromSchema<typeof containerInputSchema>; Response: FromSchema<typeof containerOutputSchema> }>(
      `/${slugName}`,
      { schema: postSchema },
      async function (request, reply) {
        const { memoryLimit, timeLimit, flag } = challenge;
        const { language, data } = request.body;
        const { stdout, stderr, success, memory, time } = await runChallenge({
          challenge: slugName,
          language,
          data,
          memoryLimit,
          timeLimit,
          flag,
        });
        reply.code(200);
        reply.send({ stdout, stderr, success, time, memory });
      }
    );
  }

  console.log('The generated routes are: ');
  generatedRoutes.forEach((route) => console.log(route));

  fastify.get('*', function (_, reply) {
    reply.view('/view/404.ejs', {
      challenges: challenges.map((challenge) => ({
        name: challenge.name,
        url: slugify(challenge.name, { lower: true }),
      })),
    });
  });
}
