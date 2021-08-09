import * as path from 'path';
import { FastifyInstance } from 'fastify';
import { readdirSync } from 'fs';
import { FromSchema } from 'json-schema-to-ts';
import * as marked from "marked";
import slugify from 'slugify';

import { containerInputSchema, containerOutputSchema, languages, postSchema, getSchema } from './schemas';
import { runChallenge } from './runChallenge';

const challenges = readdirSync(path.join(__dirname, '../challenges')).map((file) => require(path.join(__dirname, '../challenges', file)));

const themes = readdirSync(path.join(__dirname, "../public/theme")).map((file) => file.split(".")[0])

export default async function routes(fastify: FastifyInstance) {
  for (const challenge of challenges) {
    challenge.description = marked(challenge.description)
    for (const example of challenge.examples) {
      example.input = marked(example.input)
      example.output = marked(example.output)
    }
    const slugName = slugify(challenge.name, {lower: true})
    fastify.get(`/${slugName}`,{schema: getSchema }, async (_, reply) => {
      reply.view('/view/index.ejs', {
        languages,
        challenge,
        helpers: require(path.join(__dirname, `../helpers/${slugName}`))
          .helpers,
          themes
      });
    });

    fastify.post<{ Body: FromSchema<typeof containerInputSchema>, Response: FromSchema<typeof containerOutputSchema>}>(
      `/${slugName}`,
      { schema: postSchema },
      async function (request, reply) {
        const {memoryLimit, timeLimit} = challenge
        const { language, data } = request.body;
        let { stdout, stderr } = await runChallenge(slugName, language, data);
        let stdoutSplit = stdout.split("\n")

        // first pop to remove blank string from last \n
        stdoutSplit.pop()
        
        const time = Number(stdoutSplit.pop()?.replace(/TIME DURATION: *([0-9]+)/, function(_, p1: string) {
          return p1
        })) || 0
        if (time > timeLimit) {
          stderr += `Timit limit exceeded ${timeLimit}ms\n`
        }
        const memory = Number(stdoutSplit.pop()?.replace(/MEMORY USAGE: *([0-9]+)/, function(_, p1: string) {
          return p1
        })) || 0
        if (memory / 1024**2 > memoryLimit) {
          stderr += `Memory usage exceeded ${memoryLimit}MB\n`
        }
        let success = ""
        if (!stderr) {
          success = challenge.flag;
        }
        reply.code(200)
        reply.send({ stdout: stdoutSplit.join("<br>"), stderr: stderr.replace(/\n/g, "<br>"), success, time, memory });
      }
    );
  }

  fastify.get('*', function (_, reply) {
    reply.view('/view/404.ejs', {
      challenges: challenges.map(challenge => ({name: challenge.name, url: slugify(challenge.name, {lower: true})}))
    })
  })
}
