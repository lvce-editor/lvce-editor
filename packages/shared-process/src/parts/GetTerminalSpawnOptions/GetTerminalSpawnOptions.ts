import * as Platform from '../Platform/Platform.ts'

export const getTerminalSpawnOptions = (): any => {
  if (Platform.isWindows) {
    return {
      args: [],
      command: 'powershell.exe',
    }
  }
  if (Platform.isMacOs) {
    return {
      args: ['-i'],
      command: 'zsh',
    }
  }
  return {
    args: ['-i'],
    command: 'bash',
  }
}
