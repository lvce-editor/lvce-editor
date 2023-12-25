import { VError } from '@lvce-editor/verror'

export const loadTypeScript = async (typescriptPath) => {
  try {
    const typescript = await import(typescriptPath)
    return typescript
  } catch (error) {
    throw new VError(error, `Failed to load typescript`)
  }
}
