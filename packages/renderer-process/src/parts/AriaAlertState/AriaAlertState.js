// based on https://github.com/microsoft/vscode/blob/5f87632829dc3ac80203e2377727935184399431/src/vs/base/browser/ui/aria/aria.ts (License MIT)

export const state = {
  $AriaAlert1: undefined,
  $AriaAlert2: undefined,
  $AriaMessages: undefined,
}

export const getAriaAlert1 = () => {
  return state.$AriaAlert1
}

export const getAriaAlert2 = () => {
  return state.$AriaAlert2
}

export const setElements = ($AriaMessages, $AriaAlert1, $AriaAlert2) => {
  state.$AriaMessages = $AriaMessages
  state.$AriaAlert1 = $AriaAlert1
  state.$AriaAlert2 = $AriaAlert2
}

export const hasElements = () => {
  return state.$AriaMessages
}
