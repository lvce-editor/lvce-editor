import * as AriaRoles from '../AriaRoles/AriaRoles.js'
import * as TabIndex from '../TabIndex/TabIndex.js'
import * as VirtualDomElements from '../VirtualDomElements/VirtualDomElements.js'
import { text } from '../VirtualDomHelpers/VirtualDomHelpers.js'

export const getDialogVirtualDom = (content, closeMessage, infoMessage, okMessage, copyMessage, productName) => {
  const dom = [
    {
      type: VirtualDomElements.Div,
      className: 'DialogContent',
      tabIndex: TabIndex.Focusable,
      role: AriaRoles.Dialog,
      ariaModal: 'true',
      ariaLabelledBy: 'DialogIcon DialogHeading',
      onFocusIn: 'handleFocusIn',
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
    ...content,

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
