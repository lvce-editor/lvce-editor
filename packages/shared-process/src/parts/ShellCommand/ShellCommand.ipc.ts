import * as ShellCommand from './ShellCommand.ts'

export const name = 'ShellCommand'

export const Commands = {
  getMenuEntries: ShellCommand.getMenuEntries,
  install: ShellCommand.install,
}
