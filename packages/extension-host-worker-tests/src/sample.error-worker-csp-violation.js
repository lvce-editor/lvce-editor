export const name = 'sample.error-worker-csp-violation'

export const test = async ({ Extension, QuickPick, Locator, expect }) => {
  // arrange
  await Extension.addWebExtension(new URL(`../fixtures/${name}`, import.meta.url).toString())

  // act
  await QuickPick.open()
  await QuickPick.setValue('>Sample Command')
  await QuickPick.selectItem('Sample Command')

  // assert
  const dialog = Locator('#Dialog')
  const errorMessage = dialog.locator('#DialogBodyErrorMessage')
  // TODO error message could be improved
  await expect(errorMessage).toHaveText(
    `Error: Failed to activate extension sample.error-worker-csp-violation: ContentSecurityPolicyError: Content Security Policy Violation: worker-src`
  )
  const codeFrame = Locator('#DialogBodyErrorCodeFrame')
  await expect(codeFrame).toHaveText(`> 1 | const worker = new Worker(\`data:text/javascript,
    |                ^
  2 | let x = 123
  3 | \`)
  4 |`)
}
