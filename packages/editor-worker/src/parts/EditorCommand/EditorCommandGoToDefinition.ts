import * as Definition from '../Definition/Definition.ts'
import * as EditorStrings from '../EditorStrings/EditorStrings.ts'
import * as TextDocument from '../TextDocument/TextDocument.ts'
import * as EditorGoTo from './EditorCommandGoTo.ts'

// TODO race condition, check that editor hasn't been closed in the meantime

// TODO in case of error should show message "Definition Error: Cannot ready Property x of undefined"

// TODO show some kind of message maybe ("No Definition found")

// TODO possible to do this with events/state machine instead of promises -> enables canceling operations / concurrent calls

// TODO there are still race conditions in this function:
// - when open is called twice, previous dom nodes can either be reused or the previous dom nodes must be disposed

// @ts-ignore
const getLocation = async (editor, rowIndex, columnIndex) => {
  const offset = TextDocument.offsetAt(editor, rowIndex, columnIndex)
  const definition = await Definition.getDefinition(editor, offset)
  return definition
}

// @ts-ignore
const getNoLocationFoundMessage = (info) => {
  if (info.word) {
    return EditorStrings.noDefinitionFoundFor(info.word)
  }
  return EditorStrings.noDefinitionFound()
}

// @ts-ignore
const getErrorMessage = (error) => {
  // if (
  //   error &&
  //   error.message &&
  //   error.message.startsWith('Failed to execute definition provider: ')
  // ) {
  //   return error.message.replace('Failed to execute definition provider: ', '')
  // }
  return `${error}`
}

// @ts-ignore
const isNoProviderFoundError = (error) => {
  return (
    error &&
    // @ts-ignore
    error.message &&
    // @ts-ignore
    error.message.startsWith('Failed to execute definition provider: No definition provider found')
  )
}

export const goToDefinition = (editor: any) => {
  return EditorGoTo.goTo({
    editor,
    getLocation,
    getNoLocationFoundMessage,
    getErrorMessage,
    isNoProviderFoundError,
  })
}
