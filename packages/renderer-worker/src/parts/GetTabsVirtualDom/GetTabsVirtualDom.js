import { button, div, text } from '../VirtualDomHelpers/VirtualDomHelpers.js'

/**
 * @enum {string}
 */
const ClassNames = {
  MainTab: 'MainTab',
  FileIcon: 'FileIcon',
  TabLabel: 'TabLabel',
}

const getTabDom = (tab, isActive) => {
  const tabClassName = isActive ? 'MainTab MainTabSelected' : ClassNames.MainTab
  const fileIconClassName = `FileIcon FileIcon${tab.icon}`
  return [
    div(
      {
        className: tabClassName,
        role: 'tab',
        draggable: true,
        width: tab.tabWidth,
        ariaSelected: isActive,
      },
      3
    ),
    div(
      {
        className: fileIconClassName,
      },
      0
    ),
    div(
      {
        className: ClassNames.TabLabel,
      },
      1
    ),
    text(tab.label),
    button(
      {
        className: 'EditorTabCloseButton',
        title: 'Close',
      },
      0
    ),
  ]
}

export const getTabsDom = (tabs, activeIndex) => {
  const tabsDom = []
  console.log({ activeIndex })
  for (let i = 0; i < tabs.length; i++) {
    const isActive = i === activeIndex
    const tab = tabs[i]
    tabsDom.push(...getTabDom(tab, isActive))
  }
  return tabsDom
}
