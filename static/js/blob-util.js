function loadImage(src, crossOrigin) {
  return new Promise(function(resolve, reject) {
    var img = new Image();
    if (crossOrigin) {
      img.crossOrigin = crossOrigin;
    }
    img.onload = function() {
      resolve(img);
    };
    img.onerror = reject;
    img.src = src;
  });
}
function imgToCanvas(img) {
  var canvas = document.createElement("canvas");
  canvas.width = img.width;
  canvas.height = img.height;
  var context = canvas.getContext("2d");
  context.drawImage(img, 0, 0, img.width, img.height, 0, 0, img.width, img.height);
  return canvas;
}
function createBlob(parts, properties) {
  parts = parts || [];
  properties = properties || {};
  if (typeof properties === "string") {
    properties = {type: properties};
  }
  try {
    return new Blob(parts, properties);
  } catch (e) {
    if (e.name !== "TypeError") {
      throw e;
    }
    var Builder = typeof BlobBuilder !== "undefined" ? BlobBuilder : typeof MSBlobBuilder !== "undefined" ? MSBlobBuilder : typeof MozBlobBuilder !== "undefined" ? MozBlobBuilder : WebKitBlobBuilder;
    var builder = new Builder();
    for (var i = 0; i < parts.length; i += 1) {
      builder.append(parts[i]);
    }
    return builder.getBlob(properties.type);
  }
}
function createObjectURL(blob) {
  return (typeof URL !== "undefined" ? URL : webkitURL).createObjectURL(blob);
}
function revokeObjectURL(url) {
  return (typeof URL !== "undefined" ? URL : webkitURL).revokeObjectURL(url);
}
function blobToBinaryString(blob) {
  return new Promise(function(resolve, reject) {
    var reader = new FileReader();
    var hasBinaryString = typeof reader.readAsBinaryString === "function";
    reader.onloadend = function() {
      var result = reader.result || "";
      if (hasBinaryString) {
        return resolve(result);
      }
      resolve(arrayBufferToBinaryString(result));
    };
    reader.onerror = reject;
    if (hasBinaryString) {
      reader.readAsBinaryString(blob);
    } else {
      reader.readAsArrayBuffer(blob);
    }
  });
}
function base64StringToBlob(base64, type) {
  var parts = [binaryStringToArrayBuffer(atob(base64))];
  return type ? createBlob(parts, {type}) : createBlob(parts);
}
function binaryStringToBlob(binary, type) {
  return base64StringToBlob(btoa(binary), type);
}
function blobToBase64String(blob) {
  return blobToBinaryString(blob).then(btoa);
}
function dataURLToBlob(dataURL) {
  var type = dataURL.match(/data:([^;]+)/)[1];
  var base64 = dataURL.replace(/^[^,]+,/, "");
  var buff = binaryStringToArrayBuffer(atob(base64));
  return createBlob([buff], {type});
}
function blobToDataURL(blob) {
  return blobToBase64String(blob).then(function(base64String) {
    return "data:" + blob.type + ";base64," + base64String;
  });
}
function imgSrcToDataURL(src, type, crossOrigin, quality) {
  type = type || "image/png";
  return loadImage(src, crossOrigin).then(imgToCanvas).then(function(canvas) {
    return canvas.toDataURL(type, quality);
  });
}
function canvasToBlob(canvas, type, quality) {
  if (typeof canvas.toBlob === "function") {
    return new Promise(function(resolve) {
      canvas.toBlob(resolve, type, quality);
    });
  }
  return Promise.resolve(dataURLToBlob(canvas.toDataURL(type, quality)));
}
function imgSrcToBlob(src, type, crossOrigin, quality) {
  type = type || "image/png";
  return loadImage(src, crossOrigin).then(imgToCanvas).then(function(canvas) {
    return canvasToBlob(canvas, type, quality);
  });
}
function arrayBufferToBlob(buffer, type) {
  return createBlob([buffer], type);
}
function blobToArrayBuffer(blob) {
  return new Promise(function(resolve, reject) {
    var reader = new FileReader();
    reader.onloadend = function() {
      var result = reader.result || new ArrayBuffer(0);
      resolve(result);
    };
    reader.onerror = reject;
    reader.readAsArrayBuffer(blob);
  });
}
function arrayBufferToBinaryString(buffer) {
  var binary = "";
  var bytes = new Uint8Array(buffer);
  var length = bytes.byteLength;
  var i = -1;
  while (++i < length) {
    binary += String.fromCharCode(bytes[i]);
  }
  return binary;
}
function binaryStringToArrayBuffer(binary) {
  var length = binary.length;
  var buf = new ArrayBuffer(length);
  var arr = new Uint8Array(buf);
  var i = -1;
  while (++i < length) {
    arr[i] = binary.charCodeAt(i);
  }
  return buf;
}
export {arrayBufferToBinaryString, arrayBufferToBlob, base64StringToBlob, binaryStringToArrayBuffer, binaryStringToBlob, blobToArrayBuffer, blobToBase64String, blobToBinaryString, blobToDataURL, canvasToBlob, createBlob, createObjectURL, dataURLToBlob, imgSrcToBlob, imgSrcToDataURL, revokeObjectURL};
export default null;
