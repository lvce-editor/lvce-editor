// @ts-ignore
import { getChildren } from './TreeProviderFile.js'

const treeViewNumber = {
  getRoot() {
    return 1
  },
  async getChildren(entry) {
    return [entry * 2, entry * 3, entry * 4, entry * 5]
  },
  toTreeItem(entry) {
    return {
      label: `${entry}`,
      collapsibleState: 'none',
    }
  },
}

const init = async () => {
  const root = treeViewNumber.getRoot()

  const rootItems = await getChildren(root)
}

init()
