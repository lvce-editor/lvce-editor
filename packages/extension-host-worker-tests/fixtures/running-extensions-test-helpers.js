export const activateFixture = async ({ Command, Extension }, fixtureName, activationEvent) => {
  const uri = new URL(`./${fixtureName}`, import.meta.url).toString()
  await Extension.addWebExtension(uri)
  try {
    const commandPrefix = 'onCommand:'
    if (!activationEvent.startsWith(commandPrefix)) {
      throw new Error(`Unsupported activation event: ${activationEvent}`)
    }
    await Command.execute('ExtensionHost.executeCommand', activationEvent.slice(commandPrefix.length))
  } catch {
    // Activation failures are the state under test.
  }
}

export const getRunningExtension = async ({ Command, expect, Locator, RunningExtensions }, extensionId) => {
  const runningExtensions = await Command.execute('ExtensionManagement.getRunningExtensions')
  await RunningExtensions.show()
  await RunningExtensions.setExtensions(runningExtensions)
  const id = Locator('.RunningExtensionId', { hasText: extensionId })
  await expect(id).toBeVisible()
  return Locator('.RunningExtension').first()
}

export const wait = async (milliseconds) => {
  await new Promise((resolve) => setTimeout(resolve, milliseconds))
}
