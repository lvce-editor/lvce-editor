import type { Test } from '@lvce-editor/test-with-playwright'

interface ComponentInfo {
  readonly moduleId: string
  readonly uid: number
}

export const name = 'viewlet.workers-component-state'

export const test: Test = async ({ Command, Editor, expect, Locator, Main, QuickPick }) => {
  const openWorkers = async (): Promise<void> => {
    await QuickPick.open()
    await QuickPick.setValue('>workers')
    await QuickPick.selectItem('Developer: Open Workers View')
    await expect(Locator('.WorkersView')).toBeVisible()
  }

  await openWorkers()

  const getWorkersComponent = async (): Promise<ComponentInfo> => {
    const components = (await Command.execute('ComponentState.getComponents')) as readonly ComponentInfo[]
    const component = components.find((item) => item.moduleId === 'Workers')
    if (!component) {
      throw new Error('Expected the Workers component to be available for live state inspection')
    }
    return component
  }

  const component = await getWorkersComponent()
  const uri = `live-component-state:///${component.uid}.json`
  const state = (await Command.execute('ComponentState.getState', component.uid)) as { readonly workers: readonly unknown[] }
  const stateContent = await Command.execute('FileSystem.readFile', uri)
  const fileState = JSON.parse(stateContent as string)
  if (fileState.uid !== component.uid || !fileState.loaded || !Array.isArray(fileState.workers)) {
    throw new Error('Expected the Workers live state file to contain its loaded worker data')
  }

  await Main.openUri(uri)
  const editorState = JSON.parse(await Editor.getText())
  if (editorState.uid !== component.uid || !editorState.loaded || !Array.isArray(editorState.workers)) {
    throw new Error('Expected Open JSON State to show the Workers component data')
  }
  await Main.closeActiveEditor()
  const changedState = {
    ...state,
    // A state error pauses the Workers view's one-second auto-refresh while the edited list is asserted.
    error: new Error('Pause automatic refresh during component state edit'),
    workers: [
      ...(state as { workers: readonly unknown[] }).workers,
      { id: 'state-test', memory: 0, name: 'Inspector Worker', runtimeName: 'Inspector Worker [state-test]' },
    ],
  }
  await Command.execute('ComponentState.setState', component.uid, changedState)
  const updatedState = (await Command.execute('ComponentState.getState', component.uid)) as { readonly workers: readonly { readonly name: string }[] }
  if (!updatedState.workers.some((worker) => worker.name === 'Inspector Worker')) {
    throw new Error(`Expected Workers state update, got: ${JSON.stringify(updatedState.workers)}`)
  }
  await expect(Locator('.WorkersView')).toContainText('Inspector Worker')

  await Command.execute('Workers.refresh', component.uid)
  const refreshedState = await Command.execute('ComponentState.getState', component.uid)
  if (!(refreshedState as { workers: readonly unknown[] }).workers.every((worker) => (worker as { id: string }).id !== 'state-test')) {
    throw new Error('Expected refreshing Workers to replace edited state with the current worker list')
  }

  await Main.closeAllEditors()
  const closedComponents = (await Command.execute('ComponentState.getComponents')) as readonly ComponentInfo[]
  if (closedComponents.some((item) => item.uid === component.uid)) {
    throw new Error('Expected the closed Workers view to be removed from live component state')
  }

  await openWorkers()
  const reopenedComponent = await getWorkersComponent()
  if (reopenedComponent.uid === component.uid) {
    throw new Error('Expected reopening Workers to create a new live component instance')
  }
}
