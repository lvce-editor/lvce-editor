export const printPrettyError = (prettyError, prefix = '') => {
  console.error(`${prefix}Error: ${prettyError.message}\n\n${prettyError.codeFrame}\n\n${prettyError.stack}`)
}
