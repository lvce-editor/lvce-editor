import * as Platform from '../Platform/Platform.js'

export const getTerminalSpawnOptions = () => {
  if (Platform.isWindows) {
    return {
      command: 'powershell.exe',
      args: [],
    }
  }
  return {
    command: 'bash',
    args: ['-i'],
  }
}
