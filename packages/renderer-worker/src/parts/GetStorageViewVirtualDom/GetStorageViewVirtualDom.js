import * as VirtualDomElements from '../VirtualDomElements/VirtualDomElements.js'
import { text } from '../VirtualDomHelpers/VirtualDomHelpers.js'

const getTableRowDom = (row) => {
  const { key, value } = row
  return [
    {
      type: VirtualDomElements.Tr,
      childCount: 2,
    },
    {
      type: VirtualDomElements.Td,
      childCount: 1,
    },
    text(key),
    {
      type: VirtualDomElements.Td,
      childCount: 1,
    },
    text(value),
  ]
}

export const getStorageViewDom = (rows) => {
  const dom = []
  dom.push(
    {
      type: VirtualDomElements.H1,
      childCount: 1,
    },
    text('Local Storage'),
    {
      type: VirtualDomElements.Table,
      className: 'StorageTable',
      childCount: 2,
    },
    {
      type: VirtualDomElements.THead,
      childCount: 1,
    },
    {
      type: VirtualDomElements.Tr,
      childCount: 2,
    },
    {
      type: VirtualDomElements.Th,
      childCount: 1,
    },
    text('Key'),
    {
      type: VirtualDomElements.Th,
      childCount: 1,
    },
    text('Value'),
    {
      type: VirtualDomElements.TBody,
      childCount: rows.length,
    },
    ...rows.flatMap(getTableRowDom),
  )
  return dom
}
