import * as Command from '../Command/Command.js'
import * as Navigation from './Navigation.js'

export const __initialize__ = () => {
  Command.register('Navigation.focusPreviousPart', Navigation.focusPreviousPart)
  Command.register('Navigation.focusNextPart', Navigation.focusNextPart)
  Command.register('Navigation.focusActivityBar', Navigation.focusActivityBar)
  Command.register('Navigation.focusStatusBar', Navigation.focusStatusBar)
  Command.register('Navigation.focusPanel', Navigation.focusPanel)
  Command.register('Navigation.focusSideBar', Navigation.focusSideBar)
  Command.register('Navigation.focusTitleBar', Navigation.focusTitleBar)
  Command.register('Navigation.focusMain', Navigation.focusMain)
}
