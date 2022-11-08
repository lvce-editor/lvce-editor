import * as ExtensionHostTypeDefinition from '../ExtensionHost/ExtensionHostTypeDefinition.js'
import * as I18nString from '../I18NString/I18NString.js'
import * as TextDocument from '../TextDocument/TextDocument.js'
import * as EditorGoTo from './EditorCommandGoTo.js'

// TODO duplicate code with editorCommandGoToDefinition
// TODO race condition, check that editor hasn't been closed in the meantime

// TODO in case of error should show message "Definition Error: Cannot ready Property x of undefined"

// TODO show some kind of message maybe ("No Definition found")

// TODO possible to do this with events/state machine instead of promises -> enables canceling operations / concurrent calls

// TODO there are still race conditions in this function:
// - when open is called twice, previous dom nodes can either be reused or the previous dom nodes must be disposed

const UiStrings = {
  NoTypeDefinitionFound: 'No type definition found',
  NoTypeDefinitionFoundFor: `No type definition found for '{PH1}'`,
}

const getTypeDefinitionErrorMessage = (error) => {
  return `${error}`
}

const getLocation = async (editor, rowIndex, columnIndex) => {
  const offset = TextDocument.offsetAt(editor, rowIndex, columnIndex)
  const definition =
    await ExtensionHostTypeDefinition.executeTypeDefinitionProvider(
      editor,
      offset
    )
  return definition
}

const getNoLocationFoundMessage = (info) => {
  if (info.word) {
    return I18nString.i18nString(UiStrings.NoTypeDefinitionFoundFor, {
      PH1: info.word,
    })
  }
  return I18nString.i18nString(UiStrings.NoTypeDefinitionFound)
}

const getErrorMessage = (error) => {
  // if (
  //   error &&
  //   error.message &&
  //   error.message.startsWith('Failed to execute type definition provider: ')
  // ) {
  //   return error.message.replace(
  //     'Failed to execute type definition provider: ',
  //     ''
  //   )
  // }
  return `${error}`
}

const isNoProviderFoundError = (error) => {
  return (
    error &&
    // @ts-ignore
    error.message &&
    // @ts-ignore
    error.message.startsWith(
      'Failed to execute type definition provider: No type definition provider found'
    )
  )
}

export const goToTypeDefinition = (editor, explicit = true) => {
  return EditorGoTo.goTo({
    editor,
    getLocation,
    getNoLocationFoundMessage,
    isNoProviderFoundError,
    getErrorMessage,
  })
}
