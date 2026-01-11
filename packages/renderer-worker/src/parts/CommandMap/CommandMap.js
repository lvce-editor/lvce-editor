import { execute, loadCommand } from '../Command/Command.js'

const lazy =
  (key) =>
  async (...args) => {
    await loadCommand(key)
    execute(key, ...args)
  }

export const commandMap = {
  'IconTheme.hydrate': lazy('IconTheme.hydrate'),
  'IconTheme.setIconTheme': lazy('IconTheme.setIconTheme'),
  'IconTheme.getFileIcon': lazy('IconTheme.getFileIcon'),
  'IconTheme.getFileIcons': lazy('IconTheme.getFileIcons'),
  'IconTheme.getFolderIcon': lazy('IconTheme.getFolderIcon'),
  'IconTheme.getIcon': lazy('IconTheme.getIcon'),
  'IconTheme.getIcons': lazy('IconTheme.getIcons'),
  'Transferrable.transferToRendererProcess': lazy('Transferrable.transferToRendererProcess'),
  'Transferrable.transfer': lazy('Transferrable.transfer'),
  'Transferrable.acquire': lazy('Transferrable.acquire'),
}
