import * as ClassNames from '../ClassNames/ClassNames.js'
import * as HtmlInputType from '../HtmlInputType/HtmlInputType.js'
import * as VirtualDomElements from '../VirtualDomElements/VirtualDomElements.js'

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
      onClick: 'handleClickBackward',
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
      onClick: 'handleClickForward',
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
      onClick: 'handleClickReload',
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
      onInput: 'handleInput',
      onFocus: 'handleFocus',
      onBlur: 'handleBlur',
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
      onClick: 'handleClickOpenExternal',
    },
  ]
}
