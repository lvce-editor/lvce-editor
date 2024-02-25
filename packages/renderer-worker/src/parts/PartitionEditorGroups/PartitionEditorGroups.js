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

const getUpdatedGroups = (oldGroups, newGroups, oldIds, newIds) => {
  const updated = []
  for (const oldGroup of oldGroups) {
    if (!newIds.includes(oldGroup.uid)) {
      continue
    }
    for (const newGroup of newGroups) {
      if (newGroup.uid === oldGroup.uid && oldGroup !== newGroup) {
        updated.push({
          oldGroup,
          newGroup,
        })
      }
    }
  }
  return updated
}

export const partitionEditorGroups = (oldGroups, newGroups) => {
  const oldUids = oldGroups.map(getUid)
  const newUids = newGroups.map(getUid)
  const insertedGroups = filterGroup(oldUids, newGroups)
  const deletedGroups = filterGroup(newUids, oldGroups)
  const updatedGroups = getUpdatedGroups(oldGroups, newGroups, oldUids, newUids)
  return {
    insertedGroups,
    deletedGroups,
    updatedGroups,
  }
}
