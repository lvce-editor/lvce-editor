// TODO this file is not needed when all elements are position fixed
export const state = {
  isInDom: false,
  $PreviousFocusElement: undefined,
  widgetSet: new Set(),
  $Widgets: undefined,
}

const create$Widgets = () => {
  const $Widgets = document.createElement('div')
  $Widgets.id = 'Widgets'
  return $Widgets
}

export const append = ($Element) => {
  // TODO should not call append in the first place if it is already in dom
  if (state.widgetSet.has($Element)) {
    return
  }
  state.widgetSet.add($Element)
  if (state.$Widgets) {
    state.$Widgets.append($Element)
  } else {
    state.$Widgets = create$Widgets()
    state.$Widgets.append($Element)
    document.body.append(state.$Widgets)
  }
}

export const find = (id) => {
  for (const $Widget of state.widgetSet) {
    if ($Widget.dataset.id === id) {
      return $Widget
    }
  }
  return undefined
}

export const remove = ($Element) => {
  if (!$Element) {
    // TODO $Element should always be defined
    return
  }
  state.widgetSet.delete($Element)
  $Element.remove()
  // TODO state.$Widgets should always be defined at this point
  if (state.widgetSet.size === 0 && state.$Widgets) {
    state.$Widgets.remove()
    state.$Widgets = undefined
  }
}
