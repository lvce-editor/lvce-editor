import * as AboutStrings from '../AboutStrings/AboutStrings.js'
import * as VirtualDomElements from '../VirtualDomElements/VirtualDomElements.js'
import { text } from '../VirtualDomHelpers/VirtualDomHelpers.js'

const infoRow = {
  type: VirtualDomElements.Div,
  className: 'DialogMessage',
  childCount: 1,
}

export const getAboutVirtualDom = (productName, message) => {
  const dom = [
    {
      type: VirtualDomElements.Div,
      className: 'DialogContent',
      childCount: 3,
    },
    {
      type: VirtualDomElements.Div,
      className: 'DialogToolBar',
      childCount: 1,
    },
    {
      type: VirtualDomElements.Div,
      className: 'DialogClose',
      ariaLabel: 'Close',
      onClick: 'handleClickClose',
      childCount: 1,
    },
    {
      type: VirtualDomElements.Div,
      className: 'MaskIcon MaskIconClose',
      childCount: 0,
    },
    {
      type: VirtualDomElements.Div,
      className: 'DialogContentWrapper',
      childCount: 2,
    },
    {
      type: VirtualDomElements.Div,
      className: 'DialogIcon DialogInfoIcon MaskIcon MaskIconInfo',
      childCount: 0,
    },
    {
      type: VirtualDomElements.Div,
      className: 'DialogContentRight',
      childCount: 2,
    },
    {
      type: VirtualDomElements.Div,
      className: 'DialogHeading',
      childCount: 1,
    },
    text(productName),
    infoRow,
    text(message),
    {
      type: VirtualDomElements.Div,
      className: 'DialogButtons',
      childCount: 2,
    },
    {
      type: VirtualDomElements.Button,
      className: 'Button ButtonSecondary',
      onClick: 'handleClickOk',
      childCount: 1,
    },
    text(AboutStrings.ok()),
    {
      type: VirtualDomElements.Button,
      className: 'Button ButtonPrimary',
      onClick: 'handleClickCopy',
      childCount: 1,
    },
    text(AboutStrings.copy()),
  ]
  return dom
}
