import ejs from 'ejs'
import path from 'path'
import {existsSync, mkdirSync, readdirSync, writeFileSync} from "fs"

import {languages} from "../schemas"

const languagesMap = Object.keys(languages).map(language => ({language, languageMap: require(`./languagesMap/${language}Template`).languageMap}))

const challenges = readdirSync(path.join(__dirname, 'challenges')).map(challenge => ({name: challenge.split('.')[0],spec: path.join(__dirname, 'challenges', challenge)}))

challenges.forEach(({name, spec}) => {
  const challengesSpec = require(spec)
  
  generateHelpers(challengesSpec, name)
  generateTests(challengesSpec, name)
  
})

function generateHelpers(challengesSpec: any, name: string) {
  const dirPath = path.join(__dirname, `../dist/helpers/${name}`)
  console.log(dirPath)
  if (!existsSync(dirPath)) {
    console.log("create dir")
    mkdirSync(dirPath, {recursive: true})
  }
  let data = {...challengesSpec, helpers: languagesMap}
  console.log(data)
  ejs.renderFile(path.join(__dirname, "./templates/helpers.ejs"), data, (err, str) => {
    console.log(err)
    writeFileSync(path.join(__dirname, `../dist/helpers/${name}/index.ts`), str)
  })
}

function generateTests(challengesSpec: any, name: string) {
  const dirPath = path.join(__dirname, `../dist/tests/${name}`)
  console.log(dirPath)
  if (!existsSync(dirPath)) {
    console.log("create dir")
    mkdirSync(dirPath, {recursive: true})
  }
  languagesMap.forEach(({language, languageMap}) => {
    let data = {...challengesSpec, languageMap}
    ejs.renderFile(path.join(__dirname, "./templates/test.ejs"), data, (err, str) => {
        console.log(err)
        writeFileSync(path.join(__dirname, `../dist/tests/${name}/test.${language}`), str)
      })
  })
}
