import type { Test } from '@lvce-editor/test-with-playwright'

interface ComponentInfo {
  readonly editable: boolean
  readonly moduleId: string
  readonly uid: number
}

interface StatusBarItem {
  readonly name: string
}

export const name = 'viewlet.component-state-edit-status-bar'

export const test: Test = async ({ Command, Editor, expect, FileSystem, Locator, Main }) => {
  const tmpDir = await FileSystem.getTmpDir()
  const uri = `${tmpDir}/status-bar.json`
  await FileSystem.writeFile(uri, '{\n  "value": true\n}\n')
  await Main.openUri(uri)
  const encoding = Locator('.StatusBarItem[name="EditorEncoding"]')
  const indentation = Locator('.StatusBarItem[name="EditorIndentation"]')
  const position = Locator('.StatusBarItem[name="EditorPosition"]')
  // eslint-disable-next-line unicorn/text-encoding-identifier-case -- Assert the displayed status label.
  await expect(encoding).toHaveText('UTF-8')
  await expect(indentation).toHaveText('Spaces: 2')

  await Command.execute('Developer.openComponentState')
  const components = (await Command.execute('ComponentState.getComponents')) as readonly ComponentInfo[]
  const component = components.find((item) => item.moduleId === 'StatusBar')
  if (!component?.editable) {
    throw new Error(`Expected an editable StatusBar component, got ${JSON.stringify(components)}`)
  }

  await Locator(`.ComponentStateCard[data-uid="${component.uid}"]`).click()
  await expect(Locator('.MainTabSelected .TabTitle')).toHaveText(`${component.uid}.json`)
  await expect(Locator('.Editor')).toContainText('{')
  const state = JSON.parse(await Editor.getText())
  const { statusBarItemsRight: originalItemsRight } = state
  const labels: Readonly<Record<string, string>> = {
    EditorEncoding: 'Live encoding',
    EditorIndentation: 'Live indentation',
  }
  const statusBarItemsRight = (originalItemsRight as readonly StatusBarItem[]).map((item) =>
    labels[item.name] ? { ...item, elements: [{ type: 'text', value: labels[item.name] }] } : item,
  )
  const statusBarItemsLeft = [
    {
      ariaLabel: 'Live component state',
      elements: [{ type: 'text', value: 'Live State' }],
      name: 'component.state.test',
      tooltip: 'Live component state',
    },
  ]
  await Editor.setText(`${JSON.stringify({ ...state, statusBarItemsLeft, statusBarItemsRight }, null, 2)}\n`)
  await Main.save()

  const updatedState = await Command.execute('ComponentState.getState', component.uid)
  if (updatedState.statusBarItemsLeft[0]?.name !== 'component.state.test') {
    throw new Error(`Expected StatusBar items to update, got ${JSON.stringify(updatedState.statusBarItemsLeft)}`)
  }
  await expect(Locator('.StatusBarItem[name="component.state.test"]')).toHaveText('Live State')
  await expect(encoding).toHaveText('Live encoding')
  await expect(indentation).toHaveText('Live indentation')

  await Editor.setCursor(1, 0)
  await expect(position).toHaveText('Ln 2, Col 1')
  await Editor.type(' ')
  await expect(position).toHaveText('Ln 2, Col 2')
  await expect(encoding).toHaveText('Live encoding')
  await expect(indentation).toHaveText('Live indentation')
  await Main.save()

  await Main.openUri(uri)
  await expect(encoding).toHaveText('Live encoding')
  await expect(indentation).toHaveText('Live indentation')

  await Command.execute('Editor.setIndentation', false)
  await expect(indentation).toHaveText('Tab Size: 2')
  await expect(encoding).toHaveText('Live encoding')
}
