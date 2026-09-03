import { expect, test } from '@jest/globals'
import * as DomEventListenerFunctions from '../src/parts/DomEventListenerFunctions/DomEventListenerFunctions.js'
import * as GetSimpleBrowserHistoryVirtualDom from '../src/parts/GetSimpleBrowserHistoryVirtualDom/GetSimpleBrowserHistoryVirtualDom.js'
import * as VirtualDomElements from '../src/parts/VirtualDomElements/VirtualDomElements.js'

const getNodesByClassName = (dom: readonly any[], className: string) => {
  return dom.filter((node) => node.className === className)
}

test('renders each history entry with its date, url, and remove button', () => {
  const date = Date.UTC(2026, 8, 3, 12, 30)
  const entries = [
    { date, url: 'https://newer.example/docs' },
    { date: date - 1000, url: 'https://older.example' },
  ]

  const dom = GetSimpleBrowserHistoryVirtualDom.getSimpleBrowserHistoryVirtualDom(entries, '')

  expect(getNodesByClassName(dom, 'SimpleBrowserHistoryEntry')).toHaveLength(2)
  expect(getNodesByClassName(dom, 'SimpleBrowserHistoryDate')[0]).toMatchObject({
    type: VirtualDomElements.Time,
    dateTime: new Date(date).toISOString(),
  })
  expect(dom).toContainEqual({ type: VirtualDomElements.Text, text: new Date(date).toLocaleString(), childCount: 0 })
  expect(dom).toContainEqual({ type: VirtualDomElements.Text, text: 'https://newer.example/docs', childCount: 0 })
  expect(getNodesByClassName(dom, 'Button ButtonSecondary SimpleBrowserHistoryRemove')[0]).toMatchObject({
    'data-index': 0,
    ariaLabel: 'Remove https://newer.example/docs from history',
    onClick: DomEventListenerFunctions.HandleClickSimpleBrowserHistoryRemove,
  })
})

test('filters entries by url while retaining their original removal index', () => {
  const entries = [
    { date: 200, url: 'https://newer.example' },
    { date: 100, url: 'https://matching.example' },
  ]

  const dom = GetSimpleBrowserHistoryVirtualDom.getSimpleBrowserHistoryVirtualDom(entries, 'matching')

  expect(getNodesByClassName(dom, 'SimpleBrowserHistoryEntry')).toHaveLength(1)
  expect(getNodesByClassName(dom, 'Button ButtonSecondary SimpleBrowserHistoryRemove')[0]).toMatchObject({ 'data-index': 1 })
  expect(dom).toContainEqual({ type: VirtualDomElements.Text, text: 'https://matching.example', childCount: 0 })
})

test('renders an empty state', () => {
  const dom = GetSimpleBrowserHistoryVirtualDom.getSimpleBrowserHistoryVirtualDom([], '')

  expect(dom).toContainEqual({
    type: VirtualDomElements.P,
    className: 'SimpleBrowserHistoryEmpty',
    childCount: 1,
  })
  expect(dom).toContainEqual({ type: VirtualDomElements.Text, text: 'No history entries', childCount: 0 })
})
