import { beforeEach, expect, jest, test } from '@jest/globals'

jest.unstable_mockModule('../src/parts/DialogWorker/DialogWorker.js', () => ({
  invoke: jest.fn(async (command: string) => {
    if (command === 'Dialog.diff2') {
      return [1, 2]
    }
    if (command === 'Dialog.render2') {
      return [['Viewlet.setDom2', []]]
    }
    return undefined
  }),
}))

const DialogWorker = await import('../src/parts/DialogWorker/DialogWorker.js')
const ViewletDialog = await import('../src/parts/ViewletDialog/ViewletDialog.js')

beforeEach(() => {
  jest.clearAllMocks()
})

test('create', () => {
  expect(ViewletDialog.create(7)).toEqual({
    commands: [],
    id: 7,
  })
})

test('loadContent', async () => {
  const state = ViewletDialog.create(7)
  const options = {
    message: 'Your browser cannot open folders.',
    title: 'Opening Folders is Unsupported',
    type: 'warning',
  }

  const result = await ViewletDialog.loadContent(state, undefined, options)

  expect(DialogWorker.invoke).toHaveBeenNthCalledWith(1, 'Dialog.create', 7)
  expect(DialogWorker.invoke).toHaveBeenNthCalledWith(2, 'Dialog.loadContent2', 7, options)
  expect(DialogWorker.invoke).toHaveBeenNthCalledWith(3, 'Dialog.diff2', 7)
  expect(DialogWorker.invoke).toHaveBeenNthCalledWith(4, 'Dialog.render2', 7, [1, 2])
  expect(result).toEqual({
    commands: [['Viewlet.setDom2', []]],
    id: 7,
  })
})

test('dispose', async () => {
  await ViewletDialog.dispose(ViewletDialog.create(7))

  expect(DialogWorker.invoke).toHaveBeenCalledWith('Dialog.dispose', 7)
})
