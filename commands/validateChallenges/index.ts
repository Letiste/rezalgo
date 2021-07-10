import Ajv from "ajv";
import { readdirSync } from "fs";
import * as path from "path";
const ajv = new Ajv();

import * as schema from '../../challenges.schema.json';

const challenges = readdirSync(path.join(__dirname, '../../challenges')).map((file) => [require(path.join(__dirname, '../../challenges', file)), file]);

const validate = ajv.compile(schema)

for (const [challenge, file] of challenges) {
  let valid = validate(challenge)
  if (!valid) {
    throw new Error(`Challenge ${file} is not valid. Property ${validate.errors![0].instancePath} ${validate.errors![0].message}.`)
  }
}