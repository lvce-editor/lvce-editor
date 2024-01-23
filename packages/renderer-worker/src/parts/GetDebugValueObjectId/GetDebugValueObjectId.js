export const getDebugValueObjectId = (child) => {
  return child.object?.objectId || child.value?.objectId || ''
}
