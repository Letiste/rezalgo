import ejs from 'ejs'
import path from 'path'
import {existsSync, mkdirSync, readdirSync, writeFileSync} from "fs"

import {languages} from "../languages"

const languagesTemplate = Object.keys(languages).map(language => ({language, template: require(`./${language}Template`).template}))

const challenges = readdirSync(path.join(__dirname, 'challenges')).map(challenge => ({name: challenge.split('.')[0],spec: path.join(__dirname, 'challenges', challenge)}))

challenges.forEach(({name, spec}) => {
  const dirPath = path.join(__dirname, `../challenges/${name}`)
  if (!existsSync(dirPath)) {
    mkdirSync(dirPath)
  }
  const testsSpec = require(spec)
  languagesTemplate.forEach(({language, template}) => {
    let data = {...testsSpec, template}
    ejs.renderFile(path.join(__dirname, "index.ejs"), data, (err, str) => {
        console.log(err)
        writeFileSync(path.join(__dirname, `../challenges/${name}/index.${language}`), str)
      })
  })
})
