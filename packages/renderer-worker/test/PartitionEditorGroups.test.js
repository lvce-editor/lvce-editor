import * as PartitionEditorGroups from '../src/parts/PartitionEditorGroups/PartitionEditorGroups.js'

test('partitionEditorGroups - new group added', () => {
  const oldGroups = []
  const newGroups = [
    {
      uid: 1,
    },
  ]
  expect(PartitionEditorGroups.partitionEditorGroups(oldGroups, newGroups)).toEqual({
    deletedGroups: [],
    insertedGroups: [
      {
        uid: 1,
      },
    ],
  })
})

test('partitionEditorGroups - group removed', () => {
  const oldGroups = [
    {
      uid: 1,
    },
  ]
  const newGroups = []
  expect(PartitionEditorGroups.partitionEditorGroups(oldGroups, newGroups)).toEqual({
    deletedGroups: [
      {
        uid: 1,
      },
    ],
    insertedGroups: [],
  })
})
