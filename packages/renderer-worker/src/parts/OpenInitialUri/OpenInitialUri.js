import * as Command from '../Command/Command.js'

const hostnamePattern = /^[a-z0-9.-]+$/

export const openInitialUri = async (href) => {
  const params = new URL(href).searchParams
  const hostname = params.get('remoteServer')
  if (hostname !== null) {
    try {
      if (!hostname || hostname.length > 253 || !hostnamePattern.test(hostname)) {
        throw new Error('Invalid remote hostname')
      }
      const accounts = await Command.execute('Authentication.getAccounts')
      if (!accounts.some((account) => account.active && account.signedIn)) {
        await Command.execute('Layout.signIn')
        const signedIn = await Command.execute('Authentication.getAccounts')
        if (!signedIn.some((account) => account.active && account.signedIn)) {
          throw new Error('Sign in through the Accounts menu, then reload this page to connect to the selected remote machine.')
        }
      }
      await Command.execute('ExtensionHost.executeCommand', 'remote-server.connectAccount', hostname)
    } catch (error) {
      const message = error instanceof Error ? error.message : String(error)
      await Command.execute('Notification.create', 'error', `Could not open remote workspace: ${message}`)
    }
    return
  }
  const uri = params.get('openUri')
  if (uri) {
    await Command.execute('Main.openUri', uri)
  }
}
