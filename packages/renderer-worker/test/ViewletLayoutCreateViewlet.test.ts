import { expect, jest, test } from '@jest/globals'

jest.unstable_mockModule('../src/parts/ViewletManager/ViewletManager.js', () => {
  return {
    load: jest.fn(async () => []),
  }
})

const ViewletLayout = await import('../src/parts/ViewletLayout/ViewletLayout.ts')
const ViewletManager = await import('../src/parts/ViewletManager/ViewletManager.js')

test('passes editor context to the created viewlet', async () => {
  const state = ViewletLayout.create(1)
  const bounds = { height: 600, width: 800, x: 0, y: 35 }
  const editorContext = {
    endColumnIndex: 17,
    endRowIndex: 42,
    startColumnIndex: 12,
    startRowIndex: 42,
  }

  await ViewletLayout.createViewlet(state, 'EditorText', 2, 3, bounds, 'file:///definition.ts', [editorContext])

  expect(ViewletManager.load).toHaveBeenCalledWith(
    expect.objectContaining({
      args: [editorContext],
      id: 'EditorText',
      uri: 'file:///definition.ts',
      uid: 2,
    }),
    false,
    true,
  )
})
