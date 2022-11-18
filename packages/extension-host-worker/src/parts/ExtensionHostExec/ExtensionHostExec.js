import * as ExtensionHostHelperProcess from '../ExtensionHostHelperProcess/ExtensionHostHelperProcess.js'

export const exec = async (command, args, options) => {
  console.log({ command, args, options })
  const response = await ExtensionHostHelperProcess.invoke(
    'Exec.exec',
    command,
    args
  )
  console.log({ response })

  // TODO
  return {
    stdout: '',
    stderr: '',
    exitCode: 0,
  }
}
