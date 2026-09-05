import type { Test } from '@lvce-editor/test-with-playwright'

interface ComponentInfo {
  readonly editable: boolean
  readonly moduleId: string
  readonly uid: number
}

export const name = 'viewlet.component-state-auto-update'

export const test: Test = async ({ Command, expect, FileSystem, Locator, Workspace }) => {
  const tmpDir = await FileSystem.getTmpDir()
  await FileSystem.writeFile(`${tmpDir}/file.txt`, 'content')
  await Workspace.setPath(tmpDir)
  await Command.execute('Layout.showSideBar', 'Explorer')
  await expect(Locator('.Explorer')).toBeVisible()
  await Command.execute('Developer.openComponentState')
  const view = Locator('.ComponentStateView')
  await expect(view).toBeVisible()

  const assertComponents = async () => {
    const components = (await Command.execute('ComponentState.getComponents')) as readonly ComponentInfo[]
    const editableComponents = components.filter((component) => component.editable)
    if (editableComponents.length === 0) {
      throw new Error('Expected live components without manually refreshing')
    }
    await expect(view.locator('.ComponentStateDescription')).toHaveText(`${editableComponents.length} live components`)
    for (const component of editableComponents) {
      await expect(view.locator(`.ComponentStateCard[data-uid="${component.uid}"]`)).toBeVisible()
    }
    return editableComponents
  }

  const initial = await assertComponents()
  const explorer = initial.find((component) => component.moduleId === 'Explorer')
  if (!explorer) {
    throw new Error('Expected Explorer in the initial component list')
  }

  await Command.execute('Layout.showSideBar', 'Search')
  await expect(Locator('.Search')).toBeVisible()
  await expect(view.locator(`.ComponentStateCard[data-uid="${explorer.uid}"]`)).toHaveCount(0)
  await assertComponents()

  await Command.execute('Layout.openSecondarySideBarViewlet', 'Explorer')
  await expect(view).toHaveCount(0)
  await Command.execute('Developer.openComponentState')
  await expect(view).toBeVisible()
  await assertComponents()

  await Command.execute('Layout.showSideBar', 'Explorer')
  await expect(Locator('.Explorer')).toBeVisible()
  await assertComponents()
}
