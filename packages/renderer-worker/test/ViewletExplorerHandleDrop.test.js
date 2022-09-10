import * as ViewletExplorerHandleDrop from '../src/parts/ViewletExplorer/ViewletExplorerHandleDrop.js'

test('handleDrop', () => {
  const state = {
    root: '/test',
    focusedIndex: 1,
    dirents: [],
  }
  expect(
    ViewletExplorerHandleDrop.handleDrop(state, [
      {
        lastModified: 1662556917899,
        lastModifiedDate: new Date(),
        name: 'file.txt',
        path: '/test/file.txt',
        size: 4,
        type: 'text/plain',
        webkitRelativePath: '',
      },
    ])
  ).toMatchObject({
    focusedIndex: 0,
  })
})
