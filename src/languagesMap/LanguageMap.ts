export interface LanguageMap {
  imports: string[];
  beforeCodeUser: string;
  beforeTest: string;
  afterTest: string;
  if: (actual: string, expected: string, type: keyof TypeMap) => string;
  fi: string;
  log: (actual: string, inputs: string[], expected: string) => string;
  exit: string;
  functionCalledTemplate: (name: string, inputs: string[]) => string;
  defFunctionStart: ({ name, params, returnType }: FunctionSignature) => string;
  defFunctionEnd: string;
  timeStart: string;
  timeEnd: string;
  memoryStart: string;
  memoryEnd: string;
  comment: (comment: string) => string;
  variableAffectation: (
    name: string,
    type: keyof TypeMap,
    value: string
  ) => string;
  additionalDataStructures: AdditionalDataStructures;
}
export interface FunctionSignature {
  name: string;
  params: { name: string; type: keyof TypeMap }[];
  returnType: keyof TypeMap;
}

export interface TypeMap {
  float: string;
  integer: string;
  boolean: string;
  string: string;
  'Array<float>': string;
  'Array<integer>': string;
  'Array<boolean>': string;
  'Array<string>': string;
}

interface AdditionalDataStructure {
  implementation: string;
  definition: string;
}

export interface AdditionalDataStructures {
  LinkedList: AdditionalDataStructure;
  TreeNode: AdditionalDataStructure;
}
