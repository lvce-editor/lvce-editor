import * as Platform from '../Platform/Platform.js'

export const getTerminalSpawnOptions = () => {
  if (Platform.isWindows) {
    return {
      command: 'powershell.exe',
      args: [],
    }
  }
  if (Platform.isMacOs) {
    return {
      command: 'zsh',
      args: ['-i'],
    }
  }
  return {
    command: 'bash',
    args: ['-i'],
  }
}
