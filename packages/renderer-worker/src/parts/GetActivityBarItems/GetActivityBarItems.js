import * as ActivityBarItemFlags from '../ActivityBarItemFlags/ActivityBarItemFlags.js'
import * as Icon from '../Icon/Icon.js'
import * as ViewletModuleId from '../ViewletModuleId/ViewletModuleId.js'
import * as ViewletActivityBarStrings from '../ViewletActivityBar/ViewletActivityBarStrings.js'

export const getActivityBarItems = () => {
  return [
    // Top
    {
      id: ViewletModuleId.Explorer,
      title: ViewletActivityBarStrings.explorer(),
      icon: Icon.Files,
      enabled: true,
      flags: ActivityBarItemFlags.Tab,
      keyShortcuts: 'Control+Shift+E',
    },
    {
      id: ViewletModuleId.Search,
      title: ViewletActivityBarStrings.search(),
      icon: Icon.Search,
      enabled: true,
      flags: ActivityBarItemFlags.Tab,
      keyShortcuts: 'Control+Shift+F',
    },
    {
      id: ViewletModuleId.SourceControl,
      title: ViewletActivityBarStrings.sourceControl(),
      icon: Icon.SourceControl,
      enabled: true,
      flags: ActivityBarItemFlags.Tab,
      keyShortcuts: 'Control+Shift+G',
    },
    {
      id: ViewletModuleId.RunAndDebug,
      title: ViewletActivityBarStrings.runAndDebug(),
      icon: Icon.DebugAlt2,
      enabled: true,
      flags: ActivityBarItemFlags.Tab,
      keyShortcuts: 'Control+Shift+D',
    },
    {
      id: ViewletModuleId.Extensions,
      title: ViewletActivityBarStrings.extensions(),
      icon: Icon.Extensions,
      enabled: true,
      flags: ActivityBarItemFlags.Tab,
      keyShortcuts: 'Control+Shift+X',
    },
    // Bottom
    {
      id: 'Settings',
      title: ViewletActivityBarStrings.settings(),
      icon: Icon.SettingsGear,
      enabled: true,
      flags: ActivityBarItemFlags.Button,
      keyShortcuts: '',
    },
  ]
}
