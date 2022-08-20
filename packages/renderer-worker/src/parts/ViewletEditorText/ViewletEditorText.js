import * as Command from '../Command/Command.js'
import * as Editor from '../Editor/Editor.js'
import * as ExtensionHostSemanticTokens from '../ExtensionHost/ExtensionHostSemanticTokens.js'
// import * as ExtensionHostTextDocument from '../ExtensionHost/ExtensionHostTextDocument.js'
import * as FileSystem from '../FileSystem/FileSystem.js'
import * as GlobalEventBus from '../GlobalEventBus/GlobalEventBus.js'
import * as Languages from '../Languages/Languages.js'
import * as Preferences from '../Preferences/Preferences.js'
import * as Tokenizer from '../Tokenizer/Tokenizer.js'
import * as Id from '../Id/Id.js'
import * as ViewletStates from '../ViewletStates/ViewletStates.js'
import * as Viewlet from '../Viewlet/Viewlet.js'

const COLUMN_WIDTH = 9 // TODO compute this automatically once

const getContent = async (uri) => {
  const content = await FileSystem.readFile(uri)
  return content ?? 'content could not be loaded'
}

// TODO how to connect this function with tokenizer?
const handleTokenizeChange = () => {
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
  console.log({ id })
  const instanceId = Id.create()
  const state = Editor.create(instanceId, uri, 'unknown', '')
  const newState = Editor.setBounds(state, top, left, height, COLUMN_WIDTH)
  const languageId = Languages.getLanguageId(uri)
  return {
    ...newState,
    uri,
    rowHeight: 20,
    languageId,
  }
}

export const loadContent = async (state) => {
  const rowHeight = Preferences.get('editor.lineHeight') || 20
  const fontSize = Preferences.get('editor.fontSize') || 15 // TODO find out if it is possible to use all numeric values for settings for efficiency, maybe settings could be an array
  const letterSpacing = Preferences.get('editor.letterSpacing') || 0.5
  const languageId = Languages.getLanguageId(state.uri)
  const tokenizer = Tokenizer.getTokenizer(languageId)
  const content = await getContent(state.uri)
  const newState = Editor.setText(state, content)
  return {
    ...newState,
    rowHeight,
    fontSize,
    letterSpacing,
    tokenizer,
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

const handleEditorChange = async (editor, changes) => {
  // await ExtensionHostTextDocument.handleEditorChange(editor, changes)
  // TODO check if semantic highlighting is enabled in settings
  await updateSemanticTokens(editor)
}

export const contentLoadedEffects = async (state) => {
  // TODO dispose listener
  // TODO don't like side effect here, where to put it?
  GlobalEventBus.addListener('languages.changed', handleLanguagesChanged)
  GlobalEventBus.addListener('tokenizer.changed', handleTokenizeChange)
  GlobalEventBus.addListener('editor.change', handleEditorChange)
  const newLanguageId = Languages.getLanguageId(state.uri)
  await Command.execute(
    /* Editor.setLanguageId */ 'Editor.setLanguageId',
    /* languageId */ newLanguageId
  )
  // await ExtensionHostTextDocument.handleEditorCreate(state)
  // TODO check if semantic highlighting is enabled in settings
  await updateSemanticTokens(state)
  GlobalEventBus.emitEvent('editor.create', state)
}

const handleLanguagesChanged = async () => {
  const instances = ViewletStates.getAllInstances()
  const instance = instances.EditorText
  if (!instance) {
    console.log('no text editor')
    return
  }
  const state = instance.state
  const newLanguageId = Languages.getLanguageId(state.uri)
  state.languageId = newLanguageId
  // await ExtensionHostTextDocument.handleEditorLanguageChange(state)
  // if (state.languageId === newLanguageId) {
  //   return
  // }
  // await Promise.all([
  //   Editor.setLanguageId(state, newLanguageId),
  // ])
  await Command.execute(
    /* Editor.setLanguageId */ 'Editor.setLanguageId',
    /* languageId */ newLanguageId
  )

  const newEditor = instances.EditorText.state
  console.log({ newEditor })

  GlobalEventBus.emitEvent('editor.languageChange', newEditor, newLanguageId)
  // console.log({ state })
}

export const resize = (state, dimensions) => {
  const newState = Editor.setBounds(
    state,
    dimensions.top,
    dimensions.left,
    dimensions.height,
    state.columnWidth
  )
  const commands = [Editor.render(state, newState)]
  return {
    newState,
    commands,
  }
}

export const hasFunctionalRender = true

export const render = (oldState, newState) => {
  return Editor.render(oldState, newState)
}
