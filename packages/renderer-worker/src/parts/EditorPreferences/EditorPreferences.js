import * as Preferences from '../Preferences/Preferences.js'
import * as SupportsLetterSpacing from '../SupportsLetterSpacing/SupportsLetterSpacing.js'
import * as Logger from '../Logger/Logger.js'

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
const kAutoClosingBrackets = 'editor.autoClosingBrackets'
const kFontWeight = 'editor.fontWeight'
const kHover = 'editor.hover'
const kHoverDelay = 'editor.hoverDelay'
const kMinFontSize = 10
const kMaxFontSize = 100
const kMaxLineHeight = 100
const lastWarnings = new Map()

const warnIfChanged = (setting, value, bound, direction) => {
  if (Object.is(lastWarnings.get(setting), value)) {
    return
  }
  lastWarnings.set(setting, value)
  Logger.warn(`[renderer-worker] ${setting} value ${value} is too ${direction}; using ${bound}`)
}

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

export const getRowHeight = (preferences) => {
  const lineHeight = preferences ? preferences[kLineHeight] : Preferences.get(kLineHeight)
  const fontSize = getFontSize(preferences)
  if (typeof lineHeight !== 'number' || !Number.isFinite(lineHeight) || lineHeight === 0) {
    lastWarnings.delete(kLineHeight)
    return fontSize
  }
  if (lineHeight > kMaxLineHeight) {
    warnIfChanged(kLineHeight, lineHeight, kMaxLineHeight, 'large')
    return kMaxLineHeight
  }
  if (lineHeight < fontSize) {
    warnIfChanged(kLineHeight, lineHeight, fontSize, 'small')
    return fontSize
  }
  lastWarnings.delete(kLineHeight)
  return lineHeight
}

export const getFontSize = (preferences) => {
  const fontSize = preferences ? preferences[kFontSize] : Preferences.get(kFontSize)
  if (typeof fontSize !== 'number' || !Number.isFinite(fontSize)) {
    lastWarnings.delete(kFontSize)
    return 15
  }
  if (fontSize < kMinFontSize) {
    warnIfChanged(kFontSize, fontSize, kMinFontSize, 'small')
    return kMinFontSize
  }
  if (fontSize > kMaxFontSize) {
    warnIfChanged(kFontSize, fontSize, kMaxFontSize, 'large')
    return kMaxFontSize
  }
  lastWarnings.delete(kFontSize)
  return fontSize
}

export const getHoverEnabled = () => {
  return Preferences.get(kHover) ?? false
}

export const getHoverDelay = () => {
  return Preferences.get(kHoverDelay) ?? 200
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
