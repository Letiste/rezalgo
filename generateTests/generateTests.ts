import ejs from 'ejs'
import path from 'path'
import {readdirSync, writeFileSync} from "fs"

import {languages} from "../languages"

const languagesTemplate = Object.keys(languages).map(language => ({language, template: require(`./${language}Template`).template}))

const challenges = readdirSync(path.join(__dirname, 'challenges')).map(challenge => path.join(__dirname, 'challenges', challenge))

challenges.forEach(challenge => {
  const testsSpec = require(challenge)
  console.log(testsSpec)
  languagesTemplate.forEach(({language, template}) => {
    let data = {...testsSpec, template}
    console.log("DATA", data)
    ejs.renderFile(path.join(__dirname, "index.ejs"), data, (err, str) => {
        console.log(str)
        console.log(err)
        writeFileSync(path.join(__dirname, `../challenges/add/index.${language}`), str)
      })
  })
})

// const data = {tests: [{functionName: "add", params: ["2", "3"], expected: "5"}], template: jsTemplate}
// let template = ejs.renderFile(path.join(__dirname, "index.ejs"), data, (err, str) => {
//   console.log(str)
//   writeFileSync(path.join(__dirname, "../challenges/add/index.js"), str)
// })

// const data2 = {tests: [{functionName: "add", params: ["2", "3"], expected: "5"}], template: pyTemplate}
// let template2 = ejs.renderFile(path.join(__dirname, "index.ejs"), data2, (err, str) => {
//   console.log(str)
//   fs.writeFileSync(path.join(__dirname, "../challenges/add/index.py"), str)
// })