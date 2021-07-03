import { LanguageMap } from "./LanguageMap"

export const languageMap: LanguageMap = {
  imports: ["import sys","import time", "import resource"],
  if: ifTemplate,
  fi: "",
  log: logTemplate,
  exit: "sys.exit(1)",
  defFunctionStart: defFunctionStartTemplate,
  defFunctionEnd: "",
  timeStart: "timeStart = int(round(time.time() * 1000))",
  timeEnd: "print('TIME DURATION: ', int(round(time.time() * 1000)) - timeStart)",
  memoryStart: "",
  memoryEnd: "print('MEMORY USAGE: ', resource.getrusage(resource.RUSAGE_SELF).ru_maxrss)"
}

interface functionInput {
  functionName: string,
  params: string[]
}
interface templateInput extends functionInput {
  expected: string
}

function ifTemplate({functionName, params, expected}: templateInput): string {
  const calledFunction = functionTemplate({functionName, params})
  return `if (${calledFunction} != ${expected}) :`
}

function functionTemplate({functionName, params}: functionInput): string {
  let template = `${functionName}(`
  params.forEach((param, index) => {
    if (index === params.length - 1) {
      template += `${param})`
    } else {
      template += `${param}, `
    }
  })
  return template
}

function logTemplate({functionName, params, expected}: templateInput): string {
  const calledFunction = functionTemplate({functionName, params})
  return `print(f"""Inputs: ${params}\nExpected ${expected} but was {${calledFunction}}""", file=sys.stderr)`
}

function defFunctionStartTemplate({functionName, params}: functionInput): string {
  const calledFunction = functionTemplate({functionName, params})
  return `def ${calledFunction} :`
}