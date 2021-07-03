import { FunctionCalled, FunctionSignature, LanguageMap, TemplateExpected, TypeMap } from "./LanguageMap"

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

const typeMap: TypeMap = {
  float: "",
  integer: "",
  boolean: "",
  string: ""
}

function ifTemplate({functionName, inputs, expected}: TemplateExpected): string {
  return ""
}

function functionCalledTempalte({name, inputs}: FunctionCalled): string {
  return ""
}

function logTemplate({functionName, inputs, expected}: TemplateExpected): string {
  return ""
}

function defFunctionStartTemplate({name, params, returnType}: FunctionSignature): string {
  return ""
}

function commentTemplate(comment: string): string {
  return ""
}