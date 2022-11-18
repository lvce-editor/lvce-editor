import * as ExtensionHostHelperProcess from '../ExtensionHostHelperProcess/ExtensionHostHelperProcess.js'

export const exec = async (command, args, options) => {
  console.log({ command, args, options })
  const response = await ExtensionHostHelperProcess.connect()

  // TODO
  return {
    stdout: '',
    stderr: '',
    exitCode: 0,
  }
}
