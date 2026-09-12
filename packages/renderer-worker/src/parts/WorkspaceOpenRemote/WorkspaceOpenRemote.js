import * as Command from '../Command/Command.js'
import * as GetRemoteHomepage from '../GetRemoteHomepage/GetRemoteHomepage.js'
import * as Notification from '../Notification/Notification.js'
import * as Preferences from '../Preferences/Preferences.js'
import * as SharedProcess from '../SharedProcess/SharedProcess.js'
import * as Viewlet from '../Viewlet/Viewlet.js'
import * as ViewletStates from '../ViewletStates/ViewletStates.js'
import * as Workspace from '../Workspace/Workspace.js'
import * as WorkspaceConnection from '../WorkspaceConnection/WorkspaceConnection.js'

export const openRemote = async () => {
  const cwd = Workspace.getPath()
  if (!cwd) {
    await Notification.create('info', 'Open a workspace folder to view its Git remote.')
    return
  }
  if (WorkspaceConnection.isActive()) {
    throw new Error('Opening Git remotes is not yet supported for remote workspaces.')
  }
  const remote = await SharedProcess.invoke('Workspace.getGitRemote', cwd)
  if (Workspace.getPath() !== cwd) return
  const url = GetRemoteHomepage.getRemoteHomepage(remote, Preferences.get('git.remoteHosts'))
  if (!url) {
    await Notification.create('info', 'No supported Git remote found. Configure git.remoteHosts to map its host to a website.')
    return
  }
  const layout = ViewletStates.getInstance('Layout')?.state
  if (layout?.secondaryPreviewVisible && layout.secondaryPreviewViewletId === 'SimpleBrowser') {
    await Viewlet.executeViewletCommand(layout.secondaryPreviewId, 'openOrRevealTab', url)
    return
  }
  await Command.execute('Layout.showPreview', 'simple-browser://')
  await Command.execute('SimpleBrowser.openOrRevealTab', url)
}
