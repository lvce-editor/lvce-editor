import * as Assert from '../Assert/Assert.ts'
import * as MainProcess from '../MainProcess/MainProcess.ts'

export const writeText = (text: string): Promise<void> => {
  Assert.string(text)
  return MainProcess.invoke('ElectronClipBoard.writeText', text)
}
