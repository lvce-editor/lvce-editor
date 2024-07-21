import * as GetKeyOptions from '../GetKeyOptions/GetKeyOptions.ts'
import * as Rpc from '../Rpc/Rpc.ts'

export const press = async (key: string) => {
  const keyOptions = GetKeyOptions.getKeyOptions(key)
  const options = {
    cancelable: true,
    bubbles: true,
    ...keyOptions,
  }
  await Rpc.invoke('TestFrameWork.performKeyBoardAction', 'press', options)
}
