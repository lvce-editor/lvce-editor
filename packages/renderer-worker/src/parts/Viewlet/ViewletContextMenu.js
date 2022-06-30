import * as Assert from '../Assert/Assert.js'
import * as Layout from '../Layout/Layout.js'
import * as MenuEntries from '../MenuEntries/MenuEntries.js'
import * as RendererProcess from '../RendererProcess/RendererProcess.js'

export const create = (x, y, id) => {
  Assert.number(x)
  Assert.number(y)
  Assert.string(id)
  return {
    x,
    y,
    id,
    items: [],
  }
}

export const loadContent = async (state) => {
  const items = await MenuEntries.getMenuEntries(state.id)
  return {
    ...state,
    items,
  }
}

const CONTEXT_MENU_ITEM_HEIGHT = 28
const CONTEXT_MENU_SEPARATOR_HEIGHT = 16
const CONTEXT_MENU_PADDING = 20
const CONTEXT_MENU_WIDTH = 250

const getContextMenuHeight = (items) => {
  let height = CONTEXT_MENU_PADDING
  for (const item of items) {
    switch (item.flags) {
      case /* ContextMenuItemSeparator */ 1:
        height += CONTEXT_MENU_SEPARATOR_HEIGHT
        break
      default:
        height += CONTEXT_MENU_ITEM_HEIGHT
        break
    }
  }
  return height
}

export const contentLoaded = async (state) => {
  const windowWidth = Layout.state.windowWidth
  const windowHeight = Layout.state.windowHeight
  const contextMenuWidth = CONTEXT_MENU_WIDTH
  const contextMenuHeight = getContextMenuHeight(state.items)
  let x = state.x
  let y = state.y
  // TODO maybe only send labels and keybindings to ui (id not needed on ui)
  // TODO what about separators?
  if (x + contextMenuWidth > windowWidth) {
    x -= contextMenuWidth
  }
  if (y + contextMenuHeight > windowHeight) {
    y -= contextMenuHeight
  }
  await RendererProcess.invoke(
    /* Viewlet.load */ 'Viewlet.load',
    /* id */ 'ContextMenu',
    /* top */ y,
    /* left */ x,
    /* width */ contextMenuWidth,
    /* height */ contextMenuHeight,
    /* items */ state.items
  )
}
