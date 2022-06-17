import * as Command from '../Command/Command.js'
import * as Navigation from './Navigation.js'

export const __initialize__ = () => {
  Command.register(5740, Navigation.focusPreviousPart)
  Command.register(5741, Navigation.focusNextPart)
  Command.register(5742, Navigation.focusActivityBar)
  Command.register(5743, Navigation.focusStatusBar)
  Command.register(5744, Navigation.focusPanel)
  Command.register(5745, Navigation.focusSideBar)
  Command.register(5746, Navigation.focusTitleBar)
  Command.register(5747, Navigation.focusMain)
}
