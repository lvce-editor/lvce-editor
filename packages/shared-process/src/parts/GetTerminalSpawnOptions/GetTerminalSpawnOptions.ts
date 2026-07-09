import * as Platform from '../Platform/Platform.ts'

export const getTerminalSpawnOptions = (): any => {
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
