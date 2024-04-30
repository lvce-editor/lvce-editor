import * as AriaRoles from '../AriaRoles/AriaRoles.js'
import * as ClassNames from '../ClassNames/ClassNames.js'
import * as DomEventListenerFunctions from '../DomEventListenerFunctions/DomEventListenerFunctions.js'
import * as GetButtonVirtualDom from '../GetButtonVirtualDom/GetButtonVirtualDom.js'
import * as TabIndex from '../TabIndex/TabIndex.js'
import * as VirtualDomElements from '../VirtualDomElements/VirtualDomElements.js'
import { text } from '../VirtualDomHelpers/VirtualDomHelpers.js'

export const getDialogVirtualDom = (content, closeMessage, infoMessage, okMessage, copyMessage, productName) => {
  const dom = [
    {
      type: VirtualDomElements.Div,
      className: ClassNames.DialogContent,
      tabIndex: TabIndex.Focusable,
      role: AriaRoles.Dialog,
      ariaModal: 'true',
      ariaLabelledBy: 'DialogIcon DialogHeading',
      onFocusIn: DomEventListenerFunctions.HandleFocusIn,
      childCount: 3,
    },
    {
      type: VirtualDomElements.Div,
      className: ClassNames.DialogToolBarRow,
      childCount: 1,
    },
    {
      type: VirtualDomElements.Div,
      className: ClassNames.DialogClose,
      ariaLabel: closeMessage,
      role: AriaRoles.Button,
      onClick: DomEventListenerFunctions.HandleClickClose,
      childCount: 1,
    },
    {
      type: VirtualDomElements.Div,
      className: 'MaskIcon MaskIconClose',
      childCount: 0,
    },
    {
      type: VirtualDomElements.Div,
      className: ClassNames.DialogMessageRow,
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
      className: ClassNames.DialogContentRight,
      childCount: 2,
    },
    {
      type: VirtualDomElements.Div,
      id: 'DialogHeading',
      className: ClassNames.DialogHeading,
      childCount: 1,
    },
    text(productName),
    ...content,
    {
      type: VirtualDomElements.Div,
      className: ClassNames.DialogButtonsRow,
      childCount: 2,
    },
    ...GetButtonVirtualDom.getSecondaryButtonVirtualDom(okMessage, DomEventListenerFunctions.HandleClickOk),
    ...GetButtonVirtualDom.getPrimaryButtonVirtualDom(copyMessage, DomEventListenerFunctions.HandleClickCopy),
  ]
  return dom
}
