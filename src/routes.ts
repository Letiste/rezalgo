import path from 'path';
import { FastifyInstance } from 'fastify';
import { readdirSync } from 'fs';
import { FromSchema } from 'json-schema-to-ts';

import { podmanInputSchema, podmanOutputSchema, languages, postSchema, getSchema } from './schemas';
import { podman } from './podman';

const challenges = readdirSync(path.join(__dirname, '../challenges')).map((file) => require(path.join(__dirname, '../challenges', file)));

const themes = readdirSync(path.join(__dirname, "../public/theme")).map((file) => file.split(".")[0])

export default async function routes(fastify: FastifyInstance) {
  for (const challenge of challenges) {
    fastify.get(`/${challenge.functionName}`,{schema: getSchema }, async (_, reply) => {
      reply.view('/view/index.ejs', {
        languages,
        challenge,
        helpers: require(path.join(__dirname, `../dist/helpers/${challenge.functionName}`))
          .helpers,
          themes
      });
    });

    fastify.post<{ Body: FromSchema<typeof podmanInputSchema>, Response: FromSchema<typeof podmanOutputSchema>}>(
      `/${challenge.functionName}`,
      { schema: postSchema },
      async function (request, reply) {
        const { language, data } = request.body;
        const { stdout, stderr } = await podman(challenge.functionName, language, data);
        const stdoutSplit = stdout.split("\n")
        // first pop to remove blank string from last \n
        stdoutSplit.pop()
        
        const time = Number(stdoutSplit.pop()?.replace(/TIME DURATION: *([0-9]+)/, function(_, p1: string) {
          return p1
        })) || 0
        const memory = Number(stdoutSplit.pop()?.replace(/MEMORY USAGE: *([0-9]+)/, function(_, p1: string) {
          return p1
        })) || 0
        let success = !stderr;
        reply.code(200)
        reply.send({ stdout: stdoutSplit.join("\n"), stderr, success, time, memory });
      }
    );
  }
}
