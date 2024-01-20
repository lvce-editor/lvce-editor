import * as ClassNames from '../ClassNames/ClassNames.js'
import * as DebugState from '../DebugState/DebugState.js'
import * as ViewletRunAndDebugStrings from '../ViewletRunAndDebug/ViewletRunAndDebugStrings.js'
import * as VirtualDomElements from '../VirtualDomElements/VirtualDomElements.js'

const DebugButton = ClassNames.IconButton + ' ' + ClassNames.DebugButton

const buttonResume = {
  type: VirtualDomElements.Button,
  className: DebugButton,
  title: ViewletRunAndDebugStrings.resume(),
  childCount: 1,
}

const iconContinue = {
  type: VirtualDomElements.Div,
  className: `MaskIcon MaskIconDebugContinue DebugContinue`,
  childCount: 0,
}

const buttonPause = {
  type: VirtualDomElements.Button,
  className: DebugButton,
  title: ViewletRunAndDebugStrings.pause(),
  childCount: 1,
}

const iconPause = {
  type: VirtualDomElements.Div,
  className: 'MaskIcon MaskIconDebugPause DebugPause',
  childCount: 0,
}

const buttonStepOver = {
  type: VirtualDomElements.Button,
  className: DebugButton,
  title: ViewletRunAndDebugStrings.stepOver(),
  childCount: 1,
}

const iconStepOver = {
  type: VirtualDomElements.Div,
  className: 'MaskIcon MaskIconDebugStepOver DebugStepOver',
  childCount: 0,
}

const buttonStepInto = {
  type: VirtualDomElements.Button,
  className: DebugButton,
  title: ViewletRunAndDebugStrings.stepInto(),
  childCount: 1,
}

const iconStepInto = {
  type: VirtualDomElements.Div,
  className: 'MaskIcon MaskIconDebugStepInto DebugStepInto',
  childCount: 0,
}

const buttonStepOut = {
  type: VirtualDomElements.Button,
  className: DebugButton,
  title: ViewletRunAndDebugStrings.stepOut(),
  childCount: 1,
}

const iconStepOut = {
  type: VirtualDomElements.Div,
  className: 'MaskIcon MaskIconDebugStepOut DebugStepOut',
  childCount: 0,
}

const buttons = {
  type: VirtualDomElements.Div,
  className: ClassNames.DebugButtons,
  childCount: 4,
}

export const getRunAndDebugButtonsVirtualDom = (debugState) => {
  const elements = []
  elements.push(buttons)
  if (debugState === DebugState.Paused) {
    elements.push(buttonResume, iconContinue)
  } else {
    elements.push(buttonPause, iconPause)
  }
  elements.push(buttonStepOver, iconStepOver, buttonStepInto, iconStepInto, buttonStepOut, iconStepOut)
  return elements
}
