import * as Event from '../Event/Event.ts'

export const handleBeforeInstallPrompt = (event) => {
  Event.preventDefault(event)
}
