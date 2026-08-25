import * as ClassNames from '../ClassNames/ClassNames.js'
import * as AriaRoles from '../AriaRoles/AriaRoles.js'
import * as HtmlInputType from '../HtmlInputType/HtmlInputType.js'
import * as VirtualDomElements from '../VirtualDomElements/VirtualDomElements.js'
import * as DomEventListenerFunctions from '../DomEventListenerFunctions/DomEventListenerFunctions.js'
import { text } from '../VirtualDomHelpers/VirtualDomHelpers.js'

export const getSimpleBrowserVirtualDom = (
  canGoBack,
  canGoForward,
  isLoading,
  value,
  snapshot = '',
  suggestions = [],
  selectedSuggestionIndex = -1,
) => {
  /** @type {any[]} */
  const dom = [
    {
      type: VirtualDomElements.Div,
      className: 'Viewlet SimpleBrowser',
      childCount: 1 + (snapshot ? 1 : 0) + (suggestions.length > 0 ? 1 : 0),
    },
    {
      type: VirtualDomElements.Div,
      className: ClassNames.SimpleBrowserHeader,
      childCount: 5,
    },
    {
      type: VirtualDomElements.Button,
      className: ClassNames.IconButton,
      childCount: 1,
      title: 'Back',
      onClick: DomEventListenerFunctions.HandleClickBackward,
    },
    {
      type: VirtualDomElements.Div,
      className: 'MaskIcon MaskIconArrowLeft',
      childCount: 0,
    },
    {
      type: VirtualDomElements.Button,
      className: ClassNames.IconButton,
      childCount: 1,
      title: 'Forward',
      onClick: DomEventListenerFunctions.HandleClickForward,
    },
    {
      type: VirtualDomElements.Div,
      className: 'MaskIcon MaskIconArrowRight',
      childCount: 0,
    },
    {
      type: VirtualDomElements.Button,
      className: ClassNames.IconButton,
      childCount: 1,
      title: 'Reload',
      onClick: DomEventListenerFunctions.HandleClickReload,
    },
    {
      type: VirtualDomElements.Div,
      className: isLoading ? 'MaskIcon MaskIconClose' : 'MaskIcon MaskIconRefresh',
      childCount: 0,
    },
    {
      type: VirtualDomElements.Input,
      className: ClassNames.InputBox,
      inputType: HtmlInputType.Url,
      enterKeyHint: 'Go',
      onInput: DomEventListenerFunctions.HandleInput,
      onFocus: DomEventListenerFunctions.HandleFocus,
      onBlur: DomEventListenerFunctions.HandleBlur,
      value,
    },
    {
      type: VirtualDomElements.Button,
      className: ClassNames.IconButton,
      title: 'Open External',
      childCount: 1,
    },
    {
      type: VirtualDomElements.Div,
      className: 'MaskIcon MaskIconLinkExternal',
      childCount: 0,
      onClick: DomEventListenerFunctions.HandleClickOpenExternal,
    },
  ]
  if (snapshot) {
    dom.push({
      type: VirtualDomElements.Img,
      className: suggestions.length > 0 ? 'SimpleBrowserSnapshot SimpleBrowserSnapshotSearchSuggestions' : 'SimpleBrowserSnapshot',
      src: snapshot,
      draggable: false,
      childCount: 0,
    })
  }
  if (suggestions.length > 0) {
    dom.push({
      type: VirtualDomElements.Div,
      className: 'SimpleBrowserSuggestions',
      role: AriaRoles.ListBox,
      ariaLabel: 'Search suggestions',
      childCount: suggestions.length,
    })
    for (let index = 0; index < suggestions.length; index++) {
      const suggestion = suggestions[index]
      const selected = index === selectedSuggestionIndex
      dom.push(
        {
          type: VirtualDomElements.Button,
          className: selected ? 'SimpleBrowserSuggestion SimpleBrowserSuggestionSelected' : 'SimpleBrowserSuggestion',
          role: AriaRoles.Option,
          ariaSelected: selected,
          'data-value': suggestion,
          onClick: DomEventListenerFunctions.HandleClickSuggestion,
          childCount: 2,
        },
        {
          type: VirtualDomElements.Div,
          className: 'MaskIcon MaskIconSearch SimpleBrowserSuggestionIcon',
          childCount: 0,
        },
        text(suggestion),
      )
    }
  }
  return dom
}
