const getUid = (object) => {
  return object.uid
}

const filterGroup = (ids, groups) => {
  const filtered = []
  for (const group of groups) {
    if (!ids.includes(group.uid)) {
      filtered.push(group)
    }
  }
  return filtered
}

export const partitionEditorGroups = (oldGroups, newGroups) => {
  const oldUids = oldGroups.map(getUid)
  const newUids = newGroups.map(getUid)
  const insertedGroups = filterGroup(oldUids, newGroups)
  const deletedGroups = filterGroup(newUids, oldGroups)
  return {
    insertedGroups,
    deletedGroups,
  }
}
