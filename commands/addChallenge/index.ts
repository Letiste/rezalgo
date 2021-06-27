import path from 'path';
import ejs from 'ejs';
import fs from 'fs';
import slugify from 'slugify';

(async () => {
  const challengeName = process.argv[2];
  if (!challengeName) {
    throw new Error("No challenge's name provided.");
  }
  const slugName = slugify(challengeName, { lower: true });
  await new Promise<void>((resolve, reject) => {
    ejs.renderFile(path.join(__dirname, './challenge.ejs'), { name: challengeName }, (err, str) => {
      if (err) {
        reject(err);
      }
      resolve(fs.writeFileSync(path.join(__dirname, `../../challenges/${slugName}.json`), str, {flag: 'wx'}));
    });
  });
  console.log(`New challenge file ${slugName}.json added in ${path.join(__dirname, '../../challenges')}`);
})();
