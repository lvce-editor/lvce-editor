import type { Test } from '@lvce-editor/test-with-playwright'

export const name = 'viewlet.extension-view-explorer-focus'

const waitFor = async (assertion: () => Promise<void>): Promise<void> => {
  for (let attempt = 0; attempt < 10; attempt++) {
    try {
      await assertion()
      return
    } catch (error) {
      if (attempt === 9) throw error
      await new Promise((resolve) => setTimeout(resolve, 50))
    }
  }
}

export const test: Test = async ({ Command, FileSystem, Main, Workspace, Explorer, Locator, KeyBoard, expect }) => {
  const tmpDir = await FileSystem.getTmpDir()
  await FileSystem.setFiles([
    { content: 'key,value\na,1\nb,2\n', uri: `${tmpDir}/a.csv` },
    { content: 'other,value\nc,3\nd,4\n', uri: `${tmpDir}/b.csv` },
  ])
  await Workspace.setPath(tmpDir)
  const firstFile = Locator('.TreeItem[aria-label="a.csv"]')
  const secondFile = Locator('.TreeItem[aria-label="b.csv"]')
  await waitFor(() => expect(firstFile).toBeVisible())
  await Command.execute('Explorer.focus')
  await Explorer.focusIndex(0)
  await firstFile.click()
  await Main.openUri(`${tmpDir}/a.csv`)

  const firstCell = Locator('[id="cell:0:1"]')
  const nextCell = Locator('[id="cell:0:2"]')
  const nextRowCell = Locator('[id="cell:1:2"]')
  await waitFor(() => expect(firstCell).toHaveText('a'))
  await firstCell.click()
  await waitFor(() => expect(firstCell).toBeFocused())
  await waitFor(() => expect(firstFile).toHaveId('TreeItemActive'))

  await KeyBoard.press('ArrowRight')
  await waitFor(() => expect(firstFile).toHaveId('TreeItemActive'))
  await waitFor(() => expect(nextCell).toBeFocused())
  await KeyBoard.press('ArrowDown')
  await waitFor(() => expect(nextRowCell).toBeFocused())
  await waitFor(() => expect(firstFile).toHaveId('TreeItemActive'))

  await Command.execute('Explorer.focus')
  await Explorer.focusIndex(0)
  await KeyBoard.press('ArrowDown')
  await waitFor(() => expect(secondFile).toHaveId('TreeItemActive'))
  await waitFor(() => expect(nextRowCell).toHaveClass('TableCellFocused'))

  await firstCell.click()
  await waitFor(() => expect(firstCell).toBeFocused())
  await KeyBoard.press('ArrowRight')
  await waitFor(() => expect(nextCell).toBeFocused())
  await waitFor(() => expect(secondFile).toHaveId('TreeItemActive'))
  await Command.execute('Explorer.focus')
  await Explorer.focusIndex(1)
  await KeyBoard.press('ArrowUp')
  await waitFor(() => expect(firstFile).toHaveId('TreeItemActive'))
  await firstCell.click()
  await waitFor(() => expect(firstCell).toBeFocused())
  await KeyBoard.press('ArrowRight')
  await waitFor(() => expect(nextCell).toBeFocused())
  await KeyBoard.press('ArrowDown')
  await waitFor(() => expect(nextRowCell).toBeFocused())
  await waitFor(() => expect(firstFile).toHaveId('TreeItemActive'))

  await nextCell.click()
  await waitFor(() => expect(nextCell).toBeFocused())
  await KeyBoard.press('ArrowLeft')
  await waitFor(() => expect(firstCell).toBeFocused())
  await KeyBoard.press('ArrowUp')
  await waitFor(() => expect(firstCell).toBeFocused())
  await KeyBoard.press('ArrowUp')
  await waitFor(() => expect(firstCell).toBeFocused())

  await firstCell.dispatchEvent('dblclick', { bubbles: true } as unknown as string)
  const editor = Locator('[name="cellEditor"]')
  await waitFor(() => expect(editor).toBeFocused())
  await editor.type('edited')
  await KeyBoard.press('Enter')
  await waitFor(() => expect(firstCell).toHaveText('edited'))
  await waitFor(() => expect(firstCell).toBeFocused())
  await waitFor(() => expect(firstFile).toHaveId('TreeItemActive'))

  await firstCell.dispatchEvent('dblclick', { bubbles: true } as unknown as string)
  await waitFor(() => expect(editor).toBeFocused())
  await editor.type('discarded')
  await KeyBoard.press('Escape')
  await waitFor(() => expect(editor).toHaveCount(0))
  await waitFor(() => expect(firstCell).toHaveText('edited'))
  await waitFor(() => expect(firstCell).toBeFocused())
  await waitFor(() => expect(firstFile).toHaveId('TreeItemActive'))
  console.log('extension-view-explorer-focus passed')
}
