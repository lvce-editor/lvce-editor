import * as Command from '../Command/Command.js'
import * as Editor from '../Editor/Editor.js'
import * as ExtensionHostSemanticTokens from '../ExtensionHost/ExtensionHostSemanticTokens.js'
// import * as ExtensionHostTextDocument from '../ExtensionHost/ExtensionHostTextDocument.js'
import * as EditorCommandSetLanguageId from '../EditorCommand/EditorCommandSetLanguageId.js'
import * as FileSystem from '../FileSystem/FileSystem.js'
import * as Font from '../Font/Font.js'
import * as GlobalEventBus from '../GlobalEventBus/GlobalEventBus.js'
import * as Id from '../Id/Id.js'
import * as JoinLines from '../JoinLines/JoinLines.js'
import * as Languages from '../Languages/Languages.js'
import * as Platform from '../Platform/Platform.js'
import * as Preferences from '../Preferences/Preferences.js'
import * as Tokenizer from '../Tokenizer/Tokenizer.js'
import * as Viewlet from '../Viewlet/Viewlet.js'
import * as ViewletStates from '../ViewletStates/ViewletStates.js'
import * as Workspace from '../Workspace/Workspace.js'

const COLUMN_WIDTH = 9 // TODO compute this automatically once

const getContent = async (uri) => {
  const content = await FileSystem.readFile(uri)
  return content ?? 'content could not be loaded'
}

// TODO how to connect this function with tokenizer?
export const handleTokenizeChange = () => {
  const instances = ViewletStates.getAllInstances()
  const instance = instances.EditorText
  if (!instance) {
    console.log('no text editor')
    return
  }
  const state = instance.state
  const tokenizer = Tokenizer.getTokenizer(state.languageId)
  const newState = {
    ...instance.state,
    tokenizer,
  }
  Viewlet.setState('EditorText', newState)
}

// TODO uri?
export const create = (id, uri, x, y, width, height) => {
  const instanceId = Id.create()
  const state = Editor.create(instanceId, uri, 'unknown', '')
  const newState = Editor.setBounds(state, x, y, height, COLUMN_WIDTH)
  const fileName = Workspace.pathBaseName(state.uri)
  const languageId = Languages.getLanguageId(fileName)
  return {
    ...newState,
    uri,
    rowHeight: 20,
    languageId,
    width,
  }
}

export const saveState = (state) => {
  const { selections, focused, deltaY, minLineY } = state
  return {
    selections: [...Array.from(selections)],
    focused,
    deltaY,
  }
}

const getSavedSelections = (savedState) => {
  if (savedState && savedState.selections) {
    return new Uint32Array(savedState.selections)
  }
  return new Uint32Array([0, 0, 0, 0])
}

const getSavedFocus = (savedState) => {
  if (savedState && savedState.focused) {
    return true
  }
  return false
}

const getSavedDeltaY = (savedState) => {
  if (savedState && savedState.deltaY) {
    return savedState.deltaY
  }
  return 0
}

const getLanguageId = (state) => {
  const fileName = Workspace.pathBaseName(state.uri)
  const languageId = Languages.getLanguageId(fileName)
  if (languageId === 'unknown') {
    console.log('try to get language from content', state)
    const firstLine = state.lines[0] || ''
    const languageIdFromContent = Languages.getLanguageIdByFirstLine(firstLine)
    return languageIdFromContent
  }
  return languageId
}

const kLineHeight = 'editor.lineHeight'
const kFontSize = 'editor.fontSize'
const kFontFamily = 'editor.fontFamily'
const kLetterSpacing = 'editor.letterSpacing'
const kLinks = 'editor.links'
const kTabSize = 'editor.tabSize'

const unquoteString = (string) => {
  if (string.startsWith(`'`) && string.endsWith(`'`)) {
    return string.slice(1, -1)
  }
  return string
}

export const loadContent = async (state, savedState) => {
  const { uri } = state
  const rowHeight = Preferences.get(kLineHeight) || 20
  const fontSize = Preferences.get(kFontSize) || 15 // TODO find out if it is possible to use all numeric values for settings for efficiency, maybe settings could be an array
  const fontFamily = Preferences.get(kFontFamily) || 'Fira Code'
  const letterSpacing = Preferences.get(kLetterSpacing) || 0.5
  const tabSize = Preferences.get(kTabSize) || 2
  const links = Preferences.get(kLinks) || false
  const content = await getContent(uri)
  const newState1 = Editor.setText(state, content)
  const languageId = getLanguageId(newState1)
  const tokenizer = Tokenizer.getTokenizer(languageId)
  const savedSelections = getSavedSelections(savedState)
  const savedDeltaY = getSavedDeltaY(savedState)
  const newState2 = Editor.setDeltaYFixedValue(newState1, savedDeltaY)
  if ((fontFamily === 'Fira Code' || fontFamily === `'Fira Code'`) && !Font.has(fontFamily, fontSize)) {
    const assetDir = Platform.getAssetDir()
    const fontName = unquoteString(fontFamily)
    await Font.load(fontName, `url('${assetDir}/fonts/FiraCode-VariableFont.ttf')`)
  }
  return {
    ...newState2,
    rowHeight,
    fontSize,
    letterSpacing,
    tokenizer,
    selections: savedSelections,
    deltaY: savedDeltaY,
    fontFamily,
    links,
    tabSize,
    // selections,
  }
}

export const contentLoaded = async (state) => {
  // Editor.renderText(state)
  return []
}

const updateSemanticTokens = async (state) => {
  try {
    const newSemanticTokens = await ExtensionHostSemanticTokens.executeSemanticTokenProvider(state)
    await Command.execute(/* Editor.setDecorations */ 'Editor.setDecorations', /* decorations */ newSemanticTokens)
    // TODO apply semantic tokens to editor and rerender
    // TODO possibly overlay semantic tokens as decorations
  } catch (error) {
    if (
      error &&
      error instanceof Error &&
      error.message.startsWith('Failed to execute semantic token provider: VError: no semantic token provider found for')
    ) {
      return
    }
    console.error(error)
  }
}

export const handleEditorChange = async (editor, changes) => {
  // await ExtensionHostTextDocument.handleEditorChange(editor, changes)
  // TODO check if semantic highlighting is enabled in settings
  await updateSemanticTokens(editor)
  return editor
}

export const contentLoadedEffects = async (state) => {
  // TODO dispose listener
  // TODO don't like side effect here, where to put it?
  // GlobalEventBus.addListener('languages.changed', handleLanguagesChanged)
  // GlobalEventBus.addListener('tokenizer.changed', handleTokenizeChange)
  // GlobalEventBus.addListener('editor.change', handleEditorChange)
  const newLanguageId = getLanguageId(state)
  await Command.execute(/* Editor.setLanguageId */ 'Editor.setLanguageId', /* languageId */ newLanguageId)
  // await ExtensionHostTextDocument.handleEditorCreate(state)
  // TODO check if semantic highlighting is enabled in settings
  await updateSemanticTokens(state)
  GlobalEventBus.emitEvent('editor.create', state)
  Tokenizer.addConnectedEditor(state.id)
}

export const handleLanguagesChanged = (state) => {
  const newLanguageId = getLanguageId(state)
  return EditorCommandSetLanguageId.setLanguageId(state, newLanguageId)
}

export const resize = (state, dimensions) => {
  const newState = Editor.setBounds(state, dimensions.x, dimensions.y, dimensions.height, state.columnWidth)
  const commands = [Editor.renderTextAndCursorAndSelectionsCommands(newState)]
  return {
    newState,
    commands,
  }
}

export const dispose = (state) => {
  Tokenizer.removeConnectedEditor(state.id)
}

export const hasFunctionalRender = true

export const render = Editor.render

export const focus = (state) => {
  return {
    ...state,
    focused: true,
  }
}

export const shouldApplyNewState = (newState) => {
  return true
}

export const getDynamicCss = (preferences) => {
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
  const fontLigatures = preferences['editor.fontLigatures']
  if (fontLigatures) {
    styles.push(`  --EditorFontFeatureSettings: "liga" 1, "calt" 1;`)
  }
  const tabSize = preferences['editor.tabSize']
  if (tabSize) {
    styles.push(` --EditorTabSize: ${tabSize}`)
  }
  const css = `:root {
${JoinLines.joinLines(styles)}
}`
  return css
}
