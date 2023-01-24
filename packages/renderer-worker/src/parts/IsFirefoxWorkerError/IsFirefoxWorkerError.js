export const isFirefoxWorkerError = (message) => {
  return [
    'SyntaxError: import declarations may only appear at top level of a module',
    'SyntaxError: export declarations may only appear at top level of a module',
  ].includes(message)
}
