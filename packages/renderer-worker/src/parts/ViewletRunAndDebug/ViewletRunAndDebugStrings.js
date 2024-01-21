import * as I18NString from '../I18NString/I18NString.js'

/**
 * @enum {string}
 */
const UiStrings = {
  StepInto: 'Step Into',
  StepOver: 'Step Over',
  StepOut: 'Step Out',
  Pause: 'Pause',
  Watch: 'Watch',
  BreakPoints: 'BreakPoints',
  Scope: 'Scope',
  CallStack: 'Call Stack',
  NotPaused: 'Not Paused',
  Resume: 'Resume',
  Restart: 'Restart',
  Stop: 'Stop',
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
