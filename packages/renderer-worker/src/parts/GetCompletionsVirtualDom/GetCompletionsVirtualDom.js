import { div } from '../VirtualDomHelpers/VirtualDomHelpers.js'

const createCompletion = (item) => {
  return []
}

export const getCompletionsVirtualDom = (items) => {
  return [
    div(
      {
        className: 'Viewlet EditorCompletion',
        id: 'Completions',
      },
      2
    ),
    div(
      {
        className: 'ListItems',
        role: 'listbox',
        ariaLabel: 'Suggest',
      },
      items.length
    ),
    ...items.flatMap(createCompletion),
    div(
      {
        className: 'ScrollBarSmall',
      },
      1
    ),
    div({
      className: 'ScrollBarThumb',
    }),
  ]
}
