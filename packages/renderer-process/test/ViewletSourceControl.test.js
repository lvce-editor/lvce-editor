/**
 * @jest-environment jsdom
 */
import { jest } from '@jest/globals'

beforeEach(() => {
  jest.resetAllMocks()
})

jest.unstable_mockModule(
  '../src/parts/RendererWorker/RendererWorker.js',
  () => {
    return {
      send: jest.fn(() => {
        throw new Error('not implemented')
      }),
    }
  }
)

const RendererWorker = await import(
  '../src/parts/RendererWorker/RendererWorker.js'
)

const ViewletSourceControl = await import(
  '../src/parts/Viewlet/ViewletSourceControl.js'
)
const Viewlet = await import('../src/parts/Viewlet/Viewlet.js')

const getTextContent = ($Element) => {
  return $Element.textContent
}

const getSimpleList = (state) => {
  return Array.from(state.$ViewletTree.children).map(getTextContent)
}

test('name', () => {
  expect(ViewletSourceControl.name).toBe('Source Control')
})

test('create', () => {
  const state = ViewletSourceControl.create()
  expect(state).toBeDefined()
})

test('setChangedFiles', () => {
  const state = ViewletSourceControl.create()
  ViewletSourceControl.setChangedFiles(state, {
    workingTree: [
      {
        file: '/tmp/file-1',
      },
      {
        file: '/tmp/file-2',
      },
    ],
  })
  expect(getSimpleList(state)).toEqual(['file-1', 'file-2'])
})

test('focus', () => {
  const state = ViewletSourceControl.create()
  Viewlet.mount(document.body, state)
  ViewletSourceControl.focus(state)
  expect(document.activeElement).toBe(state.$ViewSourceControlInput)
})

test('event - click', () => {
  // @ts-ignore
  RendererWorker.send.mockImplementation(() => {})
  const state = ViewletSourceControl.create()
  ViewletSourceControl.setChangedFiles(state, {
    workingTree: [
      {
        file: '/tmp/file-1',
      },
      {
        file: '/tmp/file-2',
      },
    ],
  })
  state.$ViewletTree.children[0].dispatchEvent(
    new Event('click', {
      bubbles: true,
      cancelable: true,
    })
  )
  expect(RendererWorker.send).toHaveBeenCalledWith(
    2133,
    'Source Control',
    'handleClick',
    0
  )
})

test('accessibility - SourceControlInput should have aria-label', () => {
  const state = ViewletSourceControl.create()
  expect(state.$ViewSourceControlInput.ariaLabel).toBe('Source Control Input')
})
