import * as SharedProcess from '../SharedProcess/SharedProcess.js'

export const getPid = async () => {
  const pid = await SharedProcess.invoke('Process.getPid')
  return pid
}
