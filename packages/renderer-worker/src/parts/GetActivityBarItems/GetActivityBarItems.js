import * as ActivityBarItemFlags from '../ActivityBarItemFlags/ActivityBarItemFlags.js'
import * as ViewletActivityBarStrings from '../ViewletActivityBar/ViewletActivityBarStrings.js'
import * as ViewletModuleId from '../ViewletModuleId/ViewletModuleId.js'

export const getActivityBarItems = () => {
  return [
    // Top
    {
      id: ViewletModuleId.Explorer,
      title: ViewletActivityBarStrings.explorer(),
      icon: 'Files',
      enabled: true,
      flags: ActivityBarItemFlags.Tab,
      keyShortcuts: 'Control+Shift+E',
    },
    {
      id: ViewletModuleId.Search,
      title: ViewletActivityBarStrings.search(),
      icon: 'Search',
      enabled: true,
      flags: ActivityBarItemFlags.Tab,
      keyShortcuts: 'Control+Shift+F',
    },
    {
      id: ViewletModuleId.SourceControl,
      title: ViewletActivityBarStrings.sourceControl(),
      icon: 'SourceControl',
      enabled: true,
      flags: ActivityBarItemFlags.Tab,
      keyShortcuts: 'Control+Shift+G',
    },
    {
      id: ViewletModuleId.RunAndDebug,
      title: ViewletActivityBarStrings.runAndDebug(),
      icon: 'DebugAlt2',
      enabled: true,
      flags: ActivityBarItemFlags.Tab,
      keyShortcuts: 'Control+Shift+D',
    },
    {
      id: ViewletModuleId.Extensions,
      title: ViewletActivityBarStrings.extensions(),
      icon: 'Extensions',
      enabled: true,
      flags: ActivityBarItemFlags.Tab,
      keyShortcuts: 'Control+Shift+X',
    },
    // Bottom
    {
      id: 'Settings',
      title: ViewletActivityBarStrings.settings(),
      icon: 'SettingsGear',
      enabled: true,
      flags: ActivityBarItemFlags.Button,
      keyShortcuts: '',
    },
  ]
}
