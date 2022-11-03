/**
 * @enum {number}
 */
const State = {
  TopLevelContent: 1,
  Escaped: 2,
  Csi: 3,
  AfterEscape3: 4,
  Charset: 5,
  AfterEscape3AfterSemicolon: 6,
  // CsiAfterQuestionMark1: 7,
  // CsiAfterQuestionMark2: 10,
  Osc: 8,
  Dcs: 9,
  AfterQuestionMark: 10,
  AfterQuestionMark2: 11,
  AfterExclamationMark: 12,
  AfterExclamationMark2: 13,
  AfterSpace: 14,
  AfterSpace2: 15,
  Osc2: 16,
  Osc3: 17,
}

const decode = (buffer, startIndex, endIndex) => {
  return new TextDecoder().decode(buffer.subarray(startIndex, endIndex))
}

export const getText = (buffer) => {
  let state = State.TopLevelContent
  let printStartIndex = 0
  let i = 0
  const bufferLength = buffer.length
  let text = ''
  while (i < bufferLength) {
    const value = buffer[i]
    console.log({ state, value })
    switch (state) {
      case State.TopLevelContent:
        switch (value) {
          case 27:
            i++
            state = State.Escaped
            break
          case 32:
          case 33:
          case 34:
          case 35:
          case 36:
          case 37:
          case 38:
          case 39:
          case 40:
          case 41:
          case 42:
          case 43:
          case 44:
          case 45:
          case 46:
          case 47:
          case 48:
          case 49:
          case 50:
          case 51:
          case 52:
          case 53:
          case 54:
          case 55:
          case 56:
          case 57:
          case 58:
          case 59:
          case 60:
          case 61:
          case 62:
          case 63:
          case 64:
          case 65:
          case 66:
          case 67:
          case 68:
          case 69:
          case 70:
          case 71:
          case 72:
          case 73:
          case 74:
          case 75:
          case 76:
          case 77:
          case 78:
          case 79:
          case 80:
          case 81:
          case 82:
          case 83:
          case 84:
          case 85:
          case 86:
          case 87:
          case 88:
          case 89:
          case 90:
          case 91:
          case 92:
          case 93:
          case 94:
          case 95:
          case 96:
          case 97:
          case 98:
          case 99:
          case 100:
          case 101:
          case 102:
          case 103:
          case 104:
          case 105:
          case 106:
          case 107:
          case 108:
          case 109:
          case 110:
          case 111:
          case 112:
          case 113:
          case 114:
          case 115:
          case 116:
          case 117:
          case 118:
          case 119:
          case 120:
          case 121:
          case 122:
          case 123:
          case 124:
          case 125:
          case 126:
          case 127:
            printStartIndex = i++
            middle: while (i < bufferLength) {
              const value = buffer[i]
              if (value >= 32 && value < 126) {
                i++
                continue
              }
              switch (value) {
                case /* \u001b */ 27:
                  // print(array, printStartIndex, i);
                  state = State.Escaped
                  i++
                  break middle
                case /* \u0007 */ 7:
                  // print(array, printStartIndex, i);
                  // bell();
                  i++
                  state = State.TopLevelContent
                  break middle
                case /* \u0008 */ 8:
                  // print(array, printStartIndex, i);
                  // backspace();
                  i++
                  state = State.TopLevelContent
                  break middle
                case /* \r */ 13:
                  // print(array, printStartIndex, i);
                  // carriageReturn();
                  i++
                  state = State.TopLevelContent
                  break middle
                default:
                  i++
                  break
              }
            }
            const bufferText = decode(buffer, printStartIndex, i)
            text += bufferText
            break
          default:
            i++
            break
        }
        break
      case State.Escaped:
        switch (value) {
          case /* ( */ 40:
            state = State.TopLevelContent
            break
          case /* [ */ 91:
            // params = [];
            state = State.Csi
            break
          case /* ] */ 93:
            state = State.Osc
            break
          case /* P */ 80:
            state = State.Dcs
            break
          case /* _ */ 95:
            break
          case /* ^ */ 94:
            break
          case /* c */ 99:
            break
          case /* E */ 69:
          // nextLine();
          case /* D */ 68:
            // index();
            break
          case /* 7 */ 55:
            // saveCursor();
            state = State.TopLevelContent
            break
          case /* 8 */ 56:
            // backspace();
            state = State.TopLevelContent
            break
          case /* H */ 72:
            // tabSet();
            break
          default:
            state = State.TopLevelContent
            break
        }
        i++
        break
      case State.Csi:
        switch (value) {
          case /*   */ 32:
            state = State.AfterSpace
            break
          case /* ! */ 33:
            state = State.AfterExclamationMark
            break
          case /* 0 */ 48:
          case /* 1 */ 49:
          case /* 2 */ 50:
          case /* 3 */ 51:
          case /* 4 */ 52:
          case /* 5 */ 53:
          case /* 6 */ 54:
          case /* 7 */ 55:
          case /* 8 */ 56:
          case /* 9 */ 57:
            // currentParam = array[i] - 48;
            state = State.AfterEscape3
            break
          case /* ? */ 63:
            state = State.AfterQuestionMark
            break
          case /* @ */ 64:
            // insertBlankCharacters(params);
            state = State.TopLevelContent
            break
          case /* A */ 65:
            // cursorUp(params);
            state = State.TopLevelContent
            break
          case /* B */ 66:
            // cursorDown(params);
            state = State.TopLevelContent
            break
          case /* C */ 67:
            // cursorRight(params);
            state = State.TopLevelContent
            break
          case /* D */ 68:
            // cursorLeft(params);
            state = State.TopLevelContent
            break
          case /* E */ 69:
            // cursorNextLine(params);
            state = State.TopLevelContent
            break
          case /* F */ 70:
            // cursorPrecedingLine(params);
            state = State.TopLevelContent
            break
          case /* G */ 71:
            // cursorCharacterAbsolute(params);
            state = State.TopLevelContent
            break
          case /* H */ 72:
            // cursorPosition(params);
            state = State.TopLevelContent
            break
          case /* I */ 73:
            // cursorForwardTabulation(params);
            state = State.TopLevelContent
            break
          case /* J */ 74:
            // eraseInDisplay(params);
            state = State.TopLevelContent
            break
          case /* K */ 75:
            // eraseInLine(params);
            state = State.TopLevelContent
            break
          case /* L */ 76:
            // insertLines(params);
            state = State.TopLevelContent
            break
          case /* M */ 77:
            // deleteLines(params);
            state = State.TopLevelContent
            break
          case /* P */ 80:
            // deleteCharacters(params);
            state = State.TopLevelContent
            break
          case /* S */ 83:
            // scrollUp(params);
            state = State.TopLevelContent
            break
          case /* T */ 84:
            // scrollDown(params);
            state = State.TopLevelContent
            break
          case /* X */ 88:
            // eraseCharacters(params);
            state = State.TopLevelContent
            break
          case /* Z */ 90:
            // cursorBackwardTabulation(params);
            state = State.TopLevelContent
            break
          case /* ^ */ 94:
            // scrollDown(params);
            state = State.TopLevelContent
            break
          case /* ` */ 96:
            // characterPositionAbsolute(params);
            state = State.TopLevelContent
            break
          case /* a */ 97:
            // characterPositionRelative(params);
            state = State.TopLevelContent
            break
          case /* b */ 98:
            // repeatPrecedingGraphicCharacter(params);
            state = State.TopLevelContent
            break
          case /* d */ 100:
            // linePositionAbsolute(params);
            state = State.TopLevelContent
            break
          case /* e */ 101:
            // linePositionRelative(params);
            state = State.TopLevelContent
            break
          case /* f */ 102:
            // horizontalAndVerticalPosition(params);
            state = State.TopLevelContent
            break
          case /* g */ 103:
            // tabClear(params);
            state = State.TopLevelContent
            break
          case /* h */ 104:
            // setMode(params);
            state = State.TopLevelContent
            break
          case /* l */ 108:
            // resetMode(params);
            state = State.TopLevelContent
            break
          case /* m */ 109:
            // setCharAttributes(params);
            state = State.TopLevelContent
            break
          case /* u */ 117:
            // restoreCursor();
            state = State.TopLevelContent
            break
        }
        i++
        break
      case State.AfterEscape3:
        switch (value) {
          case /*   */ 32:
            // params.push(currentParam);
            state = State.AfterSpace
            break
          case /* ; */ 59:
            // params.push(currentParam);
            state = State.AfterEscape3AfterSemicolon
            break
          case /* 0 */ 48:
          case /* 1 */ 49:
          case /* 2 */ 50:
          case /* 3 */ 51:
          case /* 4 */ 52:
          case /* 5 */ 53:
          case /* 6 */ 54:
          case /* 7 */ 55:
          case /* 8 */ 56:
          case /* 9 */ 57:
            // currentParam = currentParam * 10 + value - 48;
            break
          case /* @ */ 64:
            // params.push(currentParam);
            // insertBlankCharacters(params);
            state = State.TopLevelContent
            break
          case /* A */ 65:
            // params.push(currentParam);
            // cursorUp(params);
            state = State.TopLevelContent
            break
          case /* B */ 66:
            // params.push(currentParam);
            // cursorDown(params);
            state = State.TopLevelContent
            break
          case /* C */ 67:
            // params.push(currentParam);
            // cursorRight(params);
            state = State.TopLevelContent
            break
          case /* D */ 68:
            // params.push(currentParam);
            // cursorLeft(params);
            state = State.TopLevelContent
            break
          case /* E */ 69:
            // params.push(currentParam);
            // cursorNextLine(params);
            state = State.TopLevelContent
            break
          case /* F */ 70:
            // params.push(currentParam);
            // cursorPrecedingLine(params);
            state = State.TopLevelContent
            break
          case /* G */ 71:
            // params.push(currentParam);
            // cursorCharacterAbsolute(params);
            state = State.TopLevelContent
            break
          case /* H */ 72:
            // params.push(currentParam);
            // cursorPosition(params);
            state = State.TopLevelContent
            break
          case /* I */ 73:
            // params.push(currentParam);
            // cursorForwardTabulation(params);
            state = State.TopLevelContent
            break
          case /* J */ 74:
            // params.push(currentParam);
            // eraseInDisplay(params);
            state = State.TopLevelContent
            break
          case /* K */ 75:
            // params.push(currentParam);
            // eraseInLine(params);
            state = State.TopLevelContent
            break
          case /* L */ 76:
            // params.push(currentParam);
            // insertLines(params);
            state = State.TopLevelContent
            break
          case /* M */ 77:
            // params.push(currentParam);
            // deleteLines(params);
            state = State.TopLevelContent
            break
          case /* P */ 80:
            // params.push(currentParam);
            // deleteCharacters(params);
            state = State.TopLevelContent
            break
          case /* S */ 83:
            // params.push(currentParam);
            // scrollUp(params);
            state = State.TopLevelContent
            break
          case /* T */ 84:
            // params.push(currentParam);
            // scrollDown(params);
            state = State.TopLevelContent
            break
          case /* X */ 88:
            // params.push(currentParam);
            // eraseCharacters(params);
            state = State.TopLevelContent
            break
          case /* Z */ 90:
            // params.push(currentParam);
            // cursorBackwardTabulation(params);
            state = State.TopLevelContent
            break
          case /* ^ */ 94:
            // params.push(currentParam);
            // scrollDown(params);
            state = State.TopLevelContent
            break
          case /* ` */ 96:
            // params.push(currentParam);
            // characterPositionAbsolute(params);
            state = State.TopLevelContent
            break
          case /* a */ 97:
            // params.push(currentParam);
            // characterPositionRelative(params);
            state = State.TopLevelContent
            break
          case /* b */ 98:
            // params.push(currentParam);
            // repeatPrecedingGraphicCharacter(params);
            state = State.TopLevelContent
            break
          case /* d */ 100:
            // params.push(currentParam);
            // linePositionAbsolute(params);
            state = State.TopLevelContent
            break
          case /* e */ 101:
            // params.push(currentParam);
            // linePositionRelative(params);
            state = State.TopLevelContent
            break
          case /* f */ 102:
            // params.push(currentParam);
            // horizontalAndVerticalPosition(params);
            state = State.TopLevelContent
            break
          case /* g */ 103:
            // params.push(currentParam);
            // tabClear(params);
            state = State.TopLevelContent
            break
          case /* h */ 104:
            // params.push(currentParam);
            // setMode(params);
            state = State.TopLevelContent
            break
          case /* l */ 108:
            // params.push(currentParam);
            // resetMode(params);
            state = State.TopLevelContent
            break
          case /* m */ 109:
            // params.push(currentParam);
            // setCharAttributes(params);
            state = State.TopLevelContent
            break
          default:
            state = State.TopLevelContent
            break
        }
        i++
        break
      case State.AfterEscape3AfterSemicolon:
        switch (value) {
          case /* 0 */ 48:
          case /* 1 */ 49:
          case /* 2 */ 50:
          case /* 3 */ 51:
          case /* 4 */ 52:
          case /* 5 */ 53:
          case /* 6 */ 54:
          case /* 7 */ 55:
          case /* 8 */ 56:
          case /* 9 */ 57:
            // currentParam = value - 48;
            state = State.AfterEscape3
            break
          default:
            break
        }
        i++
        break
      case State.AfterQuestionMark:
        switch (value) {
          case /* 0 */ 48:
          case /* 1 */ 49:
          case /* 2 */ 50:
          case /* 3 */ 51:
          case /* 4 */ 52:
          case /* 5 */ 53:
          case /* 6 */ 54:
          case /* 7 */ 55:
          case /* 8 */ 56:
          case /* 9 */ 57:
            // currentParam = value - 48;
            state = State.AfterQuestionMark2
            break
          case /* J */ 74:
            // eraseInDisplay(params);
            state = State.TopLevelContent
            break
          case /* K */ 75:
            // eraseInLine(params);
            state = State.TopLevelContent
            break
          case /* h */ 104:
            // privateModeSet(params);
            state = State.TopLevelContent
            break
          case /* l */ 108:
            // privateModeReset(params);
            state = State.TopLevelContent
            break
          default:
            break
        }
        i++
        break
      case State.AfterQuestionMark2:
        switch (value) {
          case /* 0 */ 48:
          case /* 1 */ 49:
          case /* 2 */ 50:
          case /* 3 */ 51:
          case /* 4 */ 52:
          case /* 5 */ 53:
          case /* 6 */ 54:
          case /* 7 */ 55:
          case /* 8 */ 56:
          case /* 9 */ 57:
            // currentParam = currentParam * 10 + value - 48;
            break
          case /* ; */ 59:
            // params.push(currentParam);
            state = State.AfterQuestionMark
            break
          case /* J */ 74:
            // params.push(currentParam);
            // eraseInDisplay(params);
            state = State.TopLevelContent
            break
          case /* K */ 75:
            // params.push(currentParam);
            // eraseInLine(params);
            state = State.TopLevelContent
            break
          case /* h */ 104:
            // params.push(currentParam);
            // privateModeSet(params);
            state = State.TopLevelContent
            break
          case /* l */ 108:
            // params.push(currentParam);
            // privateModeReset(params);
            state = State.TopLevelContent
            break
          default:
            break
        }
        i++
        break
      case State.AfterExclamationMark:
        switch (value) {
          case /* p */ 112:
            // softTerminalReset();
            state = State.TopLevelContent
            break
          default:
            break
        }
        i++
        break
      case State.AfterSpace:
        switch (value) {
          case /* @ */ 64:
            // shiftLeftColumns(params);
            state = State.TopLevelContent
            break
          case /* q */ 113:
            // setCursorStyle(params);
            state = State.TopLevelContent
            break
          case /* t */ 116:
            state = State.TopLevelContent
            break
        }
        i++
        break
      case State.Osc:
        switch (value) {
          case /* 0 */ 48:
          case /* 1 */ 49:
          case /* 2 */ 50:
          case /* 3 */ 51:
          case /* 4 */ 52:
          case /* 5 */ 53:
          case /* 6 */ 54:
          case /* 7 */ 55:
          case /* 8 */ 56:
          case /* 9 */ 57:
            // currentParam = value - 48;
            state = State.Osc2
            break
          case /* \u0007 */ 7:
            // setTextParameters(params);
            state = State.TopLevelContent
            break
          default:
            break
        }
        i++
        break
      case State.Osc2:
        switch (value) {
          case /* 0 */ 48:
          case /* 1 */ 49:
          case /* 2 */ 50:
          case /* 3 */ 51:
          case /* 4 */ 52:
          case /* 5 */ 53:
          case /* 6 */ 54:
          case /* 7 */ 55:
          case /* 8 */ 56:
          case /* 9 */ 57:
            // currentParam = currentParam * 10 + value - 48;
            break
          case /* ; */ 59:
            // params.push(currentParam);
            state = State.Osc3
            break
        }
        i++
        break
      case State.Osc3:
        switch (value) {
          case /* \u0007 */ 7:
            // setTextParameters(params);
            state = State.TopLevelContent
            break
          default:
            // params.push(value);
            break
        }
        i++
        break
      default:
        throw new Error('unexpected parser state')
    }
  }
  return text
}
