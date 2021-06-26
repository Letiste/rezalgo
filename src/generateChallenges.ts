import ejs from 'ejs'
import path from 'path'
import {existsSync, mkdirSync, readdirSync, writeFileSync} from "fs"

import {languages} from "./schemas"

const languagesMap = Object.keys(languages).map(language => ({language, languageMap: require(`./languagesMap/${language}Template`).languageMap}))
/**
 * Generate the helpers (structure of the function for the challenge)
 * and the tests based on the json definition
 */

async function generateChallenges() {
  console.log("Creating challenges...")
  const challenges = readdirSync(path.join(__dirname, '../challenges')).map(challenge => ({name: challenge.split('.')[0],spec: path.join(__dirname, '../challenges', challenge)}))
  const promises: Promise<void>[] = []
  challenges.forEach(({name, spec}) => {
    const challengesSpec = require(spec)
    
    promises.push(generateHelpers(challengesSpec, name))
    promises.concat(generateTests(challengesSpec, name))
  })
  
  await Promise.all(promises)
  console.log("Challenges created")
}

generateChallenges()

function generateHelpers(challengesSpec: any, name: string) {
  const dirPath = path.join(__dirname, `../dist/helpers/${name}`)
  if (!existsSync(dirPath)) {
    mkdirSync(dirPath, {recursive: true})
  }
  let data = {...challengesSpec, helpers: languagesMap}
  return new Promise<void>((resolve, reject) => {ejs.renderFile(path.join(__dirname, "./templates/helpers.ejs"), data, (err, str) => {
    if (err) {
      reject(err)
    }
    resolve(writeFileSync(path.join(__dirname, `../dist/helpers/${name}/index.ts`), str))
  })
})
}

function generateTests(challengesSpec: any, name: string) {
  const dirPath = path.join(__dirname, `../dist/tests/${name}`)
  if (!existsSync(dirPath)) {
    mkdirSync(dirPath, {recursive: true})
  }
  const promises: Promise<void>[] = []
  languagesMap.forEach(({language, languageMap}) => {
    let data = {...challengesSpec, languageMap}
    let promise = new Promise<void>((resolve, reject) => {
      ejs.renderFile(path.join(__dirname, "./templates/test.ejs"), data, (err, str) => {
        if (err) {
          reject(err)
        }
        resolve(writeFileSync(path.join(__dirname, `../dist/tests/${name}/test.${language}`), str))
      })
    })
    promises.push(promise)
  })
  return promises
}
