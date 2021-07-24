import * as path from 'path';
import * as ejs from 'ejs';
import * as fs from 'fs';
import * as prompts from 'prompts';
import slugify from 'slugify';

function validate(inputName: string) {
  return (input: string) => {
    if (input.trim().length === 0) {
      return `${inputName} cannot be empty.`;
    }
    return true;
  };
}

const questions: prompts.PromptObject[] = [
  {
    type: 'text',
    name: 'name',
    message: 'Name of the new challenge: ',
    validate: validate('Name'),
  }
];

(async () => {
  const {name} = await prompts(questions);
  if (!name) {
    throw new Error("No challenge's name provided.");
  }
  const slugName = slugify(name, { lower: true });
  await new Promise<void>((resolve, reject) => {
    ejs.renderFile(path.join(__dirname, './challenge.ejs'), { name: name }, (err: Error | null, str: string) => {
      if (err) {
        reject(err);
      }
      resolve(fs.writeFileSync(path.join(__dirname, `../../challenges/${slugName}.json`), str, {flag: 'wx'}));
    });
  });
  console.log(`New challenge file ${slugName}.json added in ${path.join(__dirname, '../../challenges')}`);
})();
