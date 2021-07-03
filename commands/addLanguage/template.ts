import { LanguageMap } from "./LanguageMap"

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

interface functionInput {
  functionName: string,
  params: string[]
}
interface templateInput extends functionInput {
  expected: string
}

function ifTemplate({functionName, params, expected}: templateInput): string {
  return ""
}

function logTemplate({functionName, params, expected}: templateInput): string {
  return ""
}

function defFunctionStartTemplate({functionName, params}: functionInput): string {
  return ""
}

function commentTemplate(comment: string): string {
  return ""
}