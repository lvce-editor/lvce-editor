import * as TitleBarWorker from '../TitleBarWorker/TitleBarWorker.js'

export const getKeyBindings = async () => {
  const keyBindings = await TitleBarWorker.invoke('TitleBarMenuBar.getKeyBindings')
  return keyBindings
}
