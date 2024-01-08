import * as AboutStrings from '../AboutStrings/AboutStrings.js'
import * as VirtualDomElements from '../VirtualDomElements/VirtualDomElements.js'
import * as TabIndex from '../TabIndex/TabIndex.js'
import * as AriaRoles from '../AriaRoles/AriaRoles.js'
import { text } from '../VirtualDomHelpers/VirtualDomHelpers.js'

const br = {
  type: VirtualDomElements.Br,
  childCount: 0,
}

const renderLine = (line, index) => {
  if (index === 0) {
    return [text(line)]
  }
  return [br, text(line)]
}

export const getAboutVirtualDom = (productName, lines, closeMessage, okMessage, copyMessage, infoMessage) => {
  const dom = [
    {
      type: VirtualDomElements.Div,
      className: 'DialogContent',
      tabIndex: TabIndex.Focusable,
      role: AriaRoles.Dialog,
      ariaModal: 'true',
      ariaLabelledBy: 'DialogIcon DialogHeading',
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
      ariaLabel: closeMessage,
      role: AriaRoles.Button,
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
      id: 'DialogIcon',
      ariaLabel: infoMessage,
      childCount: 0,
    },
    {
      type: VirtualDomElements.Div,
      className: 'DialogContentRight',
      childCount: 2,
    },
    {
      type: VirtualDomElements.Div,
      id: 'DialogHeading',
      className: 'DialogHeading',
      childCount: 1,
    },
    text(productName),
    {
      type: VirtualDomElements.Div,
      className: 'DialogMessage',
      childCount: lines.length * 2 - 1,
    },
    ...lines.flatMap(renderLine),
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
    text(okMessage),
    {
      type: VirtualDomElements.Button,
      className: 'Button ButtonPrimary',
      onClick: 'handleClickCopy',
      childCount: 1,
    },
    text(copyMessage),
  ]
  return dom
}
