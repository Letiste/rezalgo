import { FunctionCalled, FunctionSignature, LanguageMap, TemplateExpected, TypeMap } from "./LanguageMap"

/**
 * The mapping used to render the helpers and
 * tests for this language
 */
export const languageMap: LanguageMap = {
  imports: [],
  if: ifTemplate,
  fi: "",
  log: logTemplate,
  exit: "",
  defFunctionStart: defFunctionStartTemplate,
  defFunctionEnd: "",
  timeStart: "",
  timeEnd: "",
  memoryStart: "",
  memoryEnd: "",
  comment: commentTemplate,
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
function ifTemplate({functionName, inputs, expected}: TemplateExpected): string {
  return ""
}

/**
 * A helper function to render the function called with
 * the given inputs
 */
function functionCalledTemplate({name, inputs}: FunctionCalled): string {
  return ""
}

/**
 * The function used to print to stderr when the if
 * condition is true. It prints the inputs for which
 * it failed and the actual and expected values
 */
function logTemplate({functionName, inputs, expected}: TemplateExpected): string {
  return ""
}

/**
 * The function used to render the structure and the
 * signature of the tested function
 */
function defFunctionStartTemplate({name, params, returnType}: FunctionSignature): string {
  return ""
}

/**
 * The function used to comment the given string
 */
function commentTemplate(comment: string): string {
  return ""
}