import * as AriaOrientationType from '../AriaOrientationType/AriaOrientationType.ts'
import * as AriaRoles from '../AriaRoles/AriaRoles.js'
import * as DomEventListenerFunctions from '../DomEventListenerFunctions/DomEventListenerFunctions.js'
import * as DomId from '../DomId/DomId.js'
import * as GetActivityBarItemsVirtualDom from '../GetActivityBarItemsVirtualDom/GetActivityBarItemsVirtualDom.js'
import * as ActivityBarStrings from '../ViewletActivityBar/ViewletActivityBarStrings.js'
import * as VirtualDomElements from '../VirtualDomElements/VirtualDomElements.js'
import * as ClassNames from '../ClassNames/ClassNames.js'
import * as MergeClassNames from '../MergeClassNames/MergeClassNames.js'

export const getActivityBarVirtualDom = (visibleItems) => {
  return [
    {
      type: VirtualDomElements.Div,
      id: DomId.ActivityBar,
      className: MergeClassNames.mergeClassNames(ClassNames.Viewlet, ClassNames.ActivityBar),
      role: AriaRoles.ToolBar,
      ariaRoleDescription: ActivityBarStrings.activityBar(),
      ariaOrientation: AriaOrientationType.Vertical,
      tabIndex: 0,
      onMouseDown: DomEventListenerFunctions.HandleMouseDown,
      onContextMenu: DomEventListenerFunctions.HandleContextMenu,
      onFocus: DomEventListenerFunctions.HandleFocus,
      onBlur: DomEventListenerFunctions.HandleBlur,
      childCount: visibleItems.length,
    },
    ...GetActivityBarItemsVirtualDom.getVirtualDom(visibleItems),
  ]
}
