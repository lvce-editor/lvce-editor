import * as Event from '../Event/Event.js'

export const handleBeforeInstallPrompt = (event) => {
  Event.preventDefault(event)
}
