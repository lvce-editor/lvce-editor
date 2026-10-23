import { expect, test } from '@jest/globals'
import { handleWorkspaceProgress } from '../src/parts/ViewletLayout/ViewletLayout.ts'

test('handleWorkspaceProgress identifies container setup and keeps its operation label through updates', () => {
  const initialState = { workspaceProgressId: undefined, workspaceProgressKind: undefined, workspaceProgressMessage: undefined }
  const starting = handleWorkspaceProgress(initialState as any, {
    id: 1,
    message: 'Starting Dev Containers for /workspace/project…',
  })
  const updating = handleWorkspaceProgress(starting, {
    id: 1,
    message: 'Downloading image sha256:abc123',
  })

  expect(starting.workspaceProgressKind).toBe('container')
  expect(updating.workspaceProgressKind).toBe('container')
  expect(updating.workspaceProgressMessage).toBe('Downloading image sha256:abc123')
})

test('handleWorkspaceProgress keeps Remote SSH wording as the default and clears the operation label', () => {
  const initialState = { workspaceProgressId: undefined, workspaceProgressKind: undefined, workspaceProgressMessage: undefined }
  const starting = handleWorkspaceProgress(initialState as any, { id: 1, message: 'Establishing connection to the Remote SSH host…' })
  const cleared = handleWorkspaceProgress(starting, { id: 1, message: '' })

  expect(starting.workspaceProgressKind).toBeUndefined()
  expect(cleared.workspaceProgressKind).toBeUndefined()
  expect(cleared.workspaceProgressId).toBeUndefined()
})
