const promptFlag = '--prompt'
const promptWithValuePrefix = `${promptFlag}=`

export const isPromptMode = (argv: readonly string[]): boolean => {
  return argv.some((argument) => argument === promptFlag || argument.startsWith(promptWithValuePrefix))
}
