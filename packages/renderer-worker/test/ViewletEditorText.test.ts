import { beforeEach, expect, jest, test } from '@jest/globals'

const editorWorkerInvoke = jest.fn()

beforeEach(() => {
  jest.resetAllMocks()
})

jest.unstable_mockModule('../src/parts/MeasureTextWidth/MeasureTextWidth.js', () => {
  return {
    measureTextWidth(text) {
      return text.length * 10
    },
  }
})

jest.unstable_mockModule('../src/parts/EditorWorker/EditorWorker.ts', () => {
  return {
    invoke: editorWorkerInvoke,
  }
})

const ViewletEditorText = await import('../src/parts/ViewletEditorText/ViewletEditorText.js')

test('resize - increase height', async () => {
  editorWorkerInvoke.mockImplementation((method) => {
    switch (method) {
      case 'Editor.resize':
        return undefined
      case 'Editor.diff2':
        return [1]
      case 'Editor.render2':
        return [['setRows']]
      default:
        throw new Error(`unexpected method ${method}`)
    }
  })
  const state = {
    ...ViewletEditorText.create(0, '', 0, 0, 20, 20),
    lines: ['line 1', 'line 2', 'line 3', 'line 4', 'line 5'],
    minLineY: 0,
    maxLineY: 1,
    numberOfVisibleLines: 1,
    focused: true,
    width: 800,
    differences: [0, 0, 0, 0],
  }
  const newState = await ViewletEditorText.resize(state, {
    x: 200,
    y: 200,
    width: 200,
    height: 60,
  })
  expect(newState).toEqual(
    expect.objectContaining({
      minLineY: 0,
      maxLineY: 3,
      numberOfVisibleLines: 3,
      scrollBarHeight: 36,
      finalDeltaY: 40,
    }),
  )
  expect(editorWorkerInvoke).toHaveBeenNthCalledWith(1, 'Editor.resize', 0, {
    x: 200,
    y: 200,
    width: 200,
    height: 60,
  })
  expect(editorWorkerInvoke).toHaveBeenNthCalledWith(2, 'Editor.diff2', 0)
  expect(editorWorkerInvoke).toHaveBeenNthCalledWith(3, 'Editor.render2', 0, [1])
  expect(newState.commands).toEqual([['setRows']])
})

test('resize - same height', async () => {
  editorWorkerInvoke.mockImplementation((method) => {
    switch (method) {
      case 'Editor.resize':
        return undefined
      case 'Editor.diff2':
        return []
      case 'Editor.render2':
        return []
      default:
        throw new Error(`unexpected method ${method}`)
    }
  })
  const state = {
    ...ViewletEditorText.create(0, '', 0, 0, 20, 20),
    lines: ['line 1', 'line 2', 'line 3', 'line 4', 'line 5'],
    minLineY: 0,
    maxLineY: 3,
    numberOfVisibleLines: 3,
    focused: true,
    width: 800,
    differences: [0, 0, 0, 0],
  }
  const newState = await ViewletEditorText.resize(state, {
    x: 200,
    y: 200,
    width: 200,
    height: 60,
  })
  expect(newState).toEqual(
    expect.objectContaining({
      minLineY: 0,
      maxLineY: 3,
      numberOfVisibleLines: 3,
      scrollBarHeight: 36,
      finalDeltaY: 40,
    }),
  )
})

test('resize - reduce height', async () => {
  editorWorkerInvoke.mockImplementation((method) => {
    switch (method) {
      case 'Editor.resize':
        return undefined
      case 'Editor.diff2':
        return []
      case 'Editor.render2':
        return []
      default:
        throw new Error(`unexpected method ${method}`)
    }
  })
  const state = {
    ...ViewletEditorText.create(0, '', 0, 0, 20, 20),
    lines: ['line 1', 'line 2', 'line 3', 'line 4', 'line 5'],
    minLineY: 0,
    maxLineY: 3,
    numberOfVisibleLines: 3,
    height: 60,
    focused: true,
    width: 800,
    differences: [0, 0, 0, 0],
  }
  const newState = await ViewletEditorText.resize(state, {
    x: 200,
    y: 200,
    width: 200,
    height: 20,
  })
  expect(newState).toEqual(
    expect.objectContaining({
      minLineY: 0,
      maxLineY: 1,
      numberOfVisibleLines: 1,
      scrollBarHeight: 20,
      finalDeltaY: 80,
    }),
  )
})

test('resize - increase height while scrolled clamps visible rows to bottom', async () => {
  editorWorkerInvoke.mockImplementation((method) => {
    switch (method) {
      case 'Editor.resize':
        return undefined
      case 'Editor.diff2':
        return []
      case 'Editor.render2':
        return []
      default:
        throw new Error(`unexpected method ${method}`)
    }
  })
  const state = {
    ...ViewletEditorText.create(0, '', 0, 0, 100, 200),
    deltaY: 1800,
    finalDeltaY: 1800,
    finalY: 90,
    lines: Array.from({ length: 100 }, (_, index) => `line ${index}`),
    minLineY: 90,
    maxLineY: 100,
    numberOfVisibleLines: 10,
    scrollBarHeight: 20,
    focused: true,
    width: 100,
    differences: [0, 0, 0, 0],
  }
  const newState = await ViewletEditorText.resize(state, {
    x: 0,
    y: 0,
    width: 100,
    height: 400,
  })
  expect(newState).toEqual(
    expect.objectContaining({
      deltaY: 1600,
      finalDeltaY: 1600,
      minLineY: 80,
      maxLineY: 100,
      numberOfVisibleLines: 20,
      scrollBarHeight: 80,
    }),
  )
})
