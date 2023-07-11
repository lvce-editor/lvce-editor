import * as VirtualDomElements from '../VirtualDomElements/VirtualDomElements.js'

const createCompletion = (item) => {
  return []
}

export const getCompletionsVirtualDom = (items) => {
  return [
    {
      type: VirtualDomElements.Div,
      className: 'Viewlet EditorCompletion',
      id: 'Completions',
      childCount: 2,
    },
    {
      type: VirtualDomElements.Div,
      className: 'ListItems',
      role: 'listbox',
      ariaLabel: 'Suggest',
      childCount: items.length,
    },
    ...items.flatMap(createCompletion),
    {
      type: VirtualDomElements.Div,
      className: 'ScrollBarSmall',
      childCount: 1,
    },
    {
      type: VirtualDomElements.Div,
      className: 'ScrollBarThumb',
      childCount: 0,
    },
  ]
}
