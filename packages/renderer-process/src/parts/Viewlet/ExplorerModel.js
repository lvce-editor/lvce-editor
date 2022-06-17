const EMPTY_ARRAY = []

class TreeItem {
  constructor(type, name, parent, children) {
    this.type = type
    this.name = name
    this.parent = parent
    this.children = children
  }
}

export const create = () => {}

const visit = (node, fn) => {
  fn(node)
  for (const child of node.children) {
    fn(child)
  }
}

const treeModel = {}

const getChildren = (path) => {}

// tree
const root = new TreeItem(2, '', undefined, [])
const child1 = new TreeItem(2, 'packages', root)
const items = []

const expanded = new Set()

const isExpanded = (item) => {
  return expanded.has(item)
}

const render = ($Wrapper, root, path) => {
  const $Element = document.createElement('div')
  $Element.textContent
  $Wrapper.append($Element)
}

render(document.createElement('div'), root, '')
// List.render()

// list
