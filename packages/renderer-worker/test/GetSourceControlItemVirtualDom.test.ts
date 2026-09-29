import { expect, test } from '@jest/globals'
import * as DirentType from '../src/parts/DirentType/DirentType.js'
import * as EmptySourceControlButtons from '../src/parts/EmptySourceControlButtons/EmptySourceControlButton.js'
import * as GetSourceControlItemVirtualDom from '../src/parts/GetSourceControlItemVirtualDom/GetSourceControlItemVirtualDom.js'
import * as VirtualDomElements from '../src/parts/VirtualDomElements/VirtualDomElements.js'

test('wraps the filename in a separate span', () => {
  const dom = GetSourceControlItemVirtualDom.getSourceControlItemVirtualDom({
    posInSet: 1,
    setSize: 1,
    icon: '/file-icon.svg',
    file: '/workspace/src/file.js',
    label: 'file.js',
    decorationIcon: '/modified.svg',
    decorationIconTitle: 'Modified',
    decorationStrikeThrough: false,
    detail: 'src/',
    buttons: EmptySourceControlButtons.emptySourceControlButtons,
    type: DirentType.File,
  })

  expect(dom.slice(2, 7)).toEqual([
    {
      type: VirtualDomElements.Div,
      className: 'Label Grow',
      childCount: 2,
    },
    {
      type: VirtualDomElements.Span,
      childCount: 1,
    },
    {
      type: VirtualDomElements.Text,
      text: 'file.js',
      childCount: 0,
    },
    {
      type: VirtualDomElements.Span,
      className: 'LabelDetail',
      childCount: 1,
    },
    {
      type: VirtualDomElements.Text,
      text: 'src/',
      childCount: 0,
    },
  ])
})

test('does not render an empty file icon', () => {
  const dom = GetSourceControlItemVirtualDom.getSourceControlItemVirtualDom({
    posInSet: 1,
    setSize: 1,
    icon: '',
    file: '/workspace/src/file.js',
    label: 'file.js',
    decorationIcon: '/modified.svg',
    decorationIconTitle: 'Modified',
    decorationStrikeThrough: false,
    detail: 'src/',
    buttons: EmptySourceControlButtons.emptySourceControlButtons,
    type: DirentType.File,
  })

  expect(dom[0].childCount).toBe(2)
  expect(dom.some((node) => node.className === 'FileIcon')).toBe(false)
})
