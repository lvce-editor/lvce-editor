import * as ClassNames from '../ClassNames/ClassNames.js'
import * as AriaRoles from '../AriaRoles/AriaRoles.js'
import * as HtmlInputType from '../HtmlInputType/HtmlInputType.js'
import * as VirtualDomElements from '../VirtualDomElements/VirtualDomElements.js'
import * as DomEventListenerFunctions from '../DomEventListenerFunctions/DomEventListenerFunctions.js'
import * as InputName from '../InputName/InputName.js'
import { text } from '../VirtualDomHelpers/VirtualDomHelpers.js'

export const getSimpleBrowserVirtualDom = (
  canGoBack,
  canGoForward,
  isLoading,
  value,
  snapshot = '',
  suggestions = [],
  selectedSuggestionIndex = -1,
  tabs = [],
  selectedTabIndex = 0,
  tabsEnabled = true,
) => {
  /** @type {any[]} */
  const dom = [
    {
      type: VirtualDomElements.Div,
      className: tabsEnabled ? 'Viewlet SimpleBrowser SimpleBrowserTabsEnabled' : 'Viewlet SimpleBrowser',
      childCount: 1 + (tabsEnabled ? 1 : 0) + (snapshot ? 1 : 0) + (suggestions.length > 0 ? 1 : 0),
    },
  ]
  if (tabsEnabled) {
    dom.push({
      type: VirtualDomElements.Div,
      className: 'SimpleBrowserTabs',
      role: AriaRoles.TabList,
      ariaLabel: 'Browser tabs',
      childCount: tabs.length + 1,
    })
    for (let index = 0; index < tabs.length; index++) {
      const tab = tabs[index]
      const isSelected = index === selectedTabIndex
      dom.push({
        type: VirtualDomElements.Div,
        className: isSelected ? 'SimpleBrowserTab SimpleBrowserTabSelected' : 'SimpleBrowserTab',
        role: AriaRoles.Tab,
        ariaSelected: isSelected,
        tabIndex: isSelected ? 0 : -1,
        'data-index': index,
        onClick: DomEventListenerFunctions.HandleClickSimpleBrowserTab,
        onContextMenu: DomEventListenerFunctions.HandleContextMenuSimpleBrowserTab,
        title: tab.title || 'New Tab',
        childCount: 2 + (tab.favicon ? 1 : 0) + (tab.isAudioPlaying ? 1 : 0),
      })
      if (tab.favicon) {
        dom.push({
          type: VirtualDomElements.Img,
          className: 'SimpleBrowserTabFavicon',
          crossOrigin: 'anonymous',
          src: tab.favicon,
          draggable: false,
          childCount: 0,
        })
      }
      dom.push(
        {
          type: VirtualDomElements.Span,
          className: 'SimpleBrowserTabTitle',
          childCount: 1,
        },
        text(tab.title || 'New Tab'),
      )
      if (tab.isAudioPlaying) {
        dom.push(
          {
            type: VirtualDomElements.Span,
            className: 'SimpleBrowserTabAudio',
            ariaLabel: 'This tab is playing audio',
            role: AriaRoles.Image,
            title: 'This tab is playing audio',
            childCount: 1,
          },
          {
            type: VirtualDomElements.Div,
            className: 'MaskIcon MaskIconUnmute',
            childCount: 0,
          },
        )
      }
      dom.push(
        {
          type: VirtualDomElements.Button,
          className: 'SimpleBrowserTabClose',
          ariaLabel: `Close ${tab.title || 'New Tab'}`,
          'data-index': index,
          onClick: DomEventListenerFunctions.HandleClickSimpleBrowserTabClose,
          title: 'Close Tab',
          childCount: 1,
        },
        {
          type: VirtualDomElements.Div,
          className: 'MaskIcon MaskIconClose',
          childCount: 0,
        },
      )
    }
    dom.push(
      {
        type: VirtualDomElements.Button,
        className: 'SimpleBrowserNewTab',
        ariaLabel: 'New Tab',
        onClick: DomEventListenerFunctions.HandleClickSimpleBrowserNewTab,
        title: 'New Tab',
        childCount: 1,
      },
      {
        type: VirtualDomElements.Div,
        className: 'MaskIcon MaskIconAdd',
        childCount: 0,
      },
    )
  }
  dom.push(
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
      name: InputName.SimpleBrowserAddress,
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
  )
  if (snapshot) {
    dom.push(
      {
        type: VirtualDomElements.Div,
        className: 'SimpleBrowserSnapshotWrapper',
        childCount: 1,
      },
      {
        type: VirtualDomElements.Img,
        className: suggestions.length > 0 ? 'SimpleBrowserSnapshot SimpleBrowserSnapshotSearchSuggestions' : 'SimpleBrowserSnapshot',
        src: snapshot,
        draggable: false,
        childCount: 0,
      },
    )
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
