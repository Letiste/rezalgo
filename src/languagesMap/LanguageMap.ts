export interface LanguageMap {
  imports: string[],
  if: (...args: any) => string,
  fi: string,
  log: (...args: any) => string,
  exit: string,
  defFunctionStart: (...args: any) => string,
  defFunctionEnd: string,
  timeStart: string,
  timeEnd: string,
  memoryStart: string,
  memoryEnd: string,
  comment: (comment: string) => string,
}

export interface FunctionCalled {
  name: string,
  inputs: string[],
}
export interface TemplateExpected extends FunctionCalled {
  expected: string
}

export interface FunctionSignature {
  name: string,
  params: {name: string, type: keyof TypeMap}[],
  returnType: keyof TypeMap
}

export interface TypeMap {
  float: string,
  integer: string,
  boolean: string,
  string: string,
  "Array<float>": string,
  "Array<integer>": string,
  "Array<boolean>": string,
  "Array<string>": string,
}
