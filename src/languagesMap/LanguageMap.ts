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
  memoryEnd: string
}