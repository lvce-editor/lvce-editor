import * as ClassNames from '../ClassNames/ClassNames.js'
import * as MergeClassNames from '../MergeClassNames/MergeClassNames.js'
import * as VirtualDomElements from '../VirtualDomElements/VirtualDomElements.js'
import { text } from '../VirtualDomHelpers/VirtualDomHelpers.js'

const getWelcomeItemVirtualDom = (item) => {
  if (item.type === 'message') {
    return [
      {
        type: VirtualDomElements.Div,
        className: ClassNames.WelcomeMessage,
        childCount: 1,
      },
      text(item.text),
    ]
  }
  if (item.type === 'button') {
    return [
      {
        type: VirtualDomElements.Button,
        className: MergeClassNames.mergeClassNames(ClassNames.Button, ClassNames.ButtonPrimary),
        childCount: 1,
      },
      text(item.text),
    ]
  }
  throw new Error(`unexpected welcome item type`)
}

export const getWelcomeVirtualDom = (items) => {
  return [
    {
      type: VirtualDomElements.Div,
      className: MergeClassNames.mergeClassNames(ClassNames.Viewlet, ClassNames.Explorer),
      tabIndex: 0,
      childCount: items.length,
    },
    ...items.flatMap(getWelcomeItemVirtualDom),
  ]
}
