import * as I18nString from '../I18NString/I18NString.js'

/**
 * @enum {string}
 */
const UiStrings = {
  Local: 'Local',
  Closure: 'Closure',
  NamedClosure: 'Closure ({PH1})',
  Global: 'Global',
  Block: 'Block',
  Expression: 'Expression',
  Module: 'Module',
  Eval: 'Eval',
  Script: 'Script',
  With: '`With` block',
  Catch: '`Catch` block',
  DebuggerPaused: 'Debugger paused',
  DebuggerPausedOnException: 'Paused on exception',
}

export const local = () => {
  return I18nString.i18nString(UiStrings.Local)
}

export const namedClosure = (name) => {
  return I18nString.i18nString(UiStrings.NamedClosure, {
    PH1: name,
  })
}

export const closure = () => {
  return I18nString.i18nString(UiStrings.Closure)
}

export const global = () => {
  return I18nString.i18nString(UiStrings.Global)
}

export const block = () => {
  return I18nString.i18nString(UiStrings.Block)
}

export const expression = () => {
  return I18nString.i18nString(UiStrings.Expression)
}

export const module = () => {
  return I18nString.i18nString(UiStrings.Module)
}

export const evalScope = () => {
  return I18nString.i18nString(UiStrings.Eval)
}

export const script = () => {
  return I18nString.i18nString(UiStrings.Script)
}

export const withScope = () => {
  return I18nString.i18nString(UiStrings.With)
}

export const catchScope = () => {
  return I18nString.i18nString(UiStrings.Catch)
}

export const debuggerPaused = () => {
  return I18nString.i18nString(UiStrings.DebuggerPaused)
}

export const debuggerPausedOnException = () => {
  return I18nString.i18nString(UiStrings.DebuggerPausedOnException)
}
