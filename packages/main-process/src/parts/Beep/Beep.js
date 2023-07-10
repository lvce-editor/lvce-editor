import { shell } from 'electron'

export const beep = () => {
  shell.beep()
}
