import { shell } from 'electron'

// TODO rename module to ElectronShell

export const beep = () => {
  shell.beep()
}
