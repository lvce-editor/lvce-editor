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
        setSize: 2,
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
        setSize: 2,
      },
      {
        type: TextSearchResultType.Match,
      },
    ],
    listFocusedIndex: -1,
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
        setSize: 1,
        title: 'a.txt',
      },
      {
        type: TextSearchResultType.Match,
        title: 'a',
      },
      {
        type: TextSearchResultType.File,
        setSize: 1,
        title: 'b.txt',
      },
      {
        type: TextSearchResultType.Match,
        title: 'b',
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
        setSize: 1,
        title: 'a.txt',
      },
      {
        type: TextSearchResultType.Match,
        title: 'a',
      },
    ],
    listFocusedIndex: 1,
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
        setSize: 1,
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
        setSize: 1,
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
