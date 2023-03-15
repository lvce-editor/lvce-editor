import * as ViewletSearch from '../src/parts/ViewletSearch/ViewletSearch.js'
import * as TextSearchResultType from '../src/parts/TextSearchResultType/TextSearchResultType.js'
import * as ViewletSearchDismissItem from '../src/parts/ViewletSearch/ViewletSearchDismissItem.js'

test('dismissItem - no items', () => {
  const state = {
    ...ViewletSearch.create(),
    items: [],
    listFocusedIndex: -1,
    matchCount: 0,
    fileCount: 0,
  }
  expect(ViewletSearchDismissItem.dismissItem(state)).toBe(state)
})

test('dismissItem - remove one match', () => {
  const state = {
    ...ViewletSearch.create(),
    items: [
      {
        type: TextSearchResultType.File,
      },
      {
        type: TextSearchResultType.Match,
      },
      {
        type: TextSearchResultType.Match,
      },
    ],
    listFocusedIndex: 2,
    matchCount: 2,
    fileCount: 1,
  }
  expect(ViewletSearchDismissItem.dismissItem(state)).toMatchObject({
    items: [
      {
        type: TextSearchResultType.File,
      },
      {
        type: TextSearchResultType.Match,
      },
    ],
    listFocusedIndex: 2,
    matchCount: 1,
    fileCount: 1,
    message: 'Found 1 result in 1 file',
  })
})

test('dismissItem - remove one file', () => {
  const state = {
    ...ViewletSearch.create(),
    items: [
      {
        type: TextSearchResultType.File,
        text: 'a.txt',
      },
      {
        type: TextSearchResultType.Match,
        text: 'a',
      },
      {
        type: TextSearchResultType.File,
        text: 'b.txt',
      },
      {
        type: TextSearchResultType.Match,
        text: 'b',
      },
    ],
    listFocusedIndex: 2,
    matchCount: 2,
    fileCount: 2,
  }
  expect(ViewletSearchDismissItem.dismissItem(state)).toMatchObject({
    items: [
      {
        type: TextSearchResultType.File,
        text: 'a.txt',
      },
      {
        type: TextSearchResultType.Match,
        text: 'a',
      },
    ],
    listFocusedIndex: 1,
    matchCount: 1,
    fileCount: 1,
    message: 'Found 1 result in 1 file',
  })
})

test('dismissItem - remove first file', () => {
  const state = {
    ...ViewletSearch.create(),
    items: [
      {
        type: TextSearchResultType.File,
        text: 'a.txt',
      },
      {
        type: TextSearchResultType.Match,
        text: 'a',
      },
      {
        type: TextSearchResultType.File,
        text: 'b.txt',
      },
      {
        type: TextSearchResultType.Match,
        text: 'b',
      },
    ],
    listFocusedIndex: 0,
    matchCount: 2,
    fileCount: 2,
  }
  expect(ViewletSearchDismissItem.dismissItem(state)).toMatchObject({
    items: [
      {
        type: TextSearchResultType.File,
        text: 'b.txt',
      },
      {
        type: TextSearchResultType.Match,
        text: 'b',
      },
    ],
    listFocusedIndex: 0,
    matchCount: 1,
    fileCount: 1,
    message: 'Found 1 result in 1 file',
  })
})

test('dismissItem - remove only match', () => {
  const state = {
    ...ViewletSearch.create(),
    items: [
      {
        type: TextSearchResultType.File,
      },
      {
        type: TextSearchResultType.Match,
      },
    ],
    listFocusedIndex: 1,
    matchCount: 1,
    fileCount: 1,
  }
  expect(ViewletSearchDismissItem.dismissItem(state)).toMatchObject({
    items: [],
    listFocusedIndex: -1,
    matchCount: 0,
    fileCount: 0,
    message: 'No results found',
  })
})

test('dismissItem - remove only file', () => {
  const state = {
    ...ViewletSearch.create(),
    items: [
      {
        type: TextSearchResultType.File,
      },
      {
        type: TextSearchResultType.Match,
      },
    ],
    listFocusedIndex: 0,
    matchCount: 1,
    fileCount: 1,
  }
  expect(ViewletSearchDismissItem.dismissItem(state)).toMatchObject({
    items: [],
    listFocusedIndex: -1,
    matchCount: 0,
    fileCount: 0,
    message: 'No results found',
  })
})

test('dismissItem - remove one file in the middle', () => {
  const state = {
    ...ViewletSearch.create(),
    items: [
      {
        type: TextSearchResultType.File,
        text: 'a.txt',
      },
      {
        type: TextSearchResultType.Match,
        text: 'a',
      },
      {
        type: TextSearchResultType.File,
        text: 'b.txt',
      },
      {
        type: TextSearchResultType.Match,
        text: 'b',
      },
      {
        type: TextSearchResultType.File,
        text: 'c.txt',
      },
      {
        type: TextSearchResultType.Match,
        text: 'c',
      },
    ],
    listFocusedIndex: 2,
    matchCount: 3,
    fileCount: 3,
  }
  expect(ViewletSearchDismissItem.dismissItem(state)).toMatchObject({
    items: [
      {
        type: TextSearchResultType.File,
        text: 'a.txt',
      },
      {
        type: TextSearchResultType.Match,
        text: 'a',
      },
      {
        type: TextSearchResultType.File,
        text: 'c.txt',
      },
      {
        type: TextSearchResultType.Match,
        text: 'c',
      },
    ],
    listFocusedIndex: 2,
    matchCount: 2,
    fileCount: 2,
    message: 'Found 2 results in 2 files',
  })
})
