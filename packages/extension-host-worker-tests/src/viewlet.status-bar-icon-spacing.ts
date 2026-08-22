import type { Test } from '@lvce-editor/test-with-playwright'

export const name = 'viewlet.status-bar-icon-spacing'

export const test: Test = async ({ Command, expect, Locator }) => {
  await Command.execute('StatusBar.itemRightCreate', {
    ariaLabel: 'Synchronize Changes',
    elements: [
      { type: 'icon', value: 'MaskIconSync' },
      { type: 'text', value: '2↓ 0↑' },
    ],
    name: 'git.sync.spacing',
    tooltip: 'Synchronize Changes',
  })

  const icon = Locator('.StatusBarItem[name="git.sync.spacing"] .StatusBarIcon')
  await expect(icon).toHaveCSS('width', '16px')
  await expect(icon).toHaveCSS('height', '16px')
}
