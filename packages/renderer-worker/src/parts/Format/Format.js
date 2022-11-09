import * as ExtensionHostFormatting from '../ExtensionHost/ExtensionHostFormatting.js'

// TODO format should be executed in parallel with saving
// -> fast save, no need to wait for formatting
// -> fast formatting, no need to wait for save

// TODO should format on save when closing/switching editor?

// TODO format with cursor
// TODO should be in editor folder

export const format = async (editor) => {
  const formatted = await ExtensionHostFormatting.executeFormattingProvider(
    editor
  )
  return formatted
}
