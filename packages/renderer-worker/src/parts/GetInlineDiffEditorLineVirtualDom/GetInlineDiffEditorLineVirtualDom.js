import * as GetDiffLineVirtualDomPrefix from '../GetDiffLineVirtualDomPrefix/GetDiffLineVirtualDomPrefix.js'
import { text } from '../VirtualDomHelpers/VirtualDomHelpers.js'

export const renderLine = (value) => {
  const { type } = value
  const prefix = GetDiffLineVirtualDomPrefix.getPrefix(type)
  return [prefix, text(value.text)]
}

export const renderLineWithLineNumber = (value) => {
  const { type, index } = value
  const prefix = GetDiffLineVirtualDomPrefix.getPrefix(type)
  return [{ ...prefix, childCount: 2 }, text(index), text(value.text)]
}
