import * as WhenExpression from '../WhenExpression/WhenExpression.js'

interface KeyBinding {
  readonly when?: number
}

const isQuickPickKeyBinding = (keyBinding: KeyBinding): boolean => {
  return keyBinding.when === WhenExpression.FocusQuickPickInput
}

export const getQuickPickKeyBindings = (keyBindings: readonly KeyBinding[]): readonly KeyBinding[] => {
  return keyBindings.filter(isQuickPickKeyBinding)
}
