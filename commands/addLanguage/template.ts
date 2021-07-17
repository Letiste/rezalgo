import { FunctionSignature, LanguageMap, TypeMap } from './LanguageMap';

/**
 * The mapping used to render the helpers and
 * tests for this language
 */
export const languageMap: LanguageMap = {
  imports: [],
  beforeCodeUser: "",
  beforeTest: "",
  afterTest: "",
  if: ifTemplate,
  fi: "",
  log: logTemplate,
  exit: "",
  functionCalledTemplate: functionCalledTemplate,
  defFunctionStart: defFunctionStartTemplate,
  defFunctionEnd: "",
  timeStart: "",
  timeEnd: "",
  memoryStart: "",
  memoryEnd: "",
  comment: commentTemplate,
  variableAffectation: variableAffectation,
}

/**
 * The mapping of the type in the challenge json file
 * and the language
 */
const typeMap: TypeMap = {
  float: "",
  integer: "",
  boolean: "",
  string: "",
  "Array<float>": "",
  "Array<integer>": "",
  "Array<boolean>": "",
  "Array<string>": "",
}

/**
 * The function used to render an if condition verifying
 * that given the function and the inputs, the output differs from the expected value
 */
function ifTemplate(actual: string, expected: string): string {
  return ``
}

/**
 * The function used to render the function called with
 * the given inputs
 */
function functionCalledTemplate(name: string, inputs: string[]): string {
  return ``
}

/**
 * The function used to print to stderr when the if
 * condition is true. It prints the inputs for which
 * it failed and the actual and expected values
 */
function logTemplate(actual: string, inputs: string[], expected: string): string {
  return ``
}

/**
 * The function used to render the structure and the
 * signature of the tested function
 */
function defFunctionStartTemplate({name, params, returnType}: FunctionSignature): string {
  return ``
}

/**
 * The function used to comment the given string
 */
function commentTemplate(comment: string): string {
  return ``
}

/**
 * The function used to create a variable and affect it a value
 */
function variableAffectation(name: string, type: keyof TypeMap, value: string) {
  return ``
}
