import { div, i, input, text } from '../VirtualDomHelpers/VirtualDomHelpers.js'
import * as VirtualDomDiffType from '../VirtualDomDiffType/VirtualDomDiffType.js'

/**
 * @enum {string}
 */
const ClassNames = {
  Label: 'Label',
  QuickPickItem: 'QuickPickItem',
  Icon: 'Icon',
  QuickPickItemDescription: 'QuickPickItemDescription',
  QuickPickStatus: 'QuickPickStatus',
  InputBox: 'InputBox',
}

/**
 * @enum {string}
 */
const Ids = {
  QuickPickHeader: 'QuickPickHeader',
  QuickPickItems: 'QuickPickItems',
  QuickPick: 'QuickPick',
  QuickPickItemActive: 'QuickPickItemActive',
  QuickPickInput: 'QuickPickInput',
}

/**
 * @enum {string}
 */
const Roles = {
  ListBox: 'listbox',
  ComboBox: 'combobox',
  Option: 'option',
}

/**
 * @enum {string}
 */
const UiStrings = {
  QuickInput: 'Quick Input',
  TypeTheNameOfACommandToRun: 'Type the name of a command to run.',
  QuickOpen: 'Quick open',
}

const renderQuickPickItem = (item) => {
  let childCount = 0
  const children = []
  if (item.icon) {
    childCount++
    children.push(
      i(
        {
          className: `Icon${item.icon}`,
        },
        0
      )
    )
  }
  if (item.label) {
    childCount++
    children.push(
      div(
        {
          className: ClassNames.Label,
        },
        1
      ),
      text(item.label)
    )
  }
  const props = {
    className: ClassNames.QuickPickItem,
    role: Roles.Option,
    ariaPosInSet: item.posInSet,
    ariaSetSize: item.setSize,
  }
  if (item.focused) {
    props.id = Ids.QuickPickItemActive
  }
  return [div(props, childCount), ...children]
}

const QuickPickItems = (items) => {
  return [
    div(
      {
        id: Ids.QuickPickItems,
        role: Roles.ListBox,
        ariaRoleDescription: UiStrings.QuickInput,
      },
      items.length
    ),
    ...items.flatMap(renderQuickPickItem),
  ]
}

const getVisible = (items, minLineY, maxLineY, focusedIndex) => {
  const visibleItems = []
  const setSize = items.length
  const max = Math.min(items.length, maxLineY)
  for (let i = minLineY; i < max; i++) {
    const item = items[i]
    visibleItems.push({
      label: item.label,
      icon: item.icon,
      posInSet: i + 1,
      setSize,
      focused: i === focusedIndex,
    })
  }
  return visibleItems
}

const renderQuickPickItemsDom = (state) => {
  const visibleItems = getVisible(
    state.items,
    state.minLineY,
    state.maxLineY,
    state.focusedIndex
  )
  const dom = QuickPickItems(visibleItems)
  return dom
}

const renderQuickPickDom = (state) => {
  return [
    div(
      {
        id: Ids.QuickPick,
        ariaLabel: UiStrings.QuickOpen,
      },
      2
    ),
    div(
      {
        id: Ids.QuickPickHeader,
      },
      1
    ),
    input(
      {
        className: ClassNames.InputBox,
        spellcheck: false,
        autocaptialize: 'off',
        type: 'text',
        autocorrect: 'off',
        ariaControls: 'QuickPickItems',
        role: 'combobox',
        ariaLabel: UiStrings.TypeTheNameOfACommandToRun,
        ariaAutocomplete: 'list',
        ariaExpanded: true,
        value: state.value,
      },
      0
    ),
    ...renderQuickPickItemsDom(state),
  ]
}

export const renderDom = (state) => {
  const dom = renderQuickPickItemsDom(state)
  return dom
}

export const hasFunctionalRender = true

const renderCursorOffset = {
  isEqual(oldState, newState) {
    oldState.cursorOffset === newState.cursorOffset ||
      newState.cursorOffset === newState.value.length
  },
  apply(oldState, newState) {
    const patches = [
      {
        id: Ids.QuickPickInput,
        operation: VirtualDomDiffType.SetCursorOffset,
        value: newState.cursorOffset,
      },
    ]
    return [
      /* Viewlet.send */ 'Viewlet.send',
      /* id */ 'QuickPick',
      /* method */ 'applyPatches',
      /* patches */ patches,
    ]
  },
}

const getPatchList = (oldState, newState) => {
  const oldVisibleItems = getVisible(
    oldState.items,
    oldState.minLineY,
    oldState.maxLineY,
    oldState.focusedIndex
  )
  const newVisibleItems = getVisible(
    newState.items,
    newState.minLineY,
    newState.maxLineY,
    newState.focusedIndex
  )
  const changes = []
  const commonLength = Math.min(oldVisibleItems.length, newVisibleItems.length)
  // if (oldVisibleItems.length !== newVisibleItems.length) {
  //   console.log('set height')
  //   changes.push({
  //     index: 0,
  //     operation: VirtualDomDiffType.AttributeSet,
  //     key: 'style',
  //     value: 'height: 100px',
  //   })
  // }
  if (oldVisibleItems.length > newVisibleItems.length) {
    changes.push({
      index: 0,
      operation: VirtualDomDiffType.ElementsRemove,
      keepCount: newVisibleItems.length,
    })
  } else if (newVisibleItems.length > oldVisibleItems.length) {
    const newDom = newVisibleItems
      .slice(commonLength)
      .flatMap(renderQuickPickItem)
    changes.push({
      index: 0,
      operation: VirtualDomDiffType.ElementsAdd,
      newDom,
    })
  }

  let nodeIndex = 0
  for (let elementIndex = 0; elementIndex < commonLength; elementIndex++) {
    nodeIndex++ // item div
    const oldElement = oldVisibleItems[elementIndex]
    const newElement = newVisibleItems[elementIndex]

    if (oldElement.icon !== newElement.icon) {
      if (oldElement.icon) {
        if (newElement.icon) {
          // change icon
          changes.push({
            index: nodeIndex,
            operation: VirtualDomDiffType.SetSrc,
            value: newElement.icon,
          })
        } else {
          // remove icon
          changes.push({
            index: nodeIndex,
            operation: VirtualDomDiffType.ElementRemove,
          })
        }
      } else {
        // add icon
        changes.push({
          index: nodeIndex,
          operation: VirtualDomDiffType.ElementAdd,
          newDom: [
            i(
              {
                className: ClassNames.Icon,
              },
              0
            ),
          ],
        })
      }
    }
    if (oldElement.icon) {
      nodeIndex++
    }
    if (oldElement.label !== newElement.label) {
      changes.push({
        index: nodeIndex,
        operation: VirtualDomDiffType.AttributeSet,
        key: 'text',
        value: newElement.label,
      })
      // change text
    }

    nodeIndex += 3 //  label div, text
  }

  return changes
}

const renderQuickPickItemsFn = {
  isEqual(oldState, newState) {
    return false
  },
  apply(oldState, newState) {
    const patchList = getPatchList(oldState, newState)
    console.log({ patchList, oldState, newState })
    return [
      /* Viewlet.send */ 'Viewlet.send',
      /* id */ 'QuickPick',
      /* method */ 'setDom',
      /* patchList */ patchList,
    ]
  },
}

const renderValue = {
  isEqual(oldState, newState) {
    return oldState.value === newState.value
  },
  apply(oldState, newState) {
    const patches = [
      {
        id: Ids.QuickPickInput,
        operation: VirtualDomDiffType.SetValue,
        value: newState.value,
      },
    ]
    return [
      /* Viewlet.send */ 'Viewlet.send',
      /* id */ 'QuickPick',
      /* method */ 'applyPatches',
      /* patches */ patches,
    ]
  },
}

const renderFocusedIndex = {
  isEqual(oldState, newState) {
    return oldState.focusedIndex === newState.focusedIndex
  },
  apply(oldState, newState) {
    const patches = []
    if (oldState.focusedIndex === -1) {
      patches.push({
        operation: VirtualDomDiffType.AttributeSet,
        key: 'ariaActivedecsendant',
        value: Ids.QuickPickItemActive,
        id: Ids.QuickPickInput,
      })
    } else {
      patches.push({
        operation: VirtualDomDiffType.RemoveIdNth,
        id: Ids.QuickPickItems,
        index: oldState.focusedIndex,
      })
    }
    if (newState.focusedIndex !== -1) {
      patches.push({
        operation: VirtualDomDiffType.SetElementIdNth,
        value: Ids.QuickPickItemActive,
        id: Ids.QuickPickItems,
        index: newState.focusedIndex,
      })
    }
    return [
      /* Viewlet.send */ 'Viewlet.send',
      /* id */ 'QuickPick',
      /* method */ 'applyPatches',
      /* patches */ patches,
    ]
  },
}

const renderHeight = {
  isEqual(oldState, newState) {
    return oldState.items.length === newState.items.length
  },
  apply(oldState, newState) {
    const maxLineY = Math.min(newState.maxLineY, newState.items.length)
    const itemCount = maxLineY - newState.minLineY
    const height = itemCount * newState.itemHeight
    const patch = {
      operation: VirtualDomDiffType.SetHeight,
      value: height,
      id: Ids.QuickPickItems,
    }
    return [
      /* Viewlet.send */ 'Viewlet.send',
      /* id */ 'QuickPick',
      /* method */ 'applyPatch',
      /* patch */ patch,
    ]
  },
}

export const render = [
  renderQuickPickItemsFn,
  renderValue,
  renderHeight,
  renderFocusedIndex,
  renderCursorOffset,
]
