import { div, img, text } from '../VirtualDomHelpers/VirtualDomHelpers.js'

const getExtensionVirtualDom = (extension) => {
  const { posInSet, setSize, top, icon, name, description, publisher } = extension
  return [
    div(
      {
        role: 'listitem',
        ariaRoleDescription: 'Extension',
        className: 'ExtensionListItem',
        ariaPosInset: posInSet,
        ariaSetSize: setSize,
        top,
      },
      2
    ),
    img({
      src: icon,
      className: 'ExtensionListItemIcon',
    }),
    div(
      {
        className: 'ExtensionListItemDetail',
      },
      3
    ),
    div(
      {
        className: 'ExtensionListItemName',
      },
      1
    ),
    text(name),
    div(
      {
        className: 'ExtensionListItemDescription',
      },
      1
    ),
    text(description),
    div(
      {
        className: 'ExtensionListItemFooter',
      },
      2
    ),
    div(
      {
        className: 'ExtensionListItemAuthorName',
      },
      1
    ),
    text(publisher),
    div(
      {
        className: 'ExtensionActions',
      },
      0
    ),
  ]
}

export const getExtensionsVirtualDom = (visibleExtensions, height, top, scrollBarY, scrollBarHeight) => {
  const dom = []
  dom.push(
    div(
      {
        className: 'ListItems',
        tabIndex: 0,
        ariaLabel: 'Extensions',
        role: 'list',
        height,
        top,
        onwheelpassive: 'handleWheel',
        oncontextmenu: 'handleContextMenu',
        onpointerdown: 'handlePointerDown',
        ontouchstart: 'handleTouchStart',
      },
      visibleExtensions.length
    )
  )
  for (const extension of visibleExtensions) {
    dom.push(...getExtensionVirtualDom(extension))
  }
  if (scrollBarHeight > 0) {
    dom.push(
      div(
        {
          className: 'ScrollBarSmall',
          onpointerdown: 'handleScrollBarPointerDown',
        },
        1
      ),
      div(
        {
          className: 'ScrollBarThumb',
          translateY: scrollBarY,
          height: scrollBarHeight,
        },
        0
      )
    )
  }
  return dom
}
