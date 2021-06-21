export const languageMap = {
  import: "import sys",
  if: ifTemplate,
  fi: "",
  log: logTemplate,
  exit: "sys.exit(1)",
  defFunctionStart: defFunctionStartTemplate,
  defFucntionEnd: ""
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
  return `print(f'expected ${expected} but was {${calledFunction}}', file=sys.stderr)`
}

function defFunctionStartTemplate({functionName, params}: functionInput): string {
  const calledFunction = functionTemplate({functionName, params})
  return `def ${calledFunction} :`
}