import * as ClassNames from '../ClassNames/ClassNames.js'
import * as HtmlInputType from '../HtmlInputType/HtmlInputType.js'
import * as VirtualDomElements from '../VirtualDomElements/VirtualDomElements.js'
import * as DomEventListenerFunctions from '../DomEventListenerFunctions/DomEventListenerFunctions.js'

export const getSimpleBrowserVirtualDom = (canGoBack, canGoForward, isLoading, value) => {
  return [
    {
      type: VirtualDomElements.Div,
      className: 'Viewlet SimpleBrowser',
      childCount: 1,
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
}
