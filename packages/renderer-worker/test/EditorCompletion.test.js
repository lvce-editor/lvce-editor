import { jest } from '@jest/globals'
import * as Editor from '../src/parts/Editor/Editor.js'
import * as EditorCompletion from '../src/parts/EditorCommand/EditorCommandCompletion.js'
import * as RendererProcess from '../src/parts/RendererProcess/RendererProcess.js'
import * as SharedProcess from '../src/parts/SharedProcess/SharedProcess.js'
import * as EditorBlur from '../src/parts/EditorCommand/EditorCommandBlur.js'

// TODO naming: show/hide vs open/close

const EMPTY_EDITOR = {
  lines: [''],
  cursor: {
    rowIndex: 0,
    columnIndex: 0,
  },
  top: 0,
  left: 0,
  columnWidth: 8,
  rowHeight: 20,
}

const setState = (state) => {
  Object.assign(EditorCompletion.state, state)
}

afterEach(() => {
  EditorBlur.state.blurListeners = []
})

test.skip('open', async () => {
  SharedProcess.state.send = jest.fn((message) => {
    switch (message.method) {
      case 384:
        SharedProcess.state.receive({
          id: message.id,
          result: [
            {
              label: 'item 1',
            },
            {
              label: 'item 2',
            },
            {
              label: 'item 3',
            },
          ],
        })
        break
      case 385:
        break
      default:
        console.log(message)
        throw new Error('unexpected message')
    }
  })
  setState({
    completionItems: [],
    focusedIndex: 0,
    openingReason: 0,
  })
  setActiveEditor(EMPTY_EDITOR)
  await EditorCompletion.open()
  expect(RendererProcess.state.send).toHaveBeenCalledWith([
    836,
    0,
    20,
    [
      {
        label: 'item 1',
      },
      {
        label: 'item 2',
      },
      {
        label: 'item 3',
      },
    ],
    1,
  ])
})

test.skip('close on blur', async () => {
  SharedProcess.state.send = jest.fn((message) => {
    switch (message.method) {
      case 384:
        SharedProcess.state.receive({
          id: message.id,
          result: [
            {
              label: 'item 1',
            },
            {
              label: 'item 2',
            },
            {
              label: 'item 3',
            },
          ],
        })
        break
      case 385:
        break
      default:
        console.log(message)
        throw new Error('unexpected message')
    }
  })
  setState({
    completionItems: [],
    focusedIndex: 0,
    openingReason: 0,
  })
  setActiveEditor(EMPTY_EDITOR)
  await EditorCompletion.open()
  EditorBlur.blur(EMPTY_EDITOR)
  expect(RendererProcess.state.send).toHaveBeenCalledWith([835])
})

test.skip('selectIndex', async () => {
  SharedProcess.state.send = jest.fn((message) => {
    if (message.method === 384) {
      SharedProcess.state.receive({
        id: message.id,
        result: [
          {
            label: 'item 1',
          },
          {
            label: 'item 2',
          },
          {
            label: 'item 3',
          },
        ],
      })
    }
  })
  Editor.state.activeEditor = EMPTY_EDITOR
  await EditorCompletion.open()
  EditorCompletion.selectIndex(0)
  expect(RendererProcess.state.send).toHaveBeenCalledWith([
    836,
    [
      {
        label: 'item 1',
      },
      {
        label: 'item 2',
      },
      {
        label: 'item 3',
      },
    ],
  ])
})

test.skip('close', async () => {
  setState({
    completionItems: [
      {
        label: 'item 1',
      },
      {
        label: 'item 2',
      },
      {
        label: 'item 3',
      },
    ],
    focusedIndex: 0,
  })
  RendererProcess.state.send = jest.fn((message) => {
    switch (message[0]) {
      case 909090:
        const callbackId = message[1]
        RendererProcess.state.handleMessage([
          /* Callback.resolve */ 67330,
          /* callbackId */ callbackId,
          /* result */ undefined,
        ])
        break
      default:
        throw new Error('unexpected message')
    }
  })
  await EditorCompletion.close()
  expect(RendererProcess.state.send).toHaveBeenCalledWith([835])
})

test.skip('selectIndex', async () => {
  SharedProcess.state.send = jest.fn((message) => {
    if (message.method === 384) {
      SharedProcess.state.receive({
        id: message.id,
        result: [
          {
            label: 'item 1',
          },
          {
            label: 'item 2',
          },
          {
            label: 'item 3',
          },
        ],
      })
    }
  })
  // Edi
  Editor.state.activeEditor = EMPTY_EDITOR
  await EditorCompletion.open()
  EditorCompletion.selectIndex(0)
  expect(RendererProcess.state.send).toHaveBeenLastCalledWith(2, [835])
})

test.skip('selectCurrent', async () => {
  SharedProcess.state.send = jest.fn()
  await EditorCompletion.open()
  await EditorCompletion.selectCurrent()
  expect(RendererProcess.state.send).toHaveBeenLastCalledWith(1, [835])
})

// TODO test when error is thrown from completion provider
