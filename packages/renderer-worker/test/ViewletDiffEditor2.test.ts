import { beforeEach, expect, jest, test } from '@jest/globals'

const invoke = jest.fn() as any

jest.unstable_mockModule('../src/parts/DiffViewWorker/DiffViewWorker.js', () => ({
  invoke,
}))

const ViewletDiffEditor2 = await import('../src/parts/ViewletDiffEditor2/ViewletDiffEditor2.js')

beforeEach(() => {
  invoke.mockReset()
  invoke.mockResolvedValue([])
})

test('loadContent enables inline mode for inline diff uris', async () => {
  const state = {
    uid: 1,
    uri: 'inline-diff://data://before<->/workspace/file.ts',
  }

  await ViewletDiffEditor2.loadContent(state, undefined)

  expect(invoke).toHaveBeenCalledWith('DiffView.setDiffMode', 1, 'inline')
})

test('loadContent keeps side-by-side mode for regular diff uris', async () => {
  const state = {
    uid: 1,
    uri: 'diff://data://before<->/workspace/file.ts',
  }

  await ViewletDiffEditor2.loadContent(state, undefined)

  expect(invoke).not.toHaveBeenCalledWith('DiffView.setDiffMode', 1, 'inline')
})
