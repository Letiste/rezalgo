import { FunctionCalled, FunctionSignature, LanguageMap, TemplateExpected, TypeMap } from './LanguageMap';

export const languageMap: LanguageMap = {
  imports: ['import sys', 'import time', 'import resource'],
  if: ifTemplate,
  fi: '',
  log: logTemplate,
  exit: 'sys.exit(1)',
  defFunctionStart: defFunctionStartTemplate,
  defFunctionEnd: '',
  timeStart: 'timeStart = int(round(time.time() * 1000))',
  timeEnd: "print('TIME DURATION: ', int(round(time.time() * 1000)) - timeStart)",
  memoryStart: '',
  memoryEnd: "print('MEMORY USAGE: ', resource.getrusage(resource.RUSAGE_SELF).ru_maxrss)",
  comment: commentTemplate,
};

const typeMap: TypeMap = {
  float: 'float',
  integer: 'int',
  boolean: 'bool',
  string: 'str',
  "Array<float>": 'list[float]',
  "Array<integer>": 'list[int]',
  "Array<boolean>": 'list[bool]',
  "Array<string>": 'list[str]',
};

function ifTemplate({ name, inputs, expected }: TemplateExpected): string {
  const calledFunction = functionCalledTemplate({ name, inputs });
  return `if (${calledFunction} != ${expected}) :`;
}

function functionCalledTemplate({ name, inputs }: FunctionCalled): string {
  let template = `${name}(`;
  inputs.forEach((input, index) => {
    if (index === inputs.length - 1) {
      template += `${input})`;
    } else {
      template += `${input}, `;
    }
  });
  return template;
}

function logTemplate({ name, inputs, expected }: TemplateExpected): string {
  const calledFunction = functionCalledTemplate({ name, inputs });
  return `print(f"""Inputs: ${inputs}\nExpected ${expected} but was {${calledFunction}}""", file=sys.stderr)`;
}

function defFunctionStartTemplate({ name, params, returnType }: FunctionSignature): string {
  let calledFunction = `${name}(`;
  params.forEach(({ name, type }, index) => {
    calledFunction += `${name}: ${typeMap[type]}`;
    if (index < params.length - 1) {
      calledFunction += ", "
    }
  });
  calledFunction += `) -> ${typeMap[returnType]}`
  return `def ${calledFunction} :`;
}

function commentTemplate(comment: string): string {
  return `# ${comment}`;
}
