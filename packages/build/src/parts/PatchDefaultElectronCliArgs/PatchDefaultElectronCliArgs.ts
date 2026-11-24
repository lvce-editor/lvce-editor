const electronPathCheck = `if (argv[0].endsWith('dist/electron') || argv[0].endsWith('dist\\\\electron.exe')) {
    parsedArgs._ = parsedArgs._.slice(1);
  }`
const defaultAppPathCheck = `if (process.defaultApp || argv[0].endsWith('dist/electron') || argv[0].endsWith('dist\\\\electron.exe')) {
    // Some Linux system Electron launchers pass the application path twice.
    // Check adjacency in argv so an explicit path after -- is preserved.
    const [appPath, firstArgument] = parsedArgs._;
    const appPathIndex = relevantArgv.indexOf(appPath);
    const hasDuplicateAppPath = process.platform === 'linux' && process.defaultApp &&
      appPathIndex !== -1 && firstArgument === appPath && relevantArgv[appPathIndex + 1] === appPath;
    parsedArgs._ = parsedArgs._.slice(hasDuplicateAppPath ? 2 : 1);
  }`

export const patchDefaultElectronCliArgs = (source: string): string => {
  if (!source.includes(electronPathCheck)) {
    throw new Error('Could not find Electron CLI argument parsing block')
  }
  return source.replace(electronPathCheck, defaultAppPathCheck)
}
