import { FunctionCalled, FunctionSignature, LanguageMap, TemplateExpected, TypeMap } from "./LanguageMap"

export const languageMap: LanguageMap = {
  imports: [],
  if: ifTemplate,
  fi: "}",
  log: logTemplate,
  exit: "process.exit(1)",
  defFunctionStart: defFunctionStartTemplate,
  defFunctionEnd: "}",
  timeStart: "const timeStart = Date.now()",
  timeEnd: "console.log('TIME DURATION: ', Date.now() - timeStart)",
  memoryStart: "const memoryStart = process.memoryUsage().heapUsed",
  memoryEnd: "console.log('MEMORY USAGE: ', process.memoryUsage().heapUsed - memoryStart)",
  comment: commentTemplate,
}

const typeMap: TypeMap = {
  float: "number",
  integer: "number",
  boolean: "boolean",
  string: "string",
  "Array<float>": "number[]",
  "Array<integer>": "number[]",
  "Array<boolean>": "boolean[]",
  "Array<string>": "string[]",
}

function ifTemplate({name, inputs, expected}: TemplateExpected): string {
  const calledFunction = functionCalledTemplate({name, inputs})
  return `if (${calledFunction} !== ${expected}) {`
}

function functionCalledTemplate({name, inputs}: FunctionCalled): string {
  let template = `${name}(`
  inputs.forEach((input, index) => {
    if (index === inputs.length - 1) {
      template += `${input})`
    } else {
      template += `${input}, `
    }
  })
  return template
}

function logTemplate({name, inputs, expected}: TemplateExpected): string {
  const calledFunction = functionCalledTemplate({name, inputs})
  return `console.error(\`Inputs: ${inputs}\nExpected ${expected} but was \${${calledFunction}}\`)`
}

function defFunctionStartTemplate({name, params, returnType}: FunctionSignature): string {
  const calledFunction = functionCalledTemplate({name, inputs: params.map(param => Object.values(param)[0]) })
  let template = "/**\n"
  for (const {name, type} of params) {
    template += ` * @param {${typeMap[type]}} ${name}\n`
  }
  template += ` * @returns {${typeMap[returnType]}}\n`
  template += " */\n"
  template += `function ${calledFunction} {`
  return template
}

function commentTemplate(comment: string): string {
  return (`// ${comment}`)
}