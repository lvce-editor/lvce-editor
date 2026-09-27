import type { Test } from '@lvce-editor/test-with-playwright'

interface ComponentInfo {
  readonly moduleId: string
  readonly uid: number
}

export const name = 'viewlet.output-component-state'

export const test: Test = async ({ Command, expect, Locator, Main }) => {
  await Command.execute('Layout.showPanel', 'Output')

  const components = (await Command.execute('ComponentState.getComponents')) as readonly ComponentInfo[]
  const component = components.find((item) => item.moduleId === 'Output')
  if (!component) {
    throw new Error('Expected an Output component')
  }

  const uri = `live-component-state:///${component.uid}.json`
  const state = await Command.execute('ComponentState.getState', component.uid)
  const stateContent = await Command.execute('FileSystem.readFile', uri)
  const fileState = JSON.parse(stateContent as string)
  if (fileState.uid !== component.uid || fileState.filterValue !== state.filterValue || !Array.isArray(fileState.filteredItems)) {
    throw new Error('Expected the Output component state file to contain current worker state')
  }

  await Main.openUri(uri)
  const changedState = { ...state, filterValue: 'state edited' }
  await Command.execute('ComponentState.setState', component.uid, changedState)
  await expect(Locator('.FilterInput')).toHaveValue('state edited')

  let errorMessage = ''
  try {
    await Command.execute('ComponentState.setState', component.uid, { ...changedState, uid: component.uid + 1 })
  } catch (error) {
    errorMessage = error instanceof Error ? error.message : String(error)
  }
  if (!errorMessage.includes(`uid must remain ${component.uid}`)) {
    throw new Error(`Expected an Output uid validation error, got: ${errorMessage}`)
  }
  const preservedState = await Command.execute('ComponentState.getState', component.uid)
  if (preservedState.uid !== component.uid || preservedState.filterValue !== changedState.filterValue) {
    throw new Error('Expected invalid Output state to leave the current state unchanged')
  }

  await Command.execute('Output.handleFilterInput', 'live update', 2)
  await expect(Locator('.FilterInput')).toHaveValue('live update')
  await Main.closeAllEditors()
}
