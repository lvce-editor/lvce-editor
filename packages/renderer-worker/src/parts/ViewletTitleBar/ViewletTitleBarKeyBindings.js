import * as TitleBarWorker from '../TitleBarWorker/TitleBarWorker.js'

export const getKeyBindings = () => {
  return TitleBarWorker.invoke('TitleBar.getKeyBindings')
}
