import * as GlobalEventBus from '../GlobalEventBus/GlobalEventBus.js'
import * as Preferences from '../Preferences/Preferences.js'
import * as RendererProcess from '../RendererProcess/RendererProcess.js'

const settingName = 'workbench.experimental.modernUI'

const apply = () => {
  return RendererProcess.invoke('Workbench.setModernUi', Preferences.get(settingName) === true)
}

export const hydrate = async () => {
  GlobalEventBus.addListener('preferences.changed', apply)
  await apply()
}
