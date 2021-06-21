export const languageMap = {
  if: ifTemplate,
  fi: "}",
  log: logTemplate,
  exit: "process.exit(1)",
  defFunctionStart: defFunctionStartTemplate,
  defFunctionEnd: "}"
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
  return `if (${calledFunction} !== ${expected}) {`
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
  return `console.error(\`expected ${expected} but was \${${calledFunction}}\`)`
}

function defFunctionStartTemplate({functionName, params}: functionInput): string {
  const calledFunction = functionTemplate({functionName, params})
  return `function ${calledFunction} {`
}