import { mkdir, writeFile } from 'fs/promises'
import { getTmpDir, runWithExtension, test, expect } from './_testFrameWork.js'

test.skip('viewlet.explorer-collapse-all', async () => {
  const tmpDir = await getTmpDir()
  await mkdir(`${tmpDir}/folder-1`)
  await writeFile(`${tmpDir}/folder-1/a.txt`, '')
  await writeFile(`${tmpDir}/folder-1/b.txt`, '')
  await writeFile(`${tmpDir}/folder-1/c.txt`, '')
  await mkdir(`${tmpDir}/folder-2`)
  await writeFile(`${tmpDir}/folder-2/a.txt`, '')
  await writeFile(`${tmpDir}/folder-2/b.txt`, '')
  await writeFile(`${tmpDir}/folder-2/c.txt`, '')
  await mkdir(`${tmpDir}/folder-3`)
  await writeFile(`${tmpDir}/folder-3/a.txt`, '')
  await writeFile(`${tmpDir}/folder-3/b.txt`, '')
  await writeFile(`${tmpDir}/folder-3/c.txt`, '')
  const page = await runWithExtension({
    folder: tmpDir,
    name: '',
  })

  const explorer = page.locator('.Viewlet[data-viewlet-id="Explorer"]')
  const folder1 = explorer.locator('.TreeItem[aria-expanded]', {
    hasText: 'folder-1',
  })
  const folder2 = explorer.locator('.TreeItem[aria-expanded]', {
    hasText: 'folder-2',
  })
  const folder3 = explorer.locator('.TreeItem[aria-expanded]', {
    hasText: 'folder-3',
  })

  await folder1.click()
  await folder2.click()
  await folder3.click()

  const treeItems = explorer.locator('.TreeItem')
  // await expect(treeItems).toHaveCount(12)

  // await page.keyboard.press('Control+ArrowLeft')
  // await expect(treeItems).toHaveCount(3)
})

// TODO race condition: while click event is transferred to renderer worker, dirents might already have changed

// expand folder:
// 1. send click event
// 2. read dirents
// 3. check for pending events?
// 4. update state
// 5. update ui

// expand folder:
// 1. send click event
// 2. read dirents
// 3. create new state
// 4. update ui with new state
// 5. set newState as state
