import * as DomEventOptions from '../DomEventOptions/DomEventOptions.js'
import * as DomEventType from '../DomEventType/DomEventType.js'
import * as VirtualDom from '../VirtualDom/VirtualDom.js'
import * as ViewletSearchEvents from './ViewletSearchEvents.js'
import * as VirtualDomDiff from '../VirtualDomDiff/VirtualDomDiff.js'

export const create = () => {
  // TODO vscode uses a textarea instead of an input
  // which is better because it supports multiline input
  // but it is difficult to implement because the vscode
  // textarea has a flexible max height.
  // The implementation uses a mirror dom element,
  // on text area input the text copied to the
  // mirror dom element, then the mirror dom element height
  // is measured and in turn applied to the text area.
  // This way the text area always has the smallest
  // necessary height value.

  const $Viewlet = document.createElement('div')
  $Viewlet.className = 'Viewlet Search'

  return {
    $Viewlet,
  }
}

export const attachEvents = (state) => {
  const { $Viewlet } = state
  $Viewlet.addEventListener(DomEventType.Input, ViewletSearchEvents.handleInput, DomEventOptions.Capture)
  $Viewlet.addEventListener(DomEventType.Focus, ViewletSearchEvents.handleFocus, DomEventOptions.Capture)
  $Viewlet.addEventListener(DomEventType.Click, ViewletSearchEvents.handleClickHeader)

  // AttachEvents.attachEvents($ScrollBar, {
  //   [DomEventType.PointerDown]: ViewletSearchEvents.handleScrollBarPointerDown,
  // })

  // AttachEvents.attachEvents($SearchHeader, {
  //   [DomEventType.Click]: ViewletSearchEvents.handleHeaderClick,
  // })

  // AttachEvents.attachEvents($List, {
  //   [DomEventType.Focus]: ViewletSearchEvents.handleListFocus,
  //   [DomEventType.Blur]: ViewletSearchEvents.handleListBlur,
  //   [DomEventType.MouseDown]: ViewletSearchEvents.handleClick,
  //   [DomEventType.ContextMenu]: ViewletSearchEvents.handleContextMenu,
  // })

  // $List.addEventListener(DomEventType.Wheel, ViewletSearchEvents.handleWheel, DomEventOptions.Passive)
}

export const setDom = (state, diff) => {
  const { $Viewlet } = state
  console.log({ diff })
  VirtualDomDiff.renderDiff($Viewlet, diff, ViewletSearchEvents)
  // TODO implement virtual dom diffing instead
  // const $OldInputs = $Viewlet.querySelectorAll('textarea,input')
  // const map = Object.create(null)
  // let focused
  // const $Active = document.activeElement
  // for (const $Input of $OldInputs) {
  //   map[$Input.name] = $Input
  //   if ($Input === $Active) {
  //     focused = $Input
  //   }
  // }
  // VirtualDom.renderInto($Viewlet, dom, ViewletSearchEvents)
  // const $NewInputs = $Viewlet.querySelectorAll('textarea,input')
  // for (const $NewInput of $NewInputs) {
  //   const $Old = map[$NewInput.name]
  //   if ($Old) {
  //     $NewInput.replaceWith($Old)
  //     if ($Old === $Active) {
  //       $Old.focus()
  //     }
  //   }
  // }
}

export * from '../ViewletScrollable/ViewletScrollable.js'
