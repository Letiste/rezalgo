import ejs from 'ejs'
import path from 'path'
import {existsSync, mkdirSync, readdirSync, writeFileSync} from "fs"

import {languages} from "../schemas"

const languagesMap = Object.keys(languages).map(language => ({language, languageMap: require(`./languages/${language}Template`).languageMap}))

const challenges = readdirSync(path.join(__dirname, 'challenges')).map(challenge => ({name: challenge.split('.')[0],spec: path.join(__dirname, 'challenges', challenge)}))

challenges.forEach(({name, spec}) => {
  const dirPath = path.join(__dirname, `../../challenges/${name}`)
  if (!existsSync(dirPath)) {
    mkdirSync(dirPath)
  }
  const testsSpec = require(spec)
  languagesMap.forEach(({language, languageMap}) => {
    let data = {...testsSpec, languageMap}
    ejs.renderFile(path.join(__dirname, "./templates/test.ejs"), data, (err, str) => {
        console.log(err)
        writeFileSync(path.join(__dirname, `../dist/tests/${name}/test.${language}`), str)
      })
  })
})
