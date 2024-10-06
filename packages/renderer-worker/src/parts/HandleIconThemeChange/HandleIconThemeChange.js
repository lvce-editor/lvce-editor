import * as Viewlet from '../Viewlet/Viewlet.js'
import * as ViewletStates from '../ViewletStates/ViewletStates.js'

export const handleIconThemeChange = async () => {
  const instances = ViewletStates.getAllInstances()
  // TODO have one recalculate style and one paint
  // @ts-ignore
  for (const [key, value] of Object.entries(instances)) {
    const { factory, state } = value
    if (factory.handleIconThemeChange) {
      const newState = factory.handleIconThemeChange(state)
      await Viewlet.setState(factory.name, newState)
    }
  }
}
