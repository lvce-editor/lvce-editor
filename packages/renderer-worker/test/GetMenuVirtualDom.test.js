import { expect, test } from '@jest/globals'
import * as ClassNames from '../src/parts/ClassNames/ClassNames.js'
import * as GetMenuVirtualDom from '../src/parts/GetMenuVirtualDom/GetMenuVirtualDom.js'
import * as MenuItemFlags from '../src/parts/MenuItemFlags/MenuItemFlags.js'
import * as VirtualDomElements from '../src/parts/VirtualDomElements/VirtualDomElements.js'

test('disabled menu item', () => {
  const dom = GetMenuVirtualDom.getMenuVirtualDom([
    {
      flags: MenuItemFlags.Disabled,
      isExpanded: false,
      isFocused: false,
      key: undefined,
      label: 'Save',
      level: 0,
    },
  ])

  expect(dom).toEqual([
    {
      type: VirtualDomElements.Div,
      className: ClassNames.Menu,
      role: 'menu',
      tabIndex: -1,
      childCount: 1,
    },
    {
      type: VirtualDomElements.Div,
      className: `${ClassNames.MenuItem} ${ClassNames.MenuItemDisabled}`,
      role: 'menuitem',
      ariaDisabled: true,
      tabIndex: -1,
      disabled: true,
      childCount: 1,
    },
    {
      type: VirtualDomElements.Text,
      text: 'Save',
      childCount: 0,
    },
  ])
})
