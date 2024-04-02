import * as Assert from '../Assert/Assert.ts'
import * as SharedProcess from '../SharedProcess/SharedProcess.js'

export const exec = (command, args, options) => {
  Assert.string(command)
  Assert.array(args)
  Assert.object(options)
  return SharedProcess.invoke('Exec.exec', command, args, options)
}
