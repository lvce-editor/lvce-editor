export const name = 'viewlet.about'

export const skip = true

export const test = async ({ Locator, expect, Command }) => {
  // act
  await Command.execute('About.showAbout')

  // assert
  const about = Locator('.About')
  await expect(about).toBeVisible()
}
