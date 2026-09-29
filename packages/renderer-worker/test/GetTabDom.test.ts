import { expect, test } from '@jest/globals'
import * as GetTabDom from '../src/parts/GetTabDom/GetTabDom.js'

test('uses the pretty path as title', () => {
  const dom = GetTabDom.getTabDom({
    fixedWidth: 0,
    flags: 0,
    icon: '',
    isActive: true,
    label: 'file.txt',
    tabWidth: 100,
    title: '~/Documents/file.txt',
    uid: 1,
    uri: 'file:///home/test/Documents/file.txt',
  })

  expect(dom[0].title).toBe('~/Documents/file.txt')
})

test('does not render an empty file icon', () => {
  const dom = GetTabDom.getTabDom({
    fixedWidth: 0,
    flags: 0,
    icon: '',
    isActive: true,
    label: 'file.txt',
    tabWidth: 100,
    title: '~/Documents/file.txt',
    uid: 1,
    uri: 'file:///home/test/Documents/file.txt',
  })

  expect(dom[0].childCount).toBe(2)
  expect(dom.some((node) => node.className === 'FileIcon')).toBe(false)
})
