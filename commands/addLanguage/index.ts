import * as ejs from 'ejs';
import * as fs from 'fs';
import * as path from 'path';
import * as prompts from 'prompts';
import { languages } from '../../src/schemas';

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
    message: 'Name of the new language: ',
    validate: validate('Name'),
    format: (name: string) => name.toLowerCase(),
  },
  {
    type: 'text',
    name: 'extension',
    message: 'File extension of the new language: ',
    validate: validate('File extension'),
  },
  {
    type: 'text',
    name: 'image',
    message: "Container's image: ",
    validate: validate('Image'),
  },
  {
    type: 'text',
    name: 'runner',
    message: 'Command to run the file: ',
    validate: validate('Command'),
  },
  {
    type: 'text',
    name: 'codeMirrorMode',
    message: 'Name of the new language mode for Code Mirror: ',
    validate: validate('Code Mirror Mode'),
  },
];

(async () => {
  try {
    const { name, extension, image, runner } = await prompts(questions);

    await fs.copyFileSync(
      path.join(__dirname, 'template.ts'),
      path.join(__dirname, `../../src/languagesMap/${extension}Template.ts`),
      fs.constants.COPYFILE_EXCL
    );
    console.log(`The file ${extension}Template.ts was generated in ${path.join(__dirname, '../../src/languagesMap')}`);
    
    const newLanguages: Record<string, unknown> = { ...languages };
    newLanguages[extension] = { name, image, runner };
    await new Promise<void>((resolve, reject) => {
      ejs.renderFile(path.join(__dirname, './languages.ejs'), {languages: newLanguages}, (err, str) => {
        if (err) {
          reject(err);
        }
        resolve(fs.writeFileSync(path.join(__dirname, `../../src/schemas/languages.ts`), str));
      });
    });

    console.log('New language added to the schema');
  } catch (e) {
    throw e;
  }
})();
