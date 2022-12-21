import * as DebugScopeType from '../DebugScopeType/DebugScopeType.js'
import * as I18nString from '../I18NString/I18NString.js'
import * as DebugPauseReason from '../DebugPausedReason/DebugPausedReason.js'

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
}

export const getScopeLabel = (element) => {
  switch (element.type) {
    case DebugScopeType.Local:
      return I18nString.i18nString(UiStrings.Local)
    case DebugScopeType.Closure:
      if (element.name) {
        return I18nString.i18nString(UiStrings.NamedClosure, {
          PH1: element.name,
        })
      }
      return I18nString.i18nString(UiStrings.Closure)
    case DebugScopeType.Global:
      return I18nString.i18nString(UiStrings.Global)
    case DebugScopeType.Block:
      return I18nString.i18nString(UiStrings.Block)
    case DebugScopeType.WasmExpressionStack:
      return I18nString.i18nString(UiStrings.Expression)
    case DebugScopeType.Module:
      return I18nString.i18nString(UiStrings.Module)
    case DebugScopeType.Eval:
      return I18nString.i18nString(UiStrings.Eval)
    case DebugScopeType.Script:
      return I18nString.i18nString(UiStrings.Script)
    case DebugScopeType.With:
      return I18nString.i18nString(UiStrings.With)
    case DebugScopeType.Catch:
      return I18nString.i18nString(UiStrings.Catch)
    default:
      return element.type
  }
}

export const getPropertyValueLabel = (property) => {
  switch (property.type) {
    case 'number':
      return property.description
    case 'undefined':
      return `undefined`
    default:
      return `${JSON.stringify(property)}`
  }
}

export const getPausedMessage = (reason) => {
  switch (reason) {
    case DebugPauseReason.Other:
      return I18nString.i18nString(UiStrings.DebuggerPaused)
    default:
      return `Debugger paused (${reason})`
  }
}
