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
  $Widgets.className = 'Widgets'
  return $Widgets
}

export const append = ($Element) => {
  // TODO should not call append in the first place if it is already in dom
  if (state.widgetSet.has($Element)) {
    return
  }
  state.widgetSet.add($Element)
  if (state.$Widgets) {
    // @ts-expect-error
    state.$Widgets.append($Element)
  } else {
    // @ts-expect-error
    state.$Widgets = create$Widgets()
    // @ts-expect-error
    state.$Widgets.append($Element)
    // @ts-expect-error
    document.body.append(state.$Widgets)
  }
}

export const find = (id) => {
  for (const $Widget of state.widgetSet) {
    // @ts-expect-error
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
    // @ts-expect-error
    state.$Widgets.remove()
    state.$Widgets = undefined
  }
}
