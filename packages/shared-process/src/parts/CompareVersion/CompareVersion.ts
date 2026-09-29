export const isGreater = (version: string, otherVersion: string): boolean => {
  const versionParts = version.split('.').map(Number)
  const otherVersionParts = otherVersion.split('.').map(Number)
  const partCount = Math.max(versionParts.length, otherVersionParts.length)
  for (let index = 0; index < partCount; index++) {
    const versionPart = versionParts[index] || 0
    const otherVersionPart = otherVersionParts[index] || 0
    if (versionPart !== otherVersionPart) {
      return versionPart > otherVersionPart
    }
  }
  return false
}
