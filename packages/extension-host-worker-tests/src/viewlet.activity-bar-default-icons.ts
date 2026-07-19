export const name = 'viewlet.activity-bar-default-icons'

export const test = async ({ Locator, expect }) => {
  await expect(Locator('#ActivityBar .MaskIconFiles')).toHaveCount(1)
  await expect(Locator('#ActivityBar .IconSearch')).toHaveCount(1)
  await expect(Locator('#ActivityBar .IconSourceControl')).toHaveCount(1)
  await expect(Locator('#ActivityBar .IconDebugAlt2')).toHaveCount(1)
  await expect(Locator('#ActivityBar .IconExtensions')).toHaveCount(1)
  await expect(Locator('#ActivityBar .IconAccount')).toHaveCount(1)
  await expect(Locator('#ActivityBar .IconSettingsGear')).toHaveCount(1)
}
