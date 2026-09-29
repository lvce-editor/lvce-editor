import { expect, test } from '@jest/globals'
import * as PlatformType from '../src/parts/PlatformType/PlatformType.js'
import { getFileSystemPlatform } from '../src/parts/LaunchFileSystemWorker/LaunchFileSystemWorker.js'
import * as WorkspaceConnection from '../src/parts/WorkspaceConnection/WorkspaceConnection.js'
import * as WorkspaceState from '../src/parts/WorkspaceState/WorkspaceState.js'

test.each([PlatformType.Web, PlatformType.Electron, PlatformType.Remote])('SSH workspaces preserve the local filesystem platform %s', (platform) => {
  WorkspaceState.state.workspaceUri = 'remote-ssh://host/work'
  WorkspaceConnection.set('remote-ssh://host/work', 'remote-ssh.getWebSocketUrl')
  try {
    expect(getFileSystemPlatform(platform)).toBe(platform)
  } finally {
    WorkspaceConnection.reset()
    WorkspaceState.state.workspaceUri = ''
  }
})
