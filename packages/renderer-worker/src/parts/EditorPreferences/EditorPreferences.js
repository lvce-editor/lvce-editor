import * as Preferences from '../Preferences/Preferences.js'
import * as SupportsLetterSpacing from '../SupportsLetterSpacing/SupportsLetterSpacing.js'

const kLineHeight = 'editor.lineHeight'
const kFontSize = 'editor.fontSize'
const kFontFamily = 'editor.fontFamily'
const kLetterSpacing = 'editor.letterSpacing'
const kLinks = 'editor.links'
const kTabSize = 'editor.tabSize'
const kLineNumbers = 'editor.lineNumbers'
const kFormatOnSave = 'editor.formatOnSave'
const kDiagnostics = 'editor.diagnostics'
const kQuickSuggestions = 'editor.quickSuggestions'
const kAutoClosingQuotes = 'editor.autoClosingQuotes'
const kAutoClosingBrackets = 'editor.autoclosingBrackets'
const kFontWeight = 'editor.fontWeight'
const kHover = 'editor.hover'

export const isAutoClosingBracketsEnabled = () => {
  return Boolean(Preferences.get(kAutoClosingBrackets))
}

export const isAutoClosingQuotesEnabled = () => {
  return Boolean(Preferences.get(kAutoClosingQuotes))
}

export const isQuickSuggestionsEnabled = () => {
  return Boolean(Preferences.get(kQuickSuggestions))
}

export const isAutoClosingTagsEnabled = () => {
  return true
}

export const getRowHeight = () => {
  return Preferences.get(kLineHeight) || 20
}

export const getFontSize = () => {
  return Preferences.get(kFontSize) || 15 // TODO find out if it is possible to use all numeric values for settings for efficiency, maybe settings could be an array
}

export const getHoverEnabled = () => {
  return Preferences.get(kHover) ?? false
}

export const getFontFamily = () => {
  return Preferences.get(kFontFamily) || 'Fira Code'
}

export const getLetterSpacing = () => {
  if (!SupportsLetterSpacing.supportsLetterSpacing()) {
    return 0
  }
  return Preferences.get(kLetterSpacing) ?? 0.5
}

export const getTabSize = () => {
  return Preferences.get(kTabSize) || 2
}

export const getLinks = () => {
  return Preferences.get(kLinks) || false
}

export const getLineNumbers = () => {
  return Preferences.get(kLineNumbers) ?? false
}

export const getCompletionTriggerCharacters = () => {
  return ['.', '/']
}

export const getFormatOnSave = () => {
  return Preferences.get(kFormatOnSave) ?? false
}

export const diagnosticsEnabled = () => {
  return Preferences.get(kDiagnostics) ?? false
}

export const getFontWeight = () => {
  return Preferences.get(kFontWeight) ?? 400
}
