import * as Command from '../Command/Command.js'
import * as Editor from '../Editor/Editor.js'
import * as ExtensionHostSemanticTokens from '../ExtensionHost/ExtensionHostSemanticTokens.js'
// import * as ExtensionHostTextDocument from '../ExtensionHost/ExtensionHostTextDocument.js'
import * as FileSystem from '../FileSystem/FileSystem.js'
import * as GlobalEventBus from '../GlobalEventBus/GlobalEventBus.js'
import * as Id from '../Id/Id.js'
import * as Languages from '../Languages/Languages.js'
import * as Preferences from '../Preferences/Preferences.js'
import * as Tokenizer from '../Tokenizer/Tokenizer.js'
import * as Viewlet from '../Viewlet/Viewlet.js'
import * as ViewletStates from '../ViewletStates/ViewletStates.js'
import * as Workspace from '../Workspace/Workspace.js'
import * as EditorCommandSetLanguageId from '../EditorCommand/EditorCommandSetLanguageId.js'

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

export const name = 'EditorText'

// TODO uri?
export const create = (id, uri, left, top, width, height) => {
  const instanceId = Id.create()
  const state = Editor.create(instanceId, uri, 'unknown', '')
  const newState = Editor.setBounds(state, top, left, height, COLUMN_WIDTH)
  const fileName = Workspace.pathBaseName(state.uri)
  const languageId = Languages.getLanguageId(fileName)
  console.log('CREATE EDITOR', uri)
  return {
    ...newState,
    uri,
    rowHeight: 20,
    languageId,
    width,
  }
}

export const saveState = (state) => {
  return {
    selections: [...Array.from(state.selections)],
    focused: state.focused,
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

export const loadContent = async (state, savedState) => {
  const { uri } = state
  const rowHeight = Preferences.get('editor.lineHeight') || 20
  const fontSize = Preferences.get('editor.fontSize') || 15 // TODO find out if it is possible to use all numeric values for settings for efficiency, maybe settings could be an array
  const letterSpacing = Preferences.get('editor.letterSpacing') || 0.5
  const fileName = Workspace.pathBaseName(uri)
  const content = await getContent(uri)
  const languageId = Languages.getLanguageId(fileName)
  const tokenizer = Tokenizer.getTokenizer(languageId)
  const newState = Editor.setText(state, content)
  const savedSelections = getSavedSelections(savedState)
  const savedFocus = getSavedFocus(savedState)
  return {
    ...newState,
    rowHeight,
    fontSize,
    letterSpacing,
    tokenizer,
    selections: savedSelections,
    focused: savedFocus,
  }
}

export const contentLoaded = async (state) => {
  // Editor.renderText(state)
}

const updateSemanticTokens = async (state) => {
  try {
    const newSemanticTokens =
      await ExtensionHostSemanticTokens.executeSemanticTokenProvider(state)
    await Command.execute(
      /* Editor.setDecorations */ 'Editor.setDecorations',
      /* decorations */ newSemanticTokens
    )
    // TODO apply semantic tokens to editor and rerender
    // TODO possibly overlay semantic tokens as decorations
  } catch (error) {
    if (
      error &&
      error instanceof Error &&
      error.message.startsWith(
        'Failed to execute semantic token provider: VError: no semantic token provider found for'
      )
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
  const fileName = Workspace.pathBaseName(state.uri)
  const newLanguageId = Languages.getLanguageId(fileName)
  await Command.execute(
    /* Editor.setLanguageId */ 'Editor.setLanguageId',
    /* languageId */ newLanguageId
  )
  // await ExtensionHostTextDocument.handleEditorCreate(state)
  // TODO check if semantic highlighting is enabled in settings
  await updateSemanticTokens(state)
  GlobalEventBus.emitEvent('editor.create', state)
}

export const handleLanguagesChanged = (state) => {
  const fileName = Workspace.pathBaseName(state.uri)
  const newLanguageId = Languages.getLanguageId(fileName)
  return EditorCommandSetLanguageId.setLanguageId(state, newLanguageId)
}

export const resize = (state, dimensions) => {
  const newState = Editor.setBounds(
    state,
    dimensions.top,
    dimensions.left,
    dimensions.height,
    state.columnWidth
  )
  const commands = [Editor.renderTextAndCursorAndSelectionsCommands(newState)]
  return {
    newState,
    commands,
  }
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
