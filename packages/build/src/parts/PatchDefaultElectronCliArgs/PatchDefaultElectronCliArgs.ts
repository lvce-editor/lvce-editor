const electronPathCheck = `if (argv[0].endsWith('dist/electron') || argv[0].endsWith('dist\\\\electron.exe')) {`
const defaultAppPathCheck = `if (process.defaultApp || argv[0].endsWith('dist/electron') || argv[0].endsWith('dist\\\\electron.exe')) {`

export const patchDefaultElectronCliArgs = (source: string): string => {
  if (!source.includes(electronPathCheck)) {
    throw new Error('Could not find Electron CLI argument parsing block')
  }
  return source.replace(electronPathCheck, defaultAppPathCheck)
}
