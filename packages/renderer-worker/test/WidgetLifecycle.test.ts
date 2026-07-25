// @ts-nocheck
import { beforeEach, expect, jest, test } from '@jest/globals'

jest.unstable_mockModule('../src/parts/RendererProcess/RendererProcess.js', () => ({
  invoke: jest.fn<(...args: any[]) => Promise<any>>(),
}))

const RendererProcess = await import('../src/parts/RendererProcess/RendererProcess.js')
const WidgetLifecycle = await import('../src/parts/WidgetLifecycle/WidgetLifecycle.js')

const request = (overrides: Record<string, unknown> = {}) => ({
  editorUid: 1,
  kind: 'find',
  instanceId: 'editor:1:find:1',
  intentSequence: 1,
  rendererUid: 41,
  commands: [
    ['Viewlet.setDom2', 41, ['div', {}, 'find']],
    ['Viewlet.focusSelector', 41, 'input'],
  ],
  ...overrides,
})

beforeEach(() => {
  jest.clearAllMocks()
  RendererProcess.invoke.mockResolvedValue(undefined)
  WidgetLifecycle.reset()
})

test('attaches a widget as one ordered renderer batch', async () => {
  await expect(WidgetLifecycle.attach(request())).resolves.toBe(true)

  expect(RendererProcess.invoke).toHaveBeenCalledWith('Viewlet.sendMultiple', [
    ['Viewlet.createFunctionalRoot', 'FindWidget', 41, true],
    ['Viewlet.setDom2', 41, ['div', {}, 'find']],
    ['Viewlet.appendToBody', 41],
    ['Viewlet.focusSelector', 41, 'input'],
  ])
})

test('rejects an attach superseded by a newer remove', async () => {
  let resolveAttach: (() => void) | undefined
  RendererProcess.invoke.mockImplementationOnce(
    () =>
      new Promise<void>((resolve) => {
        resolveAttach = resolve
      }),
  )

  const attaching = WidgetLifecycle.attach(request())
  await Promise.resolve()
  const removing = WidgetLifecycle.remove(
    request({
      instanceId: 'editor:1:find:closed',
      intentSequence: 2,
      commands: [],
    }),
  )
  resolveAttach!()

  await expect(attaching).resolves.toBe(false)
  await removing
  expect(RendererProcess.invoke.mock.calls).toEqual([
    [
      'Viewlet.sendMultiple',
      [
        ['Viewlet.createFunctionalRoot', 'FindWidget', 41, true],
        ['Viewlet.setDom2', 41, ['div', {}, 'find']],
        ['Viewlet.appendToBody', 41],
        ['Viewlet.focusSelector', 41, 'input'],
      ],
    ],
    ['Viewlet.sendMultiple', [['Viewlet.dispose', 41]]],
    ['Viewlet.sendMultiple', [['Viewlet.dispose', 41]]],
  ])
})

test('rejects a stale attach before rendering it', async () => {
  await WidgetLifecycle.remove(
    request({
      instanceId: 'editor:1:find:closed',
      intentSequence: 2,
      commands: [],
    }),
  )

  await expect(WidgetLifecycle.attach(request())).resolves.toBe(false)

  expect(RendererProcess.invoke).toHaveBeenLastCalledWith('Viewlet.sendMultiple', [['Viewlet.dispose', 41]])
  expect(RendererProcess.invoke).toHaveBeenCalledTimes(2)
})

test('removes multiple widgets in one batch', async () => {
  await WidgetLifecycle.removeMany([request({ rendererUid: 41 }), request({ kind: 'hover', instanceId: 'editor:1:hover:1', rendererUid: 42 })])

  expect(RendererProcess.invoke).toHaveBeenCalledWith('Viewlet.sendMultiple', [
    ['Viewlet.dispose', 41],
    ['Viewlet.dispose', 42],
  ])
})

test('updates only the current widget instance', async () => {
  await WidgetLifecycle.attach(request())
  RendererProcess.invoke.mockClear()

  await expect(
    WidgetLifecycle.update(
      request({
        commands: [['Viewlet.setValueByName', 41, 'SearchValue', 'needle']],
      }),
    ),
  ).resolves.toBe(true)
  await expect(
    WidgetLifecycle.update(
      request({
        instanceId: 'editor:1:find:stale',
        commands: [['Viewlet.setValueByName', 41, 'SearchValue', 'stale']],
      }),
    ),
  ).resolves.toBe(false)

  expect(RendererProcess.invoke).toHaveBeenCalledTimes(1)
  expect(RendererProcess.invoke).toHaveBeenCalledWith('Viewlet.sendMultiple', [['Viewlet.setValueByName', 41, 'SearchValue', 'needle']])
})
