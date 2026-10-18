import * as Preferences from '../Preferences/Preferences.js'
import * as SupportsLetterSpacing from '../SupportsLetterSpacing/SupportsLetterSpacing.js'
import * as Logger from '../Logger/Logger.js'

const getPreference = (key, preferences) => (preferences ? preferences[key] : Preferences.get(key))

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

export const isAutoClosingBracketsEnabled = (preferences) => {
  return Boolean(getPreference(kAutoClosingBrackets, preferences))
}

export const isAutoClosingQuotesEnabled = (preferences) => {
  return Boolean(getPreference(kAutoClosingQuotes, preferences))
}

export const isQuickSuggestionsEnabled = (preferences) => {
  return Boolean(getPreference(kQuickSuggestions, preferences))
}

export const isAutoClosingTagsEnabled = () => {
  return true
}

export const getRowHeight = (preferences) => {
  const lineHeight = getPreference(kLineHeight, preferences)
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
  const fontSize = getPreference(kFontSize, preferences)
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

export const getHoverEnabled = (preferences) => {
  return getPreference(kHover, preferences) ?? false
}

export const getHoverDelay = (preferences) => {
  return getPreference(kHoverDelay, preferences) ?? 200
}

export const getFontFamily = (preferences) => {
  return getPreference(kFontFamily, preferences) || 'Fira Code'
}

export const getLetterSpacing = (preferences) => {
  if (!SupportsLetterSpacing.supportsLetterSpacing()) {
    return 0
  }
  return getPreference(kLetterSpacing, preferences) ?? 0.5
}

export const getTabSize = (preferences) => {
  return getPreference(kTabSize, preferences) || 2
}

export const getLinks = (preferences) => {
  return getPreference(kLinks, preferences) || false
}

export const getLineNumbers = (preferences) => {
  return getPreference(kLineNumbers, preferences) ?? false
}

export const getCompletionTriggerCharacters = () => {
  return ['.', '/']
}

export const getFormatOnSave = (preferences) => {
  return getPreference(kFormatOnSave, preferences) ?? false
}

export const diagnosticsEnabled = (preferences) => {
  return getPreference(kDiagnostics, preferences) ?? false
}

export const getFontWeight = (preferences) => {
  return getPreference(kFontWeight, preferences) ?? 400
}
