import * as ExtensionHostHelperProcess from '../ExtensionHostHelperProcess/ExtensionHostHelperProcess.js'

export const exec = async (command, args, options) => {
  console.log({ command, args, options })
  await ExtensionHostHelperProcess.connect()
  if (Math) {
    throw new Error('not implemented')
  }
  // TODO
  return {
    stdout: '',
    stderr: '',
    exitCode: 0,
  }
}
