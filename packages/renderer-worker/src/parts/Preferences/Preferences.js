import * as Command from '../Command/Command.js'
import * as Platform from '../Platform/Platform.js'
import * as SharedProcess from '../SharedProcess/SharedProcess.js'
import * as FileSystem from '../FileSystem/FileSystem.js'
import * as Json from '../Json/Json.js'
import * as RendererProcess from '../RendererProcess/RendererProcess.js'

export const state = Object.create(null)

export const openSettingsJson = async () => {
  await Command.execute(
    /* Main.openUri */ 'Main.openUri',
    /* uri */ 'app://settings.json'
  )
}

export const openKeyBindingsJson = async () => {
  await Command.execute(
    /* Main.openUri */ 'Main.openUri',
    /* uri */ 'app://keyBindings.json'
  )
}

// TODO command for opening workspace settings

const getPreferencesJson = async () => {
  if (Platform.getPlatform() === 'web') {
    const cachedPreferences = await Command.execute(
      /* LocalStorage.getJson */ 'LocalStorage.getJson',
      /* key */ 'preferences'
    )
    if (cachedPreferences) {
      return cachedPreferences
    }
    const assetDir = Platform.getAssetDir()
    const url = `${assetDir}/config/defaultSettings.json`
    return Command.execute(/* Ajax.getJson */ 'Ajax.getJson', /* url */ url)
  }
  return SharedProcess.invoke(/* Preferences.getAll */ 'Preferences.getAll')
}

const getPreferences = async () => {
  // TODO cache preferences, but they should not be stale
  const preferences = getPreferencesJson()
  return preferences
}

export const hydrate = async () => {
  // TODO should configuration be together with all other preferences (e.g. selecting color theme code is not needed on startup)
  // TODO probably not all preferences need to be kept in memory
  const preferences = await getPreferences()
  Object.assign(state, preferences)

  const styles = []
  const fontSize = preferences['editor.fontSize']
  if (fontSize) {
    styles.push(`  --EditorFontSize: ${fontSize}px;`)
  }
  const fontFamily = preferences['editor.fontFamily']
  if (fontFamily) {
    styles.push(`  --EditorFontFamily: ${fontFamily};`)
  }
  const lineHeight = preferences['editor.lineHeight']
  if (lineHeight) {
    styles.push(`  --EditorLineHeight: ${lineHeight}px;`)
  }
  const letterSpacing = preferences['editor.letterSpacing']
  if (letterSpacing) {
    styles.push(`  --EditorLetterSpacing: ${letterSpacing}px;`)
  }
  const css = `:root {
${styles.join('\n')}
}`
  // TODO make Css.setInlineStyle a separate module in renderer-worker
  await RendererProcess.invoke(
    /* Css.setInlineStyle */ 'Css.setInlineStyle',
    /* id */ 'Settings',
    /* css */ css
  )
}

export const get = (key) => {
  return state[key]
}

export const set = async (key, value) => {
  state[key] = value
  if (Platform.getPlatform() === 'web') {
    const preferences = { ...state, [key]: value }
    await Command.execute(
      /* LocalStorage.setJson */ 'LocalStorage.setJson',
      /* key */ 'preferences',
      /* value */ preferences
    )
    return
  }
  const content = Json.stringify(state)
  await FileSystem.writeFile(`app://settings.json`, content)
}
