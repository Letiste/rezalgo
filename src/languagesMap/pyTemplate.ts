import { FunctionCalled, FunctionSignature, LanguageMap, TemplateExpected, TypeMap } from './LanguageMap';

/**
 * The mapping used to render the helpers and
 * tests for this language
 */
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

/**
 * The mapping of the type in the challenge json file
 * and the language
 */
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

/**
 * The function used to render an if condition verifying
 * that given the function and the inputs, the output differs from the expected value
 */
function ifTemplate({ name, inputs, expected }: TemplateExpected): string {
  const calledFunction = functionCalledTemplate({ name, inputs });
  return `if (${calledFunction} != ${expected}) :`;
}

/**
 * A helper function to render the function called with
 * the given inputs
 */
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

/**
 * The function used to print to stderr when the if
 * condition is true. It prints the inputs for which
 * it failed and the actual and expected values
 */
function logTemplate({ name, inputs, expected }: TemplateExpected): string {
  const calledFunction = functionCalledTemplate({ name, inputs });
  return `print(f"""Inputs: ${inputs}\nExpected ${expected} but was {${calledFunction}}""", file=sys.stderr)`;
}

/**
 * The function used to render the structure and the
 * signature of the tested function
 */
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

/**
 * The function used to comment the given string
 */
function commentTemplate(comment: string): string {
  return `# ${comment}`;
}
