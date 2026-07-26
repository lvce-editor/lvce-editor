import type { Test } from '@lvce-editor/test-with-playwright'

export const name = 'viewlet.running-extensions-narrow-width'

export const test: Test = async ({ Command, expect, Locator, RunningExtensions }) => {
  await RunningExtensions.show()
  await RunningExtensions.setExtensions([
    {
      activationEvent: 'onCommand:sample.run',
      activationTime: 12,
      icon: '',
      id: 'sample.extension',
      name: 'Sample Extension',
      version: '1.0.0',
    },
  ])
  await Command.execute('Layout.handleResize', 320, 720)

  const activationDetails = Locator('.RunningExtensionActivationDetails')
  const details = Locator('.RunningExtensionDetails')

  await expect(RunningExtensions.icon(0)).toHaveCSS('flex-shrink', '0')
  await expect(details).toHaveCSS('flex-shrink', '0')
  await expect(activationDetails).toHaveCSS('flex-grow', '1')
  await expect(activationDetails).toHaveCSS('flex-shrink', '1')
  await expect(activationDetails).toHaveCSS('min-width', '0px')
  await expect(activationDetails).toHaveCSS('overflow', 'hidden')

  await Command.execute('Layout.handleResize', 1280, 720)
}
