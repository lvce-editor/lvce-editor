import * as I18NString from '../I18NString/I18NString.js'

/**
 * @enum {string}
 */
const UiStrings = {
  Block: 'Block',
  BreakPoints: 'BreakPoints',
  CallStack: 'Call Stack',
  Catch: '`Catch` block',
  Closure: 'Closure',
  DebuggerPaused: 'Debugger paused',
  DebuggerPausedOnException: 'Paused on exception',
  Eval: 'Eval',
  Expression: 'Expression',
  Global: 'Global',
  Local: 'Local',
  Module: 'Module',
  NamedClosure: 'Closure ({PH1})',
  NotPaused: 'Not Paused',
  Pause: 'Pause',
  Restart: 'Restart',
  Resume: 'Resume',
  Scope: 'Scope',
  Script: 'Script',
  StepInto: 'Step Into',
  StepOut: 'Step Out',
  StepOver: 'Step Over',
  Stop: 'Stop',
  Watch: 'Watch',
  With: '`With` block',
  PauseOnExceptions: 'Pause on Exceptions',
  PauseOnUncaughtExceptions: 'Pause on uncaught Exceptions',
}

export const local = () => {
  return I18NString.i18nString(UiStrings.Local)
}

export const namedClosure = (name) => {
  return I18NString.i18nString(UiStrings.NamedClosure, {
    PH1: name,
  })
}

export const closure = () => {
  return I18NString.i18nString(UiStrings.Closure)
}

export const global = () => {
  return I18NString.i18nString(UiStrings.Global)
}

export const block = () => {
  return I18NString.i18nString(UiStrings.Block)
}

export const expression = () => {
  return I18NString.i18nString(UiStrings.Expression)
}

export const module = () => {
  return I18NString.i18nString(UiStrings.Module)
}

export const evalScope = () => {
  return I18NString.i18nString(UiStrings.Eval)
}

export const script = () => {
  return I18NString.i18nString(UiStrings.Script)
}

export const withScope = () => {
  return I18NString.i18nString(UiStrings.With)
}

export const catchScope = () => {
  return I18NString.i18nString(UiStrings.Catch)
}

export const debuggerPaused = () => {
  return I18NString.i18nString(UiStrings.DebuggerPaused)
}

export const debuggerPausedOnException = () => {
  return I18NString.i18nString(UiStrings.DebuggerPausedOnException)
}

export const stepInto = () => {
  return I18NString.i18nString(UiStrings.StepInto)
}

export const stepOver = () => {
  return I18NString.i18nString(UiStrings.StepOver)
}

export const stepOut = () => {
  return I18NString.i18nString(UiStrings.StepOut)
}

export const pause = () => {
  return I18NString.i18nString(UiStrings.Pause)
}

export const watch = () => {
  return I18NString.i18nString(UiStrings.Watch)
}

export const breakPoints = () => {
  return I18NString.i18nString(UiStrings.BreakPoints)
}

export const scope = () => {
  return I18NString.i18nString(UiStrings.Scope)
}

export const callStack = () => {
  return I18NString.i18nString(UiStrings.CallStack)
}

export const notPaused = () => {
  return I18NString.i18nString(UiStrings.NotPaused)
}

export const resume = () => {
  return I18NString.i18nString(UiStrings.Resume)
}

export const restart = () => {
  return I18NString.i18nString(UiStrings.Restart)
}

export const stop = () => {
  return I18NString.i18nString(UiStrings.Stop)
}

export const pauseOnExceptions = () => {
  return I18NString.i18nString(UiStrings.PauseOnExceptions)
}

export const pauseOnUncaughtExceptions = () => {
  return I18NString.i18nString(UiStrings.PauseOnUncaughtExceptions)
}
