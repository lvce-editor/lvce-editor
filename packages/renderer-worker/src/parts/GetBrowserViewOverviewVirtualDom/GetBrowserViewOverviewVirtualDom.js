import * as VirtualDomElements from '../VirtualDomElements/VirtualDomElements.js'
import { text } from '../VirtualDomHelpers/VirtualDomHelpers.js'

export const getDom = (overview) => {
  const dom = []
  dom.push(
    {
      type: VirtualDomElements.Div,
      className: 'Content',
      childCount: 1,
    },
    text(overview),
  )
  return dom
}
