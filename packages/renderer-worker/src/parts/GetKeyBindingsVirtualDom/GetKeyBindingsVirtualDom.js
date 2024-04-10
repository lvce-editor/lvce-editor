import * as GetKeyBindingsTableVirtualDom from '../GetKeyBindingsTableVirtualDom/GetKeyBindingsTableVirtualDom.js'
import * as VirtualDomElements from '../VirtualDomElements/VirtualDomElements.js'

const UiStrings = {
  SearchKeyBindings: 'Search Key Bindings', // TODO placeholder string should come from renderer worker
  ResultsWillUpdateAsYouType: 'Results will update as you type',
}

export const getKeyBindingsVirtualDom = (filteredKeyBindings, displayKeyBindings, columnWidth1, columnWidth2, columnWidth3) => {
  return [
    {
      type: VirtualDomElements.Div,
      className: 'Viewlet KeyBindings',
      onPointerDown: 'handlePointerDown',
      onDblClick: 'handleTableDoubleClick',
      onInput: 'handleInput',
      onWheel: 'handleWheel',
      childCount: 3,
    },
    {
      type: VirtualDomElements.Div,
      className: 'KeyBindingsHeader',
      childCount: 1,
    },
    {
      type: VirtualDomElements.Input,
      className: 'InputBox',
      inputType: 'search',
      placeholder: UiStrings.SearchKeyBindings,
      childCount: 0,
    },
    {
      type: VirtualDomElements.Div,
      className: 'KeyBindingsTableWrapper',
      childCount: filteredKeyBindings.length + 2,
    },
    {
      type: VirtualDomElements.Div,
      className: 'Resizer',
      childCount: 0,
    },
    {
      type: VirtualDomElements.Div,
      className: 'Resizer',
      childCount: 0,
    },
    ...GetKeyBindingsTableVirtualDom.getTableDom(filteredKeyBindings, displayKeyBindings, columnWidth1, columnWidth2, columnWidth3),
    {
      type: VirtualDomElements.Div,
      className: 'ScrollBar',
      childCount: 1,
    },
    {
      type: VirtualDomElements.Div,
      className: 'ScrollBarThumb',
      childCount: 0,
    },
  ]
}
