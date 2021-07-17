import { FunctionSignature, LanguageMap, TypeMap } from "./LanguageMap"

/**
 * The mapping used to render the helpers and
 * tests for this language
 */
export const languageMap: LanguageMap = {
  imports: [],
  if: ifTemplate,
  fi: "}",
  log: logTemplate,
  exit: "process.exit(1)",
  functionCalledTemplate: functionCalledTemplate,
  defFunctionStart: defFunctionStartTemplate,
  defFunctionEnd: "}",
  timeStart: "const timeStart = Date.now()",
  timeEnd: "console.log('TIME DURATION: ', Date.now() - timeStart)",
  memoryStart: "const memoryStart = process.memoryUsage().heapUsed",
  memoryEnd: "console.log('MEMORY USAGE: ', process.memoryUsage().heapUsed - memoryStart)",
  comment: commentTemplate,
  variableAffectation: variableAffectation,
}

/**
 * The mapping of the type in the challenge json file
 * and the language
 */
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

/**
 * The function used to render an if condition verifying
 * that given the function and the inputs, the output differs from the expected value
 */
function ifTemplate(actual: string, expected: string): string {
  return `if (${actual} !== ${expected}) {`
}

/**
 * The function used to render the function called with
 * the given inputs
 */
function functionCalledTemplate(name: string, inputs: string[]): string {
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

/**
 * The function used to print to stderr when the if
 * condition is true. It prints the inputs for which
 * it failed and the actual and expected values
 */
function logTemplate(actual: string, inputs: string[], expected: string): string {
  return `console.error(\`Inputs: ${inputs}\nExpected ${expected} but was \${${actual}}\`)`
}

/**
 * The function used to render the structure and the
 * signature of the tested function
 */
function defFunctionStartTemplate({name, params, returnType}: FunctionSignature): string {
  const calledFunction = functionCalledTemplate(name, params.map(param => Object.values(param)[0]))
  let template = "/**\n"
  for (const {name, type} of params) {
    template += ` * @param {${typeMap[type]}} ${name}\n`
  }
  template += ` * @returns {${typeMap[returnType]}}\n`
  template += " */\n"
  template += `function ${calledFunction} {`
  return template
}

/**
 * The function used to comment the given string
 */
function commentTemplate(comment: string): string {
  return (`// ${comment}`)
}

/**
 * The function used to create a variable and affect it a value
 */
function variableAffectation(name: string, _type: keyof TypeMap, value: string): string {
  return `const ${name} = ${value}`
}
