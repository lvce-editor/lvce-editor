import * as Authentication from '../Authentication/Authentication.ts'
import * as Command from '../Command/Command.js'
import * as ExtensionHostCommands from '../ExtensionHost/ExtensionHostCommands.js'
import * as Notification from '../Notification/Notification.js'

export const openInitialUri = async (href) => {
  const params = new URL(href).searchParams
  const hostname = params.get('remoteServer')
  if (hostname !== null) {
    try {
      if (!hostname || hostname.length > 253 || !/^[a-z0-9.-]+$/.test(hostname)) {
        throw new Error('Invalid remote hostname')
      }
      const accounts = await Authentication.getAccounts()
      if (!accounts.some((account) => account.active && account.signedIn)) {
        await Command.execute('Layout.signIn')
        const signedIn = await Authentication.getAccounts()
        if (!signedIn.some((account) => account.active && account.signedIn)) {
          throw new Error('Sign in through the Accounts menu, then reload this page to connect to the selected remote machine.')
        }
      }
      await ExtensionHostCommands.executeCommand('remote-server.connectAccount', hostname)
    } catch (error) {
      await Notification.create('error', `Could not open remote workspace: ${error.message}`)
    }
    return
  }
  const uri = params.get('openUri')
  if (uri) {
    await Command.execute('Main.openUri', uri)
  }
}
