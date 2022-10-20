import { findIndex } from '../../shared/findIndex.js'
import * as Context from '../Context/Context.js'
import * as MouseEventType from '../MouseEventType/MouseEventType.js'
import * as Renderer from '../Renderer/Renderer.js'
import * as RendererTree from '../Renderer/RendererTree.js'

// class Dirent {
//   constructor(name, type) {
//     this.name = name
//     this.type = type
//   }
// }

// class File extends Dirent {
//   constructor(name) {
//     super(name, 1)
//   }
// }

// class Directory extends Dirent {
//   constructor(name) {
//     super(name, 2)
//     this.children = []
//   }

//   addChild(child) {
//     this.children.push(child)
//   }

//   removeChild(child) {
//     const index = this.children.indexOf(child)
//     this.children.splice(index, 1)
//   }

//   getChild(index) {
//     return this.children[index]
//   }
// }

// const root = {
//   type: 'directory',
//   name: '',
//   children: [],
// }

// root.children.push({
//   type: 'file',
//   name: 'abc.txt',
//   children: [],
// })

// root.addChild(new Directory('b.txt'))

const getAbsolutePath = (dirent) => {
  if (!dirent) {
    return ''
  }
  return getAbsolutePath(dirent.parent) + '/' + dirent.name
}

let activeTreeView

const toTreeItem = (level) => (dirent) => ({
  name: dirent.name,
  level,
  type: dirent.type,
  children: [],
  expanded: false,
})

export const create = (props) => {
  let $Focused

  const state = {
    root: props.root,
    items: [],
    activeIndex: -1,
    state: 'default', // default | loading | disposed
  }

  const internal = {
    focusNext() {},
    focusPrevious() {},
    focusNextPage() {},
    focusPreviousPage() {},
    focusFirst() {},
    focusLast() {},
    focusNth() {},
  }

  // const focus = (element) => {
  // if (activeElement) {
  //   activeElement.removeAttribute('data-focused')
  // }
  // activeElement = element
  // activeElement.dataset.focused = 'true'
  // }

  const focus = ($Element) => {
    if ($Focused === $Element) {
      return
    }
    if ($Focused) {
      $Focused.classList.remove('Focused')
    }
    $Focused = $Element
    $Element.classList.add('Focused')
  }

  const handleMouseDown = async (event) => {
    if (event.button !== MouseEventType.LeftClick) {
      return
    }
    const $Target = event.target
    const index = findIndex($Viewlet, $Target)
    if (index === -1) {
      return
    }
    focus($Viewlet.children[index])
    const dirent = state.items[index]
    switch (dirent.type) {
      case 'file':
        props.handleClick(dirent)
        break
      case 'directory':
        // dirent.expanded = !dirent.expanded
        if (dirent.expanded) {
          let endIndex = index
          while (++endIndex < state.items.length) {
            if (state.items[endIndex].level === dirent.level) {
              break
            }
          }
          state.items.splice(index + 1, endIndex - index)
          // TODO only update from index of dirent
          Renderer.render($Viewlet, RendererTree, state.items)
        } else {
          state.state = 'loading'
          // TODO cancel this if tree is disposed
          const newChildren = await props.getChildren(
            `${state.root}/${dirent.name}`
          )

          const treeItems = newChildren.map(toTreeItem(dirent.level + 1))
          state.items.splice(index + 1, 0, ...treeItems)

          // TODO only update from index of dirent
          Renderer.render($Viewlet, RendererTree, state.items)

          // $Viewlet.insertBefore(fragment, $Viewlet.children[index + 1])
          // if (state.state === 'disposed') {
          //   return
          // }
          // state.items = newChildren.map(toTreeItem(1))
          // state.state = 'default'
        }
        dirent.expanded = !dirent.expanded
        // @ts-ignore
        $Viewlet.children[index].ariaExpanded = dirent.expanded

        break
      default:
        break
    }
    // focus(event.target)
  }

  const handleKeyDown = (event) => {
    // if (!activeElement) {
    //   return
    // }
    // switch (event.key) {
    //   case 'ArrowUp':
    //     if (activeElement.previousSibling) {
    //       focus(activeElement.previousSibling)
    //     }
    //     break
    //   case 'ArrowDown':
    //     if (activeElement.nextSibling) {
    //       focus(activeElement.nextSibling)
    //     }
    //     break
    //   case ' ':
    //   case 'Enter':
    //     handleClick(activeElement)
    //   default:
    //     break
    // }
  }

  const handleContextMenu = (event) => {
    event.preventDefault()
    const $Target = event.target
    const index = findIndex($Viewlet, $Target)
    if (index === -1) {
      return
    }
    props.handleContextMenu(state.items[index], event.clientX, event.clientY)
  }

  const handleFocus = () => {
    Context.setFocus('tree')
  }

  const $Viewlet = document.createElement('div')
  $Viewlet.className = 'ListItems Viewlet'
  $Viewlet.tabIndex = 0
  // @ts-ignore
  $Viewlet.role = 'tree'
  $Viewlet.ariaLabel = 'Files Explorer'
  $Viewlet.addEventListener('keydown', handleKeyDown)
  $Viewlet.addEventListener('mousedown', handleMouseDown)
  $Viewlet.addEventListener('contextmenu', handleContextMenu)
  $Viewlet.addEventListener('focus', handleFocus)

  const update = async () => {
    state.state = 'loading'
    // TODO cancel this if tree is disposed
    const newChildren = await props.getChildren(state.root)
    if (state.state === 'disposed') {
      return
    }
    state.items = newChildren.map(toTreeItem(1))
    state.state = 'default'
  }

  const render = () => {
    // TODO many objects created here, might cause garbage collection
    // const items = state.dirents.map((dirent) => ({
    //   name: dirent.name,
    //   level: 1,
    // }))
    Renderer.render($Viewlet, RendererTree, state.items)
    return $Viewlet
  }

  const dispose = () => {
    state.state = 'disposed'
  }

  return {
    update,
    render,
    dispose,
    get root() {
      return ''
    },
    set root(value) {
      state.root = value
      update().then(render)
    },
  }
}

// TODO separate commands from ui implementation

const treeViewFocusDown = () => {
  if (!activeTreeView) {
    return
  }
  activeTreeView.focusNext()
}

const treeViewFocusUp = () => {
  if (!activeTreeView) {
    return
  }
  // TODO operate on state, don't call functions (doesn't scale)
  activeTreeView.focusPrevious()
}

const treeViewFocusPageUp = () => {}

const treeViewFocusPageDown = () => {}

const treeViewCollapse = () => {
  if (!activeTreeView) {
    return
  }
  activeTreeView.collapse()
}

const treeViewCollapseAll = () => {
  if (!activeTreeView) {
    return
  }
  activeTreeView.collapseAll()
}

export const COmmands = {
  3000: treeViewFocusDown,
  3001: treeViewFocusUp,
  3002: treeViewCollapse,
  3003: treeViewCollapseAll,
}
