import { clipboard } from 'electron'

export const writeText = (text) => {
  clipboard.writeText(text)
}
