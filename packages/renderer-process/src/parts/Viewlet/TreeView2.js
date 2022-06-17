// export const create = (props) => {
//   const expanded = new Set()
//   const resolved = new Set()

//   let setSize = 0

//   const isExpanded = (item) => expanded.has(item)
//   const isResolved = (item) => resolved.has(item)

//   const root = {
//     type: 'directory',
//     name: '',
//     children: [],
//   }

//   const render=()=> {
//     for(const child of root.children){

//     }
//   }

//   return {
//     size() {
//       return setSize
//     },
//     render() {
//       for(const child of root.children){

//       }
//     },
//   }
// }

// const treeView = create()

// only tree model, sends commands to ui
const createTree = (props) => {
  const state = {
    root: 'abcdef',
    items: [],
  }

  const expanded = new Set()
  const childCountMap = new Map()

  const isExpanded = (item) => expanded.has(item)

  const getIndex = (item) => {
    return 0
  }

  const toggle = async (item) => {
    if (isExpanded(item)) {
      const childCount = childCountMap.get(item)
      const index = getIndex(item)
      state.items.splice(index, childCount)
    } else {
      const children = await props.getChildren(item)
      const index = getIndex(item)
      childCountMap.set(item, children.length)
      state.items.splice(index, 0, ...children)
    }
  }

  const handleClick = (item) => {
    switch (item.type) {
      case 'file':
        props.handleClick(item)
        break
      case 'directory':
        toggle(item)
        break
      default:
        break
    }
  }
}

// only ui
const createTreeUi = () => {
  const items = []

  return {
    updateItem(index, item) {
      items[index] = item
    },
    splice(start, end, ...items) {
      items.splice(start, end, ...items)
    },
    render() {},
  }
}

// list model tree

const createTreeList = () => {
  const isExpanded = (node) => {
    return false
  }
  const rootItems = []

  const visit = (node, fn) => {
    switch (node.type) {
      case 'file':
        fn(node)
        break
      case 'directory':
        fn(node)
        parentPath += node.name
        if (isExpanded(node)) {
          for (const child of node.children) {
            visit(child, fn)
          }
        }
        parentPath = parentPath.slice(0, -node.name)
        break
      default:
        break
    }
  }

  let parentPath = ''

  return {
    toList() {
      const listItems = []

      const fn = (node) => {}
      for (const rootItem of rootItems) {
        visit(rootItem, fn)
      }
      const segments = []
      // yield 1
      // yield 2
      // yield 3
    },
  }
}

const sendRendererProcess = (...args) => {}

const expand = () => {
  const index = 90
  const items = [
    {
      type: 'directory',
      name: 'abc',
      absolutePath: '/tmp/abc',
      level: 1,
    },
    {
      type: 'file',
      name: 'file',
      absolutePath: '/tmp/abc/file',
      level: 2,
    },
    {
      type: 'file',
      name: 'def',
      absolutePath: '/tmp/def',
      level: 1,
    },
  ]
  sendRendererProcess([
    /* addNodes */ 89981,
    /* index */ index,
    /* items */ items,
  ])
}

const collapse = () => {
  const index = 90
  const itemsToRemove = 2
  sendRendererProcess([
    /* removeNodes */ 89982,
    /* index */ index,
    /* itemsToRemove */ itemsToRemove,
  ])
}

const rename = () => {
  const index = 80
  const newName = 'hij'
  sendRendererProcess([
    /* rename */ 89983,
    /* index */ index,
    /* newName */ newName,
  ])
}
