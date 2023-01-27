export const name = 'sample.error-eval-csp-violation'

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
    `Error: Failed to activate extension sample.error-eval-csp-violation: ContentSecurityPolicyError: Content Security Policy Violation: script-src`
  )
  const codeFrame = Locator('#DialogBodyErrorCodeFrame')
  await expect(codeFrame).toHaveText(`> 1 | eval('1+1')
    | ^
  2 |
  3 | export const activate = () => {}
  4 |`)
}
