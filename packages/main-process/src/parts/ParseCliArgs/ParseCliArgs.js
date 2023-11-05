import minimist from 'minimist'
import * as Debug from '../Debug/Debug.js'
import * as CliCommandType from '../CliCommandType/CliCommandType.js'

export const parseCliArgs = (argv) => {
  const CLI_OPTIONS = {
    boolean: [
      CliCommandType.Version,
      CliCommandType.Help,
      CliCommandType.Wait,
      CliCommandType.BuiltinSelfTest,
      CliCommandType.Web,
      CliCommandType.SandBox,
    ],
    alias: {
      version: 'v',
    },
    default: {
      sandbox: false,
    },
  }
  Debug.debug('[info] parsing argv')
  const relevantArgv = argv.slice(1)
  const parsedArgs = minimist(relevantArgv, CLI_OPTIONS)
  // TODO tree-shake this out
  if (argv[0].endsWith('dist/electron') || argv[0].endsWith('dist\\electron.exe')) {
    parsedArgs._ = parsedArgs._.slice(1)
  }
  return parsedArgs
}
