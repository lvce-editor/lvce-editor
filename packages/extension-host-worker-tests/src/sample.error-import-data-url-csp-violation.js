export const name = 'sample.error-import-data-url-csp-violation'

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
  await expect(errorMessage).toHaveText(
    `Error: Failed to activate extension sample.error-import-data-url-csp-violation: ContentSecurityPolicyError: Content Security Policy Violation: script-src-elem`
  )
  const codeFrame = Locator('#DialogBodyErrorCodeFrame')
  await expect(codeFrame).toHaveText(`> 1 | const p = await import(\`data:text/javascript,
    |           ^
  2 |   export default import("./foo.js");
  3 | \`)
  4 |`)
  // TODO error message could be improved
}
