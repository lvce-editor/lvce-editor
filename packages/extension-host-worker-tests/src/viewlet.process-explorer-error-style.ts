import type { Test } from '@lvce-editor/test-with-playwright'

export const name = 'viewlet.process-explorer-error-style'

export const test: Test = async ({ Command, expect, Locator }) => {
  await Command.execute('Developer.openProcessExplorer')
  await Command.execute('ProcessExplorer.setError', {
    code: 'ERR_PROCESS_EXPLORER_TEST',
    message: 'Process explorer connection was closed',
  })
  const error = Locator('.ProcessExplorerError')
  const icon = Locator('.ProcessExplorerErrorIcon')
  try {
    await expect(error).toHaveCSS('color', 'rgb(156, 162, 160)')
    await expect(error).toContainText('ERR_PROCESS_EXPLORER_TEST')
    await expect(error).toContainText('Process explorer connection was closed')
    await expect(icon).toBeVisible()
    await expect(icon).toHaveClass('ProcessExplorerErrorIcon')
    await expect(icon).toHaveClass('MaskIcon')
    await expect(icon).toHaveClass('MaskIconError')
    await expect(icon).toHaveCSS('width', '48px')
    await expect(icon).toHaveCSS('height', '48px')
    await expect(Locator('.ProcessExplorerTable')).toBeHidden()

    const message = 'Long diagnostic message '.repeat(50)
    await Command.execute('ProcessExplorer.setError', { message })
    await expect(error).toContainText(message.trim())
    await expect(icon).toBeVisible()
    await expect(error).toHaveCSS('overflow-wrap', 'anywhere')
  } finally {
    await Command.execute('ProcessExplorer.refresh')
  }
  await expect(error).toBeHidden()
  await expect(icon).toBeHidden()
  await expect(Locator('.ProcessExplorerTable')).toBeVisible()
}
