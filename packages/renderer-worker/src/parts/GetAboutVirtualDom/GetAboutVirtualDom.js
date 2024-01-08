import * as AboutStrings from '../AboutStrings/AboutStrings.js'
import * as ClassNames from '../ClassNames/ClassNames.js'
import * as VirtualDomElements from '../VirtualDomElements/VirtualDomElements.js'
import { text } from '../VirtualDomHelpers/VirtualDomHelpers.js'

const infoRow = {
  type: VirtualDomElements.Div,
  className: ClassNames.InfoRow,
  childCount: 2,
}

export const getAboutVirtualDom = (productName, versionKey, versionValue, commitKey, commitValue, dateKey, dateValue, browserKey, browserValue) => {
  const dom = [
    {
      type: VirtualDomElements.Div,
      className: ClassNames.AboutContent,
      childCount: 2,
    },
    {
      type: VirtualDomElements.Div,
      className: ClassNames.AboutContentWrapper,
      childCount: 2,
    },
    {
      type: VirtualDomElements.Div,
      className: ClassNames.AboutContentLeft,
      childCount: 1,
    },
    {
      type: VirtualDomElements.Div,
      className: 'AboutInfoIcon MaskIcon MaskIconInfo',
      childCount: 0,
    },
    {
      type: VirtualDomElements.Div,
      className: ClassNames.AboutContentRight,
      childCount: 5,
    },
    {
      type: VirtualDomElements.Div,
      className: ClassNames.AboutContentRightHeading,
      childCount: 1,
    },
    text(productName),
    infoRow,
    text(`${versionKey} `),
    text(versionValue),
    infoRow,
    text(`${commitKey} `),
    text(commitValue),
    infoRow,
    text(`${dateKey} `),
    text(dateValue),
    infoRow,
    text(`${browserKey} `),
    text(browserValue),
    {
      type: VirtualDomElements.Div,
      className: ClassNames.AboutButtons,
      childCount: 2,
    },
    {
      type: VirtualDomElements.Button,
      className: 'Button ButtonSecondary',
      childCount: 1,
    },
    text(AboutStrings.ok()),
    {
      type: VirtualDomElements.Button,
      childCount: 1,
      className: 'Button ButtonPrimary',
    },
    text(AboutStrings.copy()),
  ]
  return dom
}
