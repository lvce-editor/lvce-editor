import * as VirtualDomElements from '../VirtualDomElements/VirtualDomElements.js'
import { text } from '../VirtualDomHelpers/VirtualDomHelpers.js'

const getExtensionVirtualDom = (extension) => {
  const { posInSet, setSize, top, icon, name, description, publisher, focused } = extension
  const dom = [
    {
      type: VirtualDomElements.Div,
      role: 'listitem',
      ariaRoleDescription: 'Extension',
      className: 'ExtensionListItem',
      ariaPosInSet: posInSet,
      ariaSetSize: setSize,
      top,
      childCount: 2,
    },
    {
      type: VirtualDomElements.Img,
      src: icon,
      className: 'ExtensionListItemIcon',
      childCount: 0,
    },
    {
      type: VirtualDomElements.Div,
      className: 'ExtensionListItemDetail',
      childCount: 3,
    },
    {
      type: VirtualDomElements.Div,
      className: 'ExtensionListItemName',
      childCount: 1,
    },
    text(name),
    {
      type: VirtualDomElements.Div,
      className: 'ExtensionListItemDescription',
      childCount: 1,
    },
    text(description),
    {
      type: VirtualDomElements.Div,
      className: 'ExtensionListItemFooter',
      childCount: 2,
    },
    {
      type: VirtualDomElements.Div,
      className: 'ExtensionListItemAuthorName',
      childCount: 1,
    },
    text(publisher),
    {
      type: VirtualDomElements.Div,
      className: 'ExtensionActions',
      childCount: 0,
    },
  ]
  if (focused) {
    dom[0].id = 'ExtensionActive'
  }
  return dom
}

export const getExtensionsVirtualDom = (visibleExtensions) => {
  const dom = []
  dom.push({
    type: VirtualDomElements.Div,
    className: 'ListItems',
    tabIndex: 0,
    ariaLabel: 'Extensions',
    role: 'list',
    onwheelpassive: 'handleWheel',
    oncontextmenu: 'handleContextMenu',
    onpointerdown: 'handlePointerDown',
    ontouchstart: 'handleTouchStart',
    childCount: visibleExtensions.length,
  })
  for (const extension of visibleExtensions) {
    dom.push(...getExtensionVirtualDom(extension))
  }
  // if (scrollBarHeight > 0) {
  //   dom.push(
  //     div(
  //       {
  //         className: 'ScrollBarSmall',
  //         onpointerdown: 'handleScrollBarPointerDown',
  //       },
  //       1
  //     ),
  //     div(
  //       {
  //         className: 'ScrollBarThumb',
  //         translateY: scrollBarY,
  //         height: scrollBarHeight,
  //       },
  //       0
  //     )
  //   )
  // }
  return dom
}
