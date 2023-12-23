import * as I18nString from '../I18NString/I18NString.js'

/**
 * @enum {string}
 */
const UiStrings = {
  GoToTypeDefinition: 'Go to Type Definition',
  GoToDefinition: 'Go to Definition',
  FindAllReferences: 'Find All References',
  FindAllImplementations: 'Find All Implementations',
  Cut: 'Cut',
  Copy: 'Copy',
  Paste: 'Paste',
  Undo: 'Undo',
  Redo: 'Redo',
  Separator: 'Separator',
  ToggleLineComment: 'Toggle Line Comment',
  ToggleBlockComment: 'Toggle Block Comment',
  NoDefinitionFound: 'No definition found',
  NoDefinitionFoundFor: "No definition found for '{PH1}'",
  NoTypeDefinitionFound: 'No type definition found',
  NoTypeDefinitionFoundFor: "No type definition found for '{PH1}'",
}

export const goToDefinition = () => {
  return I18nString.i18nString(UiStrings.GoToDefinition)
}

export const goToTypeDefinition = () => {
  return I18nString.i18nString(UiStrings.GoToTypeDefinition)
}

export const findAllReferences = () => {
  return I18nString.i18nString(UiStrings.FindAllReferences)
}

export const findAllImplementations = () => {
  return I18nString.i18nString(UiStrings.FindAllImplementations)
}

export const cut = () => {
  return I18nString.i18nString(UiStrings.Cut)
}

export const copy = () => {
  return I18nString.i18nString(UiStrings.Copy)
}

export const paste = () => {
  return I18nString.i18nString(UiStrings.Paste)
}

export const undo = () => {
  return I18nString.i18nString(UiStrings.Undo)
}

export const redo = () => {
  return I18nString.i18nString(UiStrings.Redo)
}

export const toggleLineComment = () => {
  return I18nString.i18nString(UiStrings.ToggleLineComment)
}

export const toggleBlockComment = () => {
  return I18nString.i18nString(UiStrings.ToggleBlockComment)
}

export const separator = () => {
  return ''
}

export const noDefinitionFound = () => {
  return I18nString.i18nString(UiStrings.NoDefinitionFound)
}

export const noDefinitionFoundFor = (word) => {
  return I18nString.i18nString(UiStrings.NoDefinitionFoundFor, {
    PH1: word,
  })
}

export const noTypeDefinitionFoundFor = (word) => {
  return I18nString.i18nString(UiStrings.NoTypeDefinitionFoundFor, {
    PH1: word,
  })
}

export const noTypeDefinitionFound = () => {
  return I18nString.i18nString(UiStrings.NoTypeDefinitionFound)
}
