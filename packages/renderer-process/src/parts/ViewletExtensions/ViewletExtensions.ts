// based on https://github.com/microsoft/vscode/blob/main/src/vs/workbench/contrib/extensions/browser/extensionsList.ts (License MIT)

// TODO vscode uninstall behaviour is better -> more subtle uninstall -> no cta for uninstalling

export * as Events from './ViewletExtensionsEvents.ts'

export const dispose = () => {}

export const setSearchValue = (state, oldValue, newValue) => {
  const { $Viewlet } = state
  const $InputBox = $Viewlet.querySelector('textarea')
  if (!$InputBox) {
    return
  }
  $InputBox.value = newValue
}

export * from '../ViewletList/ViewletList.ts'
