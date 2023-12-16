const BACKGROUND = "#c00ccc";
const CHAR_WIDTH = 12;
const CHAR_HEIGHT = 15;
const createDrawCursor = (canvas) => {
  const ctx = canvas.getContext("2d");
  let previousX = -1;
  let previousY = -1;
  let previousCursorStyle = -1;
  const drawCursor = (x, y, cursorVisible, cursorStyle) => {
    if (cursorVisible) {
      if (previousX === x && previousY === y && previousCursorStyle === cursorStyle) {
        return;
      }
      ctx.clearRect(previousX * CHAR_WIDTH, previousY * CHAR_HEIGHT, CHAR_WIDTH, CHAR_HEIGHT);
      switch (cursorStyle) {
        case 1:
          break;
        case 2:
          ctx.fillStyle = BACKGROUND;
          ctx.fillRect(x * CHAR_WIDTH, y * CHAR_HEIGHT, CHAR_WIDTH, CHAR_HEIGHT);
          break;
        case 3:
          break;
        case 4:
          ctx.strokeStyle = BACKGROUND;
          ctx.strokeRect(x * CHAR_WIDTH, y * CHAR_HEIGHT, CHAR_WIDTH, CHAR_HEIGHT);
          break;
      }
      previousX = x;
      previousY = y;
    } else {
      ctx.clearRect(previousX * CHAR_WIDTH, previousY * CHAR_HEIGHT, CHAR_WIDTH, CHAR_HEIGHT);
    }
  };
  return drawCursor;
};
const CHAR_WIDTH$1 = 12;
const CHAR_HEIGHT$1 = 15;
const supportsOffscreenCanvas = true;
const supportsTransferToImageBitMap = (() => {
  try {
    supportsOffscreenCanvas ? (() => {
      const canvas = new OffscreenCanvas(CHAR_WIDTH$1, CHAR_HEIGHT$1);
      canvas.getContext("2d");
      canvas.transferToImageBitmap();
    })() : (() => {
      const canvas = document.createElement("canvas");
      canvas.width = CHAR_WIDTH$1;
      canvas.height = CHAR_HEIGHT$1;
      canvas.transferToImageBitmap();
    })();
    return true;
  } catch {
    return false;
  }
})();
const tmpCanvas = new OffscreenCanvas(CHAR_WIDTH$1, CHAR_HEIGHT$1);
const tmpCtx = tmpCanvas.getContext("2d", {
  alpha: false
});
const bitmapCache = Object.create(null);
const createDrawLines = (canvas, lines, bufferLines, offsets, attributes, rows, cols, defaultBackground, defaultForeground) => {
  const ctx = canvas.getContext("2d", {
    alpha: false
  });
  ctx.fillStyle = defaultBackground;
  const drawChar = (char, x, y, background, foreground) => {
    if (char === " " && background === defaultBackground) {
      return;
    }
    const cacheKey = `${char}${background}${foreground}`;
    if (!(cacheKey in bitmapCache)) {
      tmpCtx.fillStyle = background;
      tmpCtx.fillRect(0, 0, CHAR_WIDTH$1, CHAR_HEIGHT$1);
      tmpCtx.font = `${CHAR_HEIGHT$1}px monospace`;
      tmpCtx.fillStyle = foreground;
      tmpCtx.fillText(char, 0, CHAR_HEIGHT$1);
      bitmapCache[cacheKey] = supportsTransferToImageBitMap ? tmpCanvas.transferToImageBitmap() : tmpCtx.getImageData(0, 0, CHAR_WIDTH$1, CHAR_HEIGHT$1);
    }
    supportsTransferToImageBitMap ? ctx.drawImage(bitmapCache[cacheKey], x * CHAR_WIDTH$1, y * CHAR_HEIGHT$1) : ctx.putImageData(bitmapCache[cacheKey], x * CHAR_WIDTH$1, y * CHAR_HEIGHT$1);
  };
  const getChars = (y) => {
    const text = new TextDecoder().decode(lines[y].subarray(0, offsets[y]));
    const chars = [...text];
    return chars;
  };
  const drawLine = (bufferY, positionY) => {
    let x = -1;
    const chars = getChars(bufferY);
    const attributesOnLine = attributes[bufferY] || {};
    let currentAttributes = {
      foreground: defaultForeground,
      background: defaultBackground
    };
    while (++x < chars.length) {
      currentAttributes = attributesOnLine[x] || currentAttributes;
      const char = chars[x];
      const background = currentAttributes.background || defaultBackground;
      const foreground = currentAttributes.foreground || defaultForeground;
      drawChar(char, x, positionY, background, foreground);
    }
  };
  const clearLines = (x, y, width, height) => {
    ctx.fillRect(x * CHAR_WIDTH$1, y * CHAR_HEIGHT$1, width * CHAR_WIDTH$1, height * CHAR_HEIGHT$1);
  };
  const drawLines = (start, end, bufferYEnd) => {
    clearLines(0, start, cols, end - start);
    if (bufferYEnd < rows) {
      for (let i = 0; i < rows - bufferYEnd; i++) {
        drawLine(bufferLines - i - 1, rows - i);
      }
      for (let i = 0; i < bufferYEnd + 1; i++) {
        drawLine(i, rows - (bufferYEnd - i));
      }
    } else {
      for (let i = 0; i < rows; i++) {
        drawLine(bufferYEnd - i, rows - i);
      }
    }
  };
  return drawLines;
};
const TopLevelContent = 1;
const Escaped = 2;
const Csi = 3;
const AfterEscape3 = 4;
const Charset = 5;
const AfterEscape3AfterSemicolon = 6;
const Osc = 8;
const Dcs = 9;
const AfterQuestionMark = 10;
const AfterQuestionMark2 = 11;
const AfterExclamationMark = 12;
const AfterSpace = 14;
const Osc2 = 16;
const Osc3 = 17;
const parseArray = (array, {
  eraseInDisplay,
  eraseToEndOfLine,
  goToHome,
  setCharAttributes,
  bell,
  cursorUp,
  cursorDown,
  cursorRight,
  cursorLeft,
  backspace,
  print,
  setGLevel,
  saveCursor,
  restoreCursor,
  index,
  tabSet,
  reverseIndex,
  keypadApplicationMode,
  keypadNumericMode,
  fullReset,
  nextLine,
  carriageReturn,
  deleteCharacters,
  setWindowTitle,
  cursorPosition,
  softTerminalReset,
  cursorNextLine,
  cursorPrecedingLine,
  cursorCharacterAbsolute,
  cursorForwardTabulation,
  cursorBackwardTabulation,
  insertLines,
  deleteLines,
  scrollUp,
  scrollDown,
  eraseCharacters,
  characterPositionAbsolute,
  characterPositionRelative,
  repeatPrecedingGraphicCharacter,
  sendDeviceAttributesPrimary,
  sendDeviceAttributesTertiary,
  linePositionAbsolute,
  eraseInLine,
  linePositionRelative,
  horizontalAndVerticalPosition,
  tabClear,
  setMode,
  resetMode,
  lineFeed,
  privateModeSet,
  privateModeReset,
  setCursorStyle,
  shiftLeftColumns,
  insertBlankCharacters,
  setTextParameters
}) => {
  if (!(array instanceof Uint8Array)) {
    throw new Error("invalid data, must be of type Uint8Array");
  }
  let state = TopLevelContent;
  let i = 0;
  let currentParam = 0;
  let params = [];
  let printStartIndex = -1;
  while (i < array.length) {
    const value = array[i];
    switch (state) {
      case TopLevelContent:
        middle:
          switch (value) {
            case 1:
            case 2:
            case 3:
            case 4:
            case 5:
            case 6:
              i++;
              break;
            case 7:
              bell();
              i++;
              break;
            case 8:
              backspace();
              i++;
              break;
            case 9:
              i++;
              break;
            case 10:
              lineFeed();
              i++;
              break;
            case 11:
            case 12:
              i++;
              break;
            case 13:
              carriageReturn();
              i++;
              break;
            case 14:
            case 15:
            case 16:
            case 17:
            case 18:
            case 19:
            case 20:
            case 21:
            case 22:
            case 23:
            case 24:
            case 25:
            case 26:
              i++;
              break;
            case 27:
              state = Escaped;
              i++;
              break;
            case 28:
            case 29:
            case 30:
            case 31:
              i++;
              break;
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
              printStartIndex = i++;
              while (i < array.length) {
                const element = array[i];
                if (element >= 32 && element < 126) {
                  i++;
                  continue;
                }
                switch (element) {
                  case 27:
                    print(array, printStartIndex, i);
                    state = Escaped;
                    i++;
                    break middle;
                  case 7:
                    print(array, printStartIndex, i);
                    bell();
                    i++;
                    state = TopLevelContent;
                    break middle;
                  case 8:
                    print(array, printStartIndex, i);
                    backspace();
                    i++;
                    state = TopLevelContent;
                    break middle;
                  case 13:
                    print(array, printStartIndex, i);
                    carriageReturn();
                    i++;
                    state = TopLevelContent;
                    break middle;
                  default:
                    i++;
                    break;
                }
              }
              print(array, printStartIndex, i);
              break;
            default:
              throw new Error("no");
          }
        break;
      case Escaped:
        switch (value) {
          case 40:
            state = Charset;
            break;
          case 91:
            params = [];
            state = Csi;
            break;
          case 93:
            state = Osc;
            break;
          case 80:
            state = Dcs;
            break;
          case 95:
            break;
          case 94:
            break;
          case 99:
            break;
          case 69:
            nextLine();
          case 68:
            index();
            break;
          case 55:
            saveCursor();
            state = TopLevelContent;
            break;
          case 56:
            backspace();
            state = TopLevelContent;
            break;
          case 72:
            tabSet();
            break;
          default:
            state = TopLevelContent;
            break;
        }
        i++;
        break;
      case Charset:
        i++;
        break;
      case Csi:
        switch (value) {
          case 32:
            state = AfterSpace;
            break;
          case 33:
            state = AfterExclamationMark;
            break;
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
            currentParam = value - 48;
            state = AfterEscape3;
            break;
          case 63:
            state = AfterQuestionMark;
            break;
          case 64:
            insertBlankCharacters(params);
            state = TopLevelContent;
            break;
          case 65:
            cursorUp(params);
            state = TopLevelContent;
            break;
          case 66:
            cursorDown(params);
            state = TopLevelContent;
            break;
          case 67:
            cursorRight(params);
            state = TopLevelContent;
            break;
          case 68:
            cursorLeft(params);
            state = TopLevelContent;
            break;
          case 69:
            cursorNextLine(params);
            state = TopLevelContent;
            break;
          case 70:
            cursorPrecedingLine(params);
            state = TopLevelContent;
            break;
          case 71:
            cursorCharacterAbsolute(params);
            state = TopLevelContent;
            break;
          case 72:
            cursorPosition(params);
            state = TopLevelContent;
            break;
          case 73:
            cursorForwardTabulation(params);
            state = TopLevelContent;
            break;
          case 74:
            eraseInDisplay(params);
            state = TopLevelContent;
            break;
          case 75:
            eraseInLine(params);
            state = TopLevelContent;
            break;
          case 76:
            insertLines(params);
            state = TopLevelContent;
            break;
          case 77:
            deleteLines(params);
            state = TopLevelContent;
            break;
          case 80:
            deleteCharacters(params);
            state = TopLevelContent;
            break;
          case 83:
            scrollUp(params);
            state = TopLevelContent;
            break;
          case 84:
            scrollDown(params);
            state = TopLevelContent;
            break;
          case 88:
            eraseCharacters(params);
            state = TopLevelContent;
            break;
          case 90:
            cursorBackwardTabulation(params);
            state = TopLevelContent;
            break;
          case 94:
            scrollDown(params);
            state = TopLevelContent;
            break;
          case 96:
            characterPositionAbsolute(params);
            state = TopLevelContent;
            break;
          case 97:
            characterPositionRelative(params);
            state = TopLevelContent;
            break;
          case 98:
            repeatPrecedingGraphicCharacter(params);
            state = TopLevelContent;
            break;
          case 100:
            linePositionAbsolute(params);
            state = TopLevelContent;
            break;
          case 101:
            linePositionRelative(params);
            state = TopLevelContent;
            break;
          case 102:
            horizontalAndVerticalPosition(params);
            state = TopLevelContent;
            break;
          case 103:
            tabClear(params);
            state = TopLevelContent;
            break;
          case 104:
            setMode(params);
            state = TopLevelContent;
            break;
          case 108:
            resetMode(params);
            state = TopLevelContent;
            break;
          case 109:
            setCharAttributes(params);
            state = TopLevelContent;
            break;
          case 117:
            restoreCursor();
            state = TopLevelContent;
            break;
        }
        i++;
        break;
      case AfterEscape3:
        switch (value) {
          case 32:
            params.push(currentParam);
            state = AfterSpace;
            break;
          case 59:
            params.push(currentParam);
            state = AfterEscape3AfterSemicolon;
            break;
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
            currentParam = currentParam * 10 + value - 48;
            break;
          case 64:
            params.push(currentParam);
            insertBlankCharacters(params);
            state = TopLevelContent;
            break;
          case 65:
            params.push(currentParam);
            cursorUp(params);
            state = TopLevelContent;
            break;
          case 66:
            params.push(currentParam);
            cursorDown(params);
            state = TopLevelContent;
            break;
          case 67:
            params.push(currentParam);
            cursorRight(params);
            state = TopLevelContent;
            break;
          case 68:
            params.push(currentParam);
            cursorLeft(params);
            state = TopLevelContent;
            break;
          case 69:
            params.push(currentParam);
            cursorNextLine(params);
            state = TopLevelContent;
            break;
          case 70:
            params.push(currentParam);
            cursorPrecedingLine(params);
            state = TopLevelContent;
            break;
          case 71:
            params.push(currentParam);
            cursorCharacterAbsolute(params);
            state = TopLevelContent;
            break;
          case 72:
            params.push(currentParam);
            cursorPosition(params);
            state = TopLevelContent;
            break;
          case 73:
            params.push(currentParam);
            cursorForwardTabulation(params);
            state = TopLevelContent;
            break;
          case 74:
            params.push(currentParam);
            eraseInDisplay(params);
            state = TopLevelContent;
            break;
          case 75:
            params.push(currentParam);
            eraseInLine(params);
            state = TopLevelContent;
            break;
          case 76:
            params.push(currentParam);
            insertLines(params);
            state = TopLevelContent;
            break;
          case 77:
            params.push(currentParam);
            deleteLines(params);
            state = TopLevelContent;
            break;
          case 80:
            params.push(currentParam);
            deleteCharacters(params);
            state = TopLevelContent;
            break;
          case 83:
            params.push(currentParam);
            scrollUp(params);
            state = TopLevelContent;
            break;
          case 84:
            params.push(currentParam);
            scrollDown(params);
            state = TopLevelContent;
            break;
          case 88:
            params.push(currentParam);
            eraseCharacters(params);
            state = TopLevelContent;
            break;
          case 90:
            params.push(currentParam);
            cursorBackwardTabulation(params);
            state = TopLevelContent;
            break;
          case 94:
            params.push(currentParam);
            scrollDown(params);
            state = TopLevelContent;
            break;
          case 96:
            params.push(currentParam);
            characterPositionAbsolute(params);
            state = TopLevelContent;
            break;
          case 97:
            params.push(currentParam);
            characterPositionRelative(params);
            state = TopLevelContent;
            break;
          case 98:
            params.push(currentParam);
            repeatPrecedingGraphicCharacter(params);
            state = TopLevelContent;
            break;
          case 100:
            params.push(currentParam);
            linePositionAbsolute(params);
            state = TopLevelContent;
            break;
          case 101:
            params.push(currentParam);
            linePositionRelative(params);
            state = TopLevelContent;
            break;
          case 102:
            params.push(currentParam);
            horizontalAndVerticalPosition(params);
            state = TopLevelContent;
            break;
          case 103:
            params.push(currentParam);
            tabClear(params);
            state = TopLevelContent;
            break;
          case 104:
            params.push(currentParam);
            setMode(params);
            state = TopLevelContent;
            break;
          case 108:
            params.push(currentParam);
            resetMode(params);
            state = TopLevelContent;
            break;
          case 109:
            params.push(currentParam);
            setCharAttributes(params);
            state = TopLevelContent;
            break;
          default:
            state = TopLevelContent;
            break;
        }
        i++;
        break;
      case AfterEscape3AfterSemicolon:
        switch (value) {
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
            currentParam = value - 48;
            state = AfterEscape3;
            break;
        }
        i++;
        break;
      case AfterQuestionMark:
        switch (value) {
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
            currentParam = value - 48;
            state = AfterQuestionMark2;
            break;
          case 74:
            eraseInDisplay(params);
            state = TopLevelContent;
            break;
          case 75:
            eraseInLine(params);
            state = TopLevelContent;
            break;
          case 104:
            privateModeSet(params);
            state = TopLevelContent;
            break;
          case 108:
            privateModeReset(params);
            state = TopLevelContent;
            break;
        }
        i++;
        break;
      case AfterQuestionMark2:
        switch (value) {
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
            currentParam = currentParam * 10 + value - 48;
            break;
          case 59:
            params.push(currentParam);
            state = AfterQuestionMark;
            break;
          case 74:
            params.push(currentParam);
            eraseInDisplay(params);
            state = TopLevelContent;
            break;
          case 75:
            params.push(currentParam);
            eraseInLine(params);
            state = TopLevelContent;
            break;
          case 104:
            params.push(currentParam);
            privateModeSet(params);
            state = TopLevelContent;
            break;
          case 108:
            params.push(currentParam);
            privateModeReset(params);
            state = TopLevelContent;
            break;
        }
        i++;
        break;
      case AfterExclamationMark:
        switch (value) {
          case 112:
            softTerminalReset();
            state = TopLevelContent;
            break;
        }
        i++;
        break;
      case AfterSpace:
        switch (value) {
          case 64:
            shiftLeftColumns(params);
            state = TopLevelContent;
            break;
          case 113:
            setCursorStyle(params);
            state = TopLevelContent;
            break;
          case 116:
            state = TopLevelContent;
            break;
        }
        i++;
        break;
      case Osc:
        switch (value) {
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
            currentParam = value - 48;
            state = Osc2;
            break;
          case 7:
            setTextParameters(params);
            state = TopLevelContent;
            break;
        }
        i++;
        break;
      case Osc2:
        switch (value) {
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
            currentParam = currentParam * 10 + value - 48;
            break;
          case 59:
            params.push(currentParam);
            state = Osc3;
            break;
        }
        i++;
        break;
      case Osc3:
        switch (value) {
          case 7:
            setTextParameters(params);
            state = TopLevelContent;
            break;
          default:
            params.push(value);
        }
        i++;
    }
  }
};
const transformKey = (event) => {
  const modifiers = (event.shiftKey ? 1 : 0) | (event.altKey ? 2 : 0) | (event.ctrlKey ? 4 : 0) | (event.metaKey ? 8 : 0);
  switch (event.key) {
    case "A":
    case "B":
    case "C":
    case "D":
    case "E":
    case "F":
    case "G":
    case "H":
    case "I":
    case "J":
    case "K":
    case "L":
    case "M":
    case "N":
    case "O":
    case "P":
    case "Q":
    case "R":
    case "S":
    case "T":
    case "U":
    case "V":
    case "W":
    case "X":
    case "Y":
    case "Z":
      if (event.ctrlKey) {
        const char = String.fromCharCode(event.key.charCodeAt() - 64);
        if (event.altKey) {
          return `${char}`;
        }
        return char;
      }
      return event.key;
    case "a":
    case "b":
    case "c":
    case "d":
    case "e":
    case "f":
    case "g":
    case "h":
    case "i":
    case "j":
    case "k":
    case "l":
    case "m":
    case "n":
    case "o":
    case "p":
    case "q":
    case "r":
    case "s":
    case "t":
    case "u":
    case "v":
    case "w":
    case "x":
    case "y":
    case "z":
      if (event.ctrlKey) {
        const char = String.fromCharCode(event.key.charCodeAt() - 96);
        if (event.altKey) {
          return `${char}`;
        }
        return char;
      }
      return event.key;
    case "F1":
      return "OP";
    case "F2":
      return "OQ";
    case "F3":
      return "OR";
    case "F4":
      return "OS";
    case "F5":
      return "[15~";
    case "F6":
      return "[17~";
    case "F7":
      return "[18~";
    case "F8":
      return "[19~";
    case "F9":
      return "[20~";
    case "F10":
      return "[21~";
    case "F11":
      return "[23~";
    case "F12":
      return "[24~";
    case "Home":
      if (modifiers) {
        return `[1;${modifiers + 1}H`;
      }
      return `[H`;
    case "End":
      if (modifiers) {
        return `[1;${modifiers + 1}F`;
      }
      return `[F`;
    case "Insert":
      if (event.shiftKey || event.ctrlKey) {
        return "";
      }
      return "[2~";
    case "Delete":
      if (modifiers) {
        return `[3;${modifiers + 1}~`;
      }
      return "[3~";
    case "ArrowUp":
      if (modifiers) {
        return `[1;${modifiers + 1}A`;
      }
      return "[A";
    case "ArrowDown":
      if (modifiers) {
        return `[1;${modifiers + 1}B`;
      }
      return "[B";
    case "ArrowRight":
      if (modifiers) {
        return `[1;${modifiers + 1}C`;
      }
      return "[C";
    case "ArrowLeft":
      if (modifiers) {
        return `[1;${modifiers + 1}D`;
      }
      return "[D";
    case "UIKeyInputUpArrow":
      return "[A";
    case "UIKeyInputDownArrow":
      return "[B";
    case "UIKeyInputRightArrow":
      return "[C";
    case "UIKeyInputLeftArrow":
      return "[D";
    case "Enter":
      if (event.altKey) {
        return "\r";
      }
      return "\n";
    case "PageUp":
      if (event.ctrlKey) {
        return `[5;5~`;
      }
      return "[5~";
    case "PageDown":
      if (event.ctrlKey) {
        return `[6;5~`;
      }
      return `[6~`;
    case "Backspace":
      if (event.altKey) {
        return "";
      }
      if (event.shiftKey) {
        return "\b";
      }
      return "\x7F";
    case "Tab":
      if (event.shiftKey) {
        return "[Z";
      }
      return "	";
    case "Escape":
      if (event.altKey) {
        return "";
      }
      return "";
    case "/":
      return "/";
    case "?":
      if (event.ctrlKey) {
        return "\x7F";
      }
      if (event.altKey) {
        return `?`;
      }
      return event.key;
    case "|":
      if (event.ctrlKey) {
        return "";
      }
      if (event.altKey) {
        return `|`;
      }
      return event.key;
    case "{":
      if (event.ctrlKey) {
        return "";
      }
      if (event.altKey) {
        return `{`;
      }
      return event.key;
    case "}":
      if (event.ctrlKey) {
        return "";
      }
      if (event.altKey) {
        return `}`;
      }
      return event.key;
    case "_":
      if (event.ctrlKey) {
        return "";
      }
      if (event.altKey) {
        return `_`;
      }
      return event.key;
    case "^":
      if (event.ctrlKey) {
        return "";
      }
      if (event.altKey) {
        return `^`;
      }
      return event.key;
    case "@":
      if (event.ctrlKey) {
        return "\0";
      }
      if (event.altKey) {
        return `@`;
      }
      return event.key;
    case " ":
      return ` `;
    default:
      if (event.key.length > 1) {
        return "";
      }
      if (event.altKey) {
        return `${event.key}`;
      }
      return event.key;
  }
};
const CHAR_WIDTH$2 = 13;
const CHAR_HEIGHT$2 = 15;
const COLS = 80;
const ROWS = 25;
const BUFFER_LINES = 200;
const noop = () => {
};
const createTerminal = (root, {
  background = "#000000",
  foreground = "#ffffff",
  handleInput,
  bell = noop,
  setWindowTitle = noop,
  handleFocus = noop
}) => {
  let focused = false;
  const handleKeyDown = (event) => {
    const transformedKey = transformKey(event);
    if (transformedKey) {
      handleInput(transformedKey);
    }
    if (event.key === "Tab") {
      event.preventDefault();
    }
  };
  const handleBeforeInput = (event) => {
    event.preventDefault();
  };
  const blur = () => {
    focused = false;
    cursorStyle = 4;
    requestAnimationFrame(render);
  };
  const focus = () => {
    handleFocus();
    if (focused) {
      return;
    }
    focused = true;
    cursorStyle = 2;
    textarea.focus();
    requestAnimationFrame(render);
  };
  const canvasText = document.createElement("canvas");
  canvasText.className = "TerminalCanvasText";
  const canvasCursor = document.createElement("canvas");
  canvasCursor.className = "TerminalCanvasCursor";
  const $Layers = document.createElement("div");
  $Layers.className = "TerminalLayers";
  const textarea = document.createElement("textarea");
  textarea.className = "TerminalTextArea";
  textarea.name = "terminal-input";
  $Layers.append(canvasText, canvasCursor);
  root.append(textarea, $Layers);
  textarea.onkeydown = handleKeyDown;
  textarea.addEventListener("beforeinput", handleBeforeInput);
  root.onmousedown = (event) => {
    event.preventDefault();
    focus();
  };
  textarea.onblur = blur;
  const WIDTH = COLS * CHAR_WIDTH$2;
  const HEIGHT = ROWS * (CHAR_HEIGHT$2 + 10);
  canvasText.width = canvasCursor.width = WIDTH;
  canvasText.height = canvasCursor.height = HEIGHT;
  let bufferYEnd = ROWS;
  let cursorYRelative = -ROWS;
  let cursorXRelative = -COLS;
  let cellForeground = "#ffffff";
  let cellBackground = "#000000";
  let cursorVisible = true;
  let cursorStyle = 2;
  const dirty = {
    start: 0,
    end: 0
  };
  const lines = [];
  const offsets = new Uint8Array(BUFFER_LINES);
  let attributes = {};
  for (let y = 0; y < BUFFER_LINES; y++) {
    lines.push(new Uint8Array(300));
  }
  const textDecoder = new TextDecoder();
  const dirtyMark = (y) => {
    if (y < dirty.start) {
      dirty.start = y;
    } else if (y > dirty.end) {
      dirty.end = y;
    }
  };
  const dirtyClear = () => {
    dirty.start = dirty.end = bufferYEnd + cursorYRelative;
  };
  const callbackFns = {
    eraseInLine() {
      const y = bufferYEnd + cursorYRelative;
      const x = COLS + cursorXRelative;
      offsets[y] = x;
    },
    eraseInDisplay() {
      offsets.fill(0);
      cursorYRelative = -ROWS + 1;
      cursorXRelative = -COLS;
      bufferYEnd = ROWS;
      for (const key of Object.keys(attributes)) {
        delete attributes[key];
      }
      dirtyMark(0);
      dirtyMark(ROWS);
    },
    setCharAttributes(params) {
      if (params[1] === 7) {
        [cellForeground, cellBackground] = [cellBackground, cellForeground];
      } else if (params[1] === 35) {
        cellForeground = "#8000ff";
      } else if (params[1] === 32) {
        cellForeground = "#09f900";
      } else if (params[1] === 34) {
        cellForeground = "#0090ff";
      } else {
        cellForeground = foreground;
        cellBackground = background;
      }
      const y = bufferYEnd + cursorYRelative;
      attributes[y] = attributes[y] || {};
      attributes[y][offsets[y]] = {
        foreground: cellForeground,
        background: cellBackground
      };
    },
    cursorUp() {
      console.log("cursor up");
    },
    cursorDown() {
    },
    cursorRight() {
      cursorXRelative++;
    },
    cursorLeft() {
      console.log("cursor left");
    },
    backspace() {
      cursorXRelative--;
    },
    deleteChars(numberOfChars) {
      const y = bufferYEnd + cursorYRelative;
      const x = COLS + cursorXRelative;
      offsets[y] = x;
    },
    bell,
    print(array, start, end) {
      const subArray = array.subarray(start, end);
      const y = bufferYEnd + cursorYRelative;
      const x = COLS + cursorXRelative;
      lines[y].set(subArray, x);
      cursorXRelative += end - start;
      offsets[y] = COLS + cursorXRelative;
      dirtyMark(y);
      if (x >= COLS - 1) {
        callbackFns.lineFeed();
      }
    },
    lineFeed() {
      if (cursorYRelative === 0) {
        bufferYEnd = (bufferYEnd + 1) % BUFFER_LINES;
        offsets[bufferYEnd] = 0;
        delete attributes[bufferYEnd];
      } else {
        cursorYRelative++;
      }
      cellForeground = foreground;
      cellBackground = background;
    },
    carriageReturn() {
      cursorXRelative = -COLS;
    },
    setWindowTitle,
    cursorPosition(params) {
      if (params.length === 2) {
        const row = params[0];
        const column = params[1];
        cursorYRelative = -ROWS + row;
        cursorXRelative = -COLS + column;
      }
    },
    cursorShow() {
      cursorVisible = true;
    },
    cursorHide() {
      cursorVisible = false;
    },
    insertLines() {
    },
    deleteLines() {
    },
    setTextParameters() {
    },
    privateModeSet() {
    },
    privateModeReset() {
    },
    eraseToEndOfLine() {
    },
    goToHome() {
    },
    setGLevel() {
    },
    saveCursor() {
    },
    restoreCursor() {
    },
    index() {
    },
    tabSet() {
    },
    reverseIndex() {
    },
    keypadApplicationMode() {
    },
    keypadNumericMode() {
    },
    fullReset() {
    },
    nextLine() {
    },
    deleteCharacters() {
    },
    softTerminalReset() {
    },
    cursorNextLine() {
    },
    cursorPrecedingLine() {
    },
    cursorCharacterAbsolute() {
    },
    cursorForwardTabulation() {
    },
    cursorBackwardTabulation() {
    },
    scrollUp() {
    },
    scrollDown() {
    },
    eraseCharacters() {
    },
    characterPositionAbsolute() {
    },
    characterPositionRelative() {
    },
    repeatPrecedingGraphicCharacter() {
    },
    sendDeviceAttributesPrimary() {
    },
    sendDeviceAttributesTertiary() {
    },
    linePositionAbsolute() {
    },
    linePositionRelative() {
    },
    horizontalAndVerticalPosition() {
    },
    tabClear() {
    },
    setMode() {
    },
    resetMode() {
    },
    setCursorStyle() {
    },
    shiftLeftColumns() {
    },
    insertBlankCharacters() {
    }
  };
  const drawLines = createDrawLines(canvasText, lines, BUFFER_LINES, offsets, attributes, ROWS, COLS, background, foreground);
  const drawCursor = createDrawCursor(canvasCursor);
  let scheduled = false;
  const render = () => {
    drawLines(dirty.start, dirty.end + 1, bufferYEnd);
    const y = ROWS + cursorYRelative;
    const x = COLS + cursorXRelative;
    drawCursor(x, y, cursorVisible, cursorStyle);
    scheduled = false;
    dirtyClear();
  };
  const write = (array) => {
    parseArray(array, callbackFns);
    if (!scheduled) {
      scheduled = true;
      requestAnimationFrame(render);
    }
  };
  const pasteText = (text) => {
    const fixedText = "\n" + text.replaceAll("\n", "\r\n");
    const array = new TextEncoder().encode(fixedText);
    write(array);
  };
  return {
    write,
    focus,
    pasteText,
    writeText: pasteText,
    lines
  };
};
const CHAR_WIDTH$3 = 13;
const CHAR_HEIGHT$3 = 15;
const COLS$1 = 80;
const ROWS$1 = 25;
const BUFFER_LINES$1 = 200;
const noop$1 = () => {
};
const createOffscreenTerminalDom = (root, {handleMouseDown = noop$1, handleKeyDown = noop$1, handleBlur = noop$1}) => {
  root.onmousedown = (event) => {
    event.preventDefault();
    textarea.focus();
    handleMouseDown();
  };
  const canvasText = document.createElement("canvas");
  canvasText.className = "TerminalCanvasText";
  const canvasCursor = document.createElement("canvas");
  canvasCursor.className = "TerminalCanvasCursor";
  const $Layers = document.createElement("div");
  $Layers.className = "TerminalLayers";
  const textarea = document.createElement("textarea");
  textarea.className = "TerminalTextArea";
  textarea.name = "terminal-input";
  $Layers.append(canvasText, canvasCursor);
  root.append(textarea, $Layers);
  const wrappedKeyDown = (event) => {
    handleKeyDown({
      key: event.key,
      shiftKey: event.shiftKey,
      altKey: event.altKey,
      ctrlKey: event.ctrlKey,
      metaKey: event.metaKey
    });
  };
  textarea.onkeydown = wrappedKeyDown;
  const handleBeforeInput = (event) => {
    event.preventDefault();
  };
  textarea.addEventListener("beforeinput", handleBeforeInput);
  textarea.onblur = handleBlur;
  const offscreenCanvasText = canvasText.transferControlToOffscreen();
  const offscreenCanvasCursor = canvasCursor.transferControlToOffscreen();
  const focusTextArea = () => {
    textarea.focus();
  };
  return {
    offscreenCanvasCursor,
    offscreenCanvasText,
    focusTextArea
  };
};
const createOffscreenTerminal = ({
  background = "#000000",
  foreground = "#ffffff",
  handleInput,
  bell = noop$1,
  setWindowTitle = noop$1,
  handleFocus = noop$1,
  canvasText,
  canvasCursor,
  focusTextArea = noop$1
}) => {
  let focused = false;
  const handleKeyDown = (event) => {
    const transformedKey = transformKey(event);
    if (transformedKey) {
      handleInput(transformedKey);
    }
  };
  const handleBlur = () => {
    focused = false;
    cursorStyle = 4;
    requestAnimationFrame(render);
  };
  const focus = () => {
    handleFocus();
    if (focused) {
      return;
    }
    focused = true;
    cursorStyle = 2;
    focusTextArea();
    requestAnimationFrame(render);
  };
  const WIDTH = COLS$1 * CHAR_WIDTH$3;
  const HEIGHT = ROWS$1 * (CHAR_HEIGHT$3 + 10);
  canvasText.width = canvasCursor.width = WIDTH;
  canvasText.height = canvasCursor.height = HEIGHT;
  let bufferYEnd = ROWS$1;
  let cursorYRelative = -ROWS$1;
  let cursorXRelative = -COLS$1;
  let cellForeground = "#ffffff";
  let cellBackground = "#000000";
  let cursorVisible = true;
  let cursorStyle = 2;
  const dirty = {
    start: 0,
    end: 0
  };
  const lines = [];
  const offsets = new Uint8Array(BUFFER_LINES$1);
  let attributes = {};
  for (let y = 0; y < BUFFER_LINES$1; y++) {
    lines.push(new Uint8Array(300));
  }
  const textDecoder = new TextDecoder();
  const dirtyMark = (y) => {
    if (y < dirty.start) {
      dirty.start = y;
    } else if (y > dirty.end) {
      dirty.end = y;
    }
  };
  const dirtyClear = () => {
    dirty.start = dirty.end = bufferYEnd + cursorYRelative;
  };
  const callbackFns = {
    eraseInLine() {
      const y = bufferYEnd + cursorYRelative;
      const x = COLS$1 + cursorXRelative;
      offsets[y] = x;
    },
    eraseInDisplay() {
      offsets.fill(0);
      cursorYRelative = -ROWS$1 + 1;
      cursorXRelative = -COLS$1;
      bufferYEnd = ROWS$1;
      for (const key of Object.keys(attributes)) {
        delete attributes[key];
      }
      dirtyMark(0);
      dirtyMark(ROWS$1);
    },
    setCharAttributes(params) {
      if (params[1] === 7) {
        [cellForeground, cellBackground] = [cellBackground, cellForeground];
      } else if (params[1] === 35) {
        cellForeground = "#8000ff";
      } else if (params[1] === 32) {
        cellForeground = "#09f900";
      } else if (params[1] === 34) {
        cellForeground = "#0090ff";
      } else {
        cellForeground = foreground;
        cellBackground = background;
      }
      const y = bufferYEnd + cursorYRelative;
      attributes[y] = attributes[y] || {};
      attributes[y][offsets[y]] = {
        foreground: cellForeground,
        background: cellBackground
      };
    },
    cursorUp() {
      console.log("cursor up");
    },
    cursorDown() {
    },
    cursorRight() {
      cursorXRelative++;
    },
    cursorLeft() {
      console.log("cursor left");
    },
    backspace() {
      cursorXRelative--;
    },
    deleteChars(numberOfChars) {
      const y = bufferYEnd + cursorYRelative;
      const x = COLS$1 + cursorXRelative;
      offsets[y] = x;
    },
    bell,
    print(array, start, end) {
      const subArray = array.subarray(start, end);
      const y = bufferYEnd + cursorYRelative;
      const x = COLS$1 + cursorXRelative;
      lines[y].set(subArray, x);
      cursorXRelative += end - start;
      offsets[y] = COLS$1 + cursorXRelative;
      dirtyMark(y);
      if (x >= COLS$1 - 1) {
        callbackFns.lineFeed();
      }
    },
    lineFeed() {
      if (cursorYRelative === 0) {
        bufferYEnd = (bufferYEnd + 1) % BUFFER_LINES$1;
        offsets[bufferYEnd] = 0;
        delete attributes[bufferYEnd];
      } else {
        cursorYRelative++;
      }
      cellForeground = foreground;
      cellBackground = background;
    },
    carriageReturn() {
      cursorXRelative = -COLS$1;
    },
    setWindowTitle,
    cursorPosition(params) {
      if (params.length === 2) {
        const row = params[0];
        const column = params[1];
        cursorYRelative = -ROWS$1 + row;
        cursorXRelative = -COLS$1 + column;
      }
    },
    cursorShow() {
      cursorVisible = true;
    },
    cursorHide() {
      cursorVisible = false;
    },
    insertLines() {
    },
    deleteLines() {
    },
    setTextParameters() {
    },
    privateModeSet() {
    },
    privateModeReset() {
    },
    eraseToEndOfLine() {
    },
    goToHome() {
    },
    setGLevel() {
    },
    saveCursor() {
    },
    restoreCursor() {
    },
    index() {
    },
    tabSet() {
    },
    reverseIndex() {
    },
    keypadApplicationMode() {
    },
    keypadNumericMode() {
    },
    fullReset() {
    },
    nextLine() {
    },
    deleteCharacters() {
    },
    softTerminalReset() {
    },
    cursorNextLine() {
    },
    cursorPrecedingLine() {
    },
    cursorCharacterAbsolute() {
    },
    cursorForwardTabulation() {
    },
    cursorBackwardTabulation() {
    },
    scrollUp() {
    },
    scrollDown() {
    },
    eraseCharacters() {
    },
    characterPositionAbsolute() {
    },
    characterPositionRelative() {
    },
    repeatPrecedingGraphicCharacter() {
    },
    sendDeviceAttributesPrimary() {
    },
    sendDeviceAttributesTertiary() {
    },
    linePositionAbsolute() {
    },
    linePositionRelative() {
    },
    horizontalAndVerticalPosition() {
    },
    tabClear() {
    },
    setMode() {
    },
    resetMode() {
    },
    setCursorStyle() {
    },
    shiftLeftColumns() {
    },
    insertBlankCharacters() {
    }
  };
  const drawLines = createDrawLines(canvasText, lines, BUFFER_LINES$1, offsets, attributes, ROWS$1, COLS$1, background, foreground);
  const drawCursor = createDrawCursor(canvasCursor);
  let scheduled = false;
  const render = () => {
    drawLines(dirty.start, dirty.end + 1, bufferYEnd);
    const y = ROWS$1 + cursorYRelative;
    const x = COLS$1 + cursorXRelative;
    drawCursor(x, y, cursorVisible, cursorStyle);
    scheduled = false;
    dirtyClear();
  };
  const write = (array) => {
    parseArray(array, callbackFns);
    if (!scheduled) {
      scheduled = true;
      requestAnimationFrame(render);
    }
  };
  const pasteText = (text) => {
    const fixedText = "\n" + text.replaceAll("\n", "\r\n");
    const array = new TextEncoder().encode(fixedText);
    write(array);
  };
  return {
    write,
    focus,
    pasteText,
    writeText: pasteText,
    lines,
    handleKeyDown,
    handleBlur,
    handleMouseDown: focus
  };
};
export {createOffscreenTerminal, createOffscreenTerminalDom, createTerminal};
export default null;
