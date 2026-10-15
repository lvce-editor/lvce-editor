import * as ApplicationRegistry from '../ApplicationRegistry/ApplicationRegistry.ts'
import * as Css from '../Css/Css.js'
import * as GlobalEventBus from '../GlobalEventBus/GlobalEventBus.js'
import * as NormalizeRendererCommands from '../NormalizeRendererCommands/NormalizeRendererCommands.js'
import * as Preferences from '../Preferences/Preferences.js'
import * as RendererProcess from '../RendererProcess/RendererProcess.js'
import * as Viewlet from '../Viewlet/Viewlet.js'
import * as ViewletEditorTextCss from '../ViewletEditorText/ViewletEditorTextCss.js'
import * as ViewletModuleId from '../ViewletModuleId/ViewletModuleId.js'
import * as ViewletStates from '../ViewletStates/ViewletStates.js'

const overrides = new WeakMap<ApplicationRegistry.Application, Readonly<Record<string, unknown>>>()

export const getAll = (applicationId: string): Readonly<Record<string, unknown>> => {
  const application = ApplicationRegistry.assertOpen(applicationId)
  return { ...Preferences.getAll(), ...overrides.get(application) }
}

export const get = (applicationId: string, key: string): unknown => {
  const application = ApplicationRegistry.assertOpen(applicationId)
  const settings = overrides.get(application)
  return settings && Object.hasOwn(settings, key) ? settings[key] : Preferences.get(key)
}

export const update = (applicationId: string, settings: Readonly<Record<string, unknown>>): Promise<void> =>
  ApplicationRegistry.track(applicationId, async () => {
    const application = ApplicationRegistry.assertOpen(applicationId)
    overrides.set(application, { ...overrides.get(application), ...settings })
    const css = ViewletEditorTextCss.getDynamicCss(getAll(applicationId)).replace(':root', () => `#Workbench-${application.layoutUid}`)
    await Css.addCssStyleSheet(`ApplicationPreferences-${application.layoutUid}`, css)
    for (const uid of ApplicationRegistry.getUids(applicationId)) {
      if (ViewletStates.getByUid(uid)?.moduleId === ViewletModuleId.EditorText) {
        await Viewlet.executeViewletCommand(uid, 'handleSettingsChanged')
      }
    }
  })

export const dispose = async (applicationId: string): Promise<void> => {
  const application = ApplicationRegistry.get(applicationId)
  if (!overrides.has(application)) return
  overrides.delete(application)
  const cssId = `ApplicationPreferences-${application.layoutUid}`
  NormalizeRendererCommands.removeCssText(cssId)
  await RendererProcess.invoke('Css.removeCssStyleSheet', cssId)
}

GlobalEventBus.addListener('preferences.changed', async () => {
  for (const applicationId of ApplicationRegistry.getOpenIds()) {
    try {
      await update(applicationId, {})
    } catch (error) {
      if (ApplicationRegistry.isOpen(applicationId)) throw error
    }
  }
})
