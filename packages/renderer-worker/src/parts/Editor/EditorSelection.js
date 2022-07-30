import * as Assert from '../Assert/Assert.js'
import * as GlobalEventBus from '../GlobalEventBus/GlobalEventBus.js'
import * as EditorSelection from '../EditorSelection/EditorSelection.js'

const getSelectionFromChange = (change) => {
  if (change.inserted.length === 1) {
    const newPosition = {
      rowIndex: change.start.rowIndex + change.inserted.length - 1,
      columnIndex: change.inserted.at(-1).length + change.start.columnIndex,
    }
    return {
      start: newPosition,
      end: newPosition,
    }
  }
  const newPosition = {
    rowIndex: change.start.rowIndex + change.inserted.length - 1,
    columnIndex: change.inserted.at(-1).length,
  }
  return {
    start: newPosition,
    end: newPosition,
  }
}

export const setSelections = (editor, selections) => {
  Assert.object(editor)
  Assert.uint32array(selections)
  return {
    ...editor,
    selections,
  }
  // editor.selections = selections
  // GlobalEventBus.emitEvent('editor.selectionChange', editor, selections)
}

// TODO maybe only accept sorted selection edits in the first place

// TODO avoid allocating too many objects when creating new selection from changes
export const applyEdit = (editor, changes) => {
  Assert.object(editor)
  Assert.array(changes)
  const newSelections = EditorSelection.from(changes, getSelectionFromChange)
  // setSelections(editor, newSelections)
  return newSelections
}

// TODO visible selections could also be uint16array
// [top1, left1, width1, height1, top2, left2, width2, height2...]

export const getVisible = (editor) => {
  const visibleSelections = []
  // let i=0
  // // TODO binary search

  // // before
  // while(i < editor.selections.length){
  //   if(editor.selections[i].start.rowIndex < editor.minLineY){
  //     break
  //   }
  //   i++
  // }
  // // start
  // while(i < editor.selections.length){
  //   if(editor.selections[i].start.rowIndex < ){

  //   }
  // }
  // // middle

  // // end

  // // after
  for (const selection of editor.selections) {
    if (selection.end.rowIndex < editor.minLineY) {
      continue
    }
    if (selection.start.rowIndex > editor.maxLineY) {
      break
    }
    if (selection.start === selection.end) {
      continue
    }
    if (selection.start.rowIndex === selection.end.rowIndex) {
      visibleSelections.push({
        top: (selection.start.rowIndex - editor.minLineY) * editor.rowHeight,
        left: selection.start.columnIndex * editor.columnWidth,
        width:
          (selection.end.columnIndex - selection.start.columnIndex) *
          editor.columnWidth,
        height: editor.rowHeight,
      })
    } else {
      if (selection.start.rowIndex >= editor.minLineY) {
        visibleSelections.push({
          top: (selection.start.rowIndex - editor.minLineY) * editor.rowHeight,
          left: selection.start.columnIndex * editor.columnWidth,
          width:
            (editor.lines[selection.start.rowIndex].length -
              selection.start.columnIndex) *
            editor.columnWidth,
          height: editor.rowHeight,
        })
      }
      for (
        let i = Math.max(selection.start.rowIndex + 1, editor.minLineY);
        i < Math.min(selection.end.rowIndex, editor.maxLineY);
        i++
      ) {
        visibleSelections.push({
          top: (i - editor.minLineY) * editor.rowHeight,
          left: 0,
          width: editor.lines[i].length * editor.columnWidth,
          height: editor.rowHeight,
        })
      }
      if (selection.end.rowIndex <= editor.maxLineY) {
        visibleSelections.push({
          top: (selection.end.rowIndex - editor.minLineY) * editor.rowHeight,
          left: 0,
          width: selection.end.columnIndex * editor.columnWidth,
          height: editor.rowHeight,
        })
      }
    }
  }
  return visibleSelections
}
