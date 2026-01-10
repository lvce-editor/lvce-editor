import * as Command from '../Command/Command.js'
import * as Editor from '../Editor/Editor.js'
import * as EditorPreferences from '../EditorPreferences/EditorPreferences.js'
import * as EditorWorker from '../EditorWorker/EditorWorker.ts'
import * as ErrorHandling from '../ErrorHandling/ErrorHandling.js'
import * as ExtensionHostSemanticTokens from '../ExtensionHost/ExtensionHostSemanticTokens.js'
import * as ExtensionHostLanguages from '../ExtensionHostLanguages/ExtensionHostLanguages.js'
import * as GetFontUrl from '../GetFontUrl/GetFontUrl.js'
import * as GetTextEditorContent from '../GetTextEditorContent/GetTextEditorContent.js'
import * as GetTokenizePath from '../GetTokenizePath/GetTokenizePath.js'
import * as Id from '../Id/Id.js'
import * as Languages from '../Languages/Languages.js'
import * as Preferences from '../Preferences/Preferences.js'
import * as Tokenizer from '../Tokenizer/Tokenizer.js'
import * as TokenizerMap from '../TokenizerMap/TokenizerMap.js'
import * as UnquoteString from '../UnquoteString/UnquoteString.js'
import * as Viewlet from '../Viewlet/Viewlet.js'
import * as ViewletModuleId from '../ViewletModuleId/ViewletModuleId.js'
import * as ViewletStates from '../ViewletStates/ViewletStates.js'
import * as Workspace from '../Workspace/Workspace.js'
import * as Platform from '../Platform/Platform.js'
import * as AssetDir from '../AssetDir/AssetDir.js'

const COLUMN_WIDTH = 9 // TODO compute this automatically once

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
  const tokenizerId = Id.create()
  TokenizerMap.set(tokenizerId, tokenizer)
  const newState = {
    ...instance.state,
    tokenizerId,
  }
  Viewlet.setState('EditorText', newState)
}

// TODO uri?
export const create = (id, uri, x, y, width, height) => {
  const fileName = Workspace.pathBaseName(uri)
  const languageId = Languages.getLanguageId(fileName)
  const state = Editor.create(id, uri, languageId)
  const newState = Editor.setBounds(state, x, y, width, height, COLUMN_WIDTH)
  return {
    ...newState,
    uri,
    rowHeight: 20,
    languageId,
    width,
    moduleId: ViewletModuleId.EditorText,
    platform: Platform.getPlatform(),
    assetDir: AssetDir.assetDir,
  }
}

const getSavedSelections = (savedState) => {
  if (savedState && savedState.selections) {
    return new Uint32Array(savedState.selections)
  }
  return new Uint32Array([0, 0, 0, 0])
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
    if (state.languageId) {
      return state.languageId
    }
    console.log('try to get language from content', state)
    const firstLine = state.lines[0] || ''
    const languageIdFromContent = Languages.getLanguageIdByFirstLine(firstLine)
    return languageIdFromContent
  }
  return languageId
}

export const loadContent = async (state, savedState, context) => {
  const { uri, id, x, y, width, height, platform, assetDir } = state
  const rowHeight = EditorPreferences.getRowHeight()
  const fontSize = EditorPreferences.getFontSize()
  const hoverEnabled = EditorPreferences.getHoverEnabled()
  const fontFamily = EditorPreferences.getFontFamily()
  const letterSpacing = EditorPreferences.getLetterSpacing()
  const tabSize = EditorPreferences.getTabSize()
  const links = EditorPreferences.getLinks()
  const lineNumbers = EditorPreferences.getLineNumbers()
  const formatOnSave = EditorPreferences.getFormatOnSave()
  const isAutoClosingBracketsEnabled = EditorPreferences.isAutoClosingBracketsEnabled()
  const isAutoClosingTagsEnabled = EditorPreferences.isAutoClosingTagsEnabled()
  const isAutoClosingQuotesEnabled = EditorPreferences.isAutoClosingQuotesEnabled()
  const isQuickSuggestionsEnabled = EditorPreferences.isQuickSuggestionsEnabled()
  const completionTriggerCharacters = EditorPreferences.getCompletionTriggerCharacters()
  const diagnosticsEnabled = EditorPreferences.diagnosticsEnabled()
  const content = await GetTextEditorContent.getTextEditorContent(uri)
  const languageId = context?.languageId || getLanguageId(state)
  const tokenizer = Tokenizer.getTokenizer(languageId)
  const tokenizerId = Id.create()
  TokenizerMap.set(tokenizerId, tokenizer)
  let savedSelections = getSavedSelections(savedState)
  const savedDeltaY = getSavedDeltaY(savedState)
  state.languageId = languageId
  let newState2 = Editor.setDeltaYFixedValue(state, savedDeltaY)
  const isFiraCode = fontFamily === 'Fira Code' || fontFamily === "'Fira Code'"
  if (isFiraCode) {
    const fontName = UnquoteString.unquoteString(fontFamily)
    const fontUrl = GetFontUrl.getFontUrl('/fonts/FiraCode-VariableFont.ttf')
    await EditorWorker.invoke('Font.ensure', fontName, fontUrl)
  }
  const isMonospaceFont = isFiraCode // TODO an actual check for monospace font
  const fontWeight = EditorPreferences.getFontWeight()
  const lineToReveal = context?.rowIndex || 0
  const columnToReveal = context?.columnIndex || 0
  await EditorWorker.invoke('Editor.create', {
    assetDir,
    columnToReveal,
    completionTriggerCharacters,
    content,
    diagnosticsEnabled,
    fontFamily,
    fontSize,
    fontWeight,
    formatOnSave,
    height,
    hoverEnabled,
    id,
    isAutoClosingBracketsEnabled,
    isAutoClosingQuotesEnabled,
    isAutoClosingTagsEnabled,
    isMonospaceFont,
    isQuickSuggestionsEnabled,
    languageId,
    letterSpacing,
    lineNumbers,
    lineToReveal,
    links,
    platform,
    rowHeight,
    savedDeltaY,
    savedSelections,
    tabSize,
    uri,
    width,
    x,
    y,
  })
  // TODO send render commands directly from editor worker
  // to renderer process
  return rerender(newState2)
}

export const rerender = async (state) => {
  const commands = await EditorWorker.invoke('Editor.render', state.id)
  return {
    ...state,
    commands,
  }
}

export const contentLoaded = async (state) => {
  const { languageId, assetDir, platform } = state
  ExtensionHostLanguages.load(languageId, assetDir, platform)
  return []
}

const updateSemanticTokens = async (state) => {
  if (!Preferences.get('editor.semanticTokens')) {
    return
  }
  try {
    const newSemanticTokens = await ExtensionHostSemanticTokens.executeSemanticTokenProvider(state)
    console.log({ newSemanticTokens })
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
    await ErrorHandling.handleError(error, false)
  }
}

const updateDiagnostics = async (state) => {
  if (!Preferences.get('editor.diagnostics')) {
    return
  }
  // try {
  //   const diagnostics = await ExtensionHostDiagnostic.executeDiagnosticProvider(state)
  //   // const decorations = GetDiagnosticDecorations.getDiagnosticDecorations(state, diagnostics || [])
  //   await Command.execute('Editor.setDecorations', decorations, diagnostics)
  // } catch (error) {
  //   console.log({ error })
  //   // ignore
  // }
}

export const handleEditorChange = async (editor, changes) => {
  // await ExtensionHostTextDocument.handleEditorChange(editor, changes)
  // TODO check if semantic highlighting is enabled in settings
  await updateSemanticTokens(editor)
  await updateDiagnostics(editor)
  return editor
}

// TODO move this to editor worker
export const contentLoadedEffects = async (state) => {
  // TODO dispose listener
  // TODO don't like side effect here, where to put it?
  // GlobalEventBus.addListener('languages.changed', handleLanguagesChanged)
  // GlobalEventBus.addListener('tokenizer.changed', handleTokenizeChange)
  // GlobalEventBus.addListener('editor.change', handleEditorChange)
  // GlobalEventBus.emitEvent('editor.create', state)
  // GlobalEventBus.addListener('editor.change', handleEditorChange)
  // Tokenizer.addConnectedEditor(state.uid)
  const newLanguageId = getLanguageId(state)
  const tokenizePath = GetTokenizePath.getTokenizePath(newLanguageId)
  await Viewlet.executeViewletCommand(state.uid, 'setLanguageId', newLanguageId, tokenizePath)
  // await ExtensionHostTextDocument.handleEditorCreate(state)
  // TODO check if semantic highlighting is enabled in settings
  // await updateSemanticTokens(state)
  // await updateDiagnostics(state)
}

export const handleLanguagesChanged = async (state) => {
  const newLanguageId = getLanguageId(state)
  const tokenizePath = GetTokenizePath.getTokenizePath(newLanguageId)
  await Viewlet.executeViewletCommand(state.uid, 'setLanguageId', newLanguageId, tokenizePath)
  return state
}

export const hasFunctionalResize = true

export const resize = (state, dimensions) => {
  const newState = Editor.setBounds(state, dimensions.x, dimensions.y, dimensions.width, dimensions.height, state.columnWidth)
  return newState
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

export const customErrorRenderer = ViewletModuleId.EditorTextError
