export const exit = (code) => {
  process.exit(code)
}

export const setExitCode = (exitCode) => {
  process.exitCode = exitCode
}
