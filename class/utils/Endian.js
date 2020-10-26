import SimpleLogger from './SimpleLogger';

const simpleLogger = new SimpleLogger();
class Endian {
  static Big = {
    putUint8(dest, offset, data) {
      if (!(dest instanceof Uint8Array)) {
        simpleLogger.error('dest data type must be Uint8Array');
        throw 'dest data type must be Uint8Array';
      }
      if (dest.byteLength >= offset + 1) {
        dest[offset] = data & 0xff;
      } else {
        simpleLogger.error('array out of index');
        throw 'array out of index';
      }
    },
    putUint16(dest, offset, data) {
      if (!(dest instanceof Uint8Array)) {
        simpleLogger.error('dest data type must be Uint8Array');
        throw 'dest data type must be Uint8Array';
      }
      if (dest.byteLength >= offset + 2) {
        dest[offset] = (data >> 8) & 0xff;
        dest[offset + 1] = data & 0xff;
      } else {
        simpleLogger.error('array out of index');
        throw 'array out of index';
      }
    },
    putUint32(dest, offset, data) {
      if (!(dest instanceof Uint8Array)) {
        simpleLogger.error('dest data type must be Uint8Array');
        throw 'dest data type must be Uint8Array';
      }
      if (dest.byteLength >= offset + 4) {
        dest[offset] = (data >> 24) & 0xff;
        dest[offset + 1] = (data >> 16) & 0xff;
        dest[offset + 2] = (data >> 8) & 0xff;
        dest[offset + 3] = data & 0xff;
      } else {
        simpleLogger.error('array out of index');
        throw 'array out of index';
      }
    },
    getUint8(array, offset) {
      let dest = array;
      if (array instanceof ArrayBuffer) {
        dest = new Uint8Array(array);
      }
      if (!(dest instanceof Uint8Array)) {
        simpleLogger.error('dest data type must be Uint8Array');
        throw 'dest data type must be Uint8Array';
      }
      if (dest.byteLength < offset) {
        simpleLogger.error('dest length not enough');
        throw 'dest length not enough';
      }
      return dest[offset] & 0xFF;
    },
    getUint16(array, offset) {
      let dest = array;
      if (array instanceof ArrayBuffer) {
        dest = new Uint8Array(array);
      }
      if (!(dest instanceof Uint8Array)) {
        simpleLogger.error('dest data type must be Uint8Array');
        throw 'dest data type must be Uint8Array';
      }
      if (dest.byteLength <= offset + 1) {
        simpleLogger.error('dest length not enough');
        throw 'dest length not enough';
      }
      return (dest[offset] << 8 | dest[offset + 1]) & 0xFFFF;
    },
    getUint24(array, offset) {
      let dest = array;
      if (array instanceof ArrayBuffer) {
        dest = new Uint8Array(array);
      }
      if (!(dest instanceof Uint8Array)) {
        simpleLogger.error('dest data type must be Uint8Array');
        throw 'dest data type must be Uint8Array';
      }
      if (dest.byteLength <= offset + 2) {
        simpleLogger.error('dest length not enough');
        throw 'dest length not enough';
      }
      return (dest[offset] << 16 | dest[offset + 1] < 8 | dest[offset + 2]) & 0xFFFF;
    },
    getUint32(array, offset) {
      let dest = array;
      if (array instanceof ArrayBuffer) {
        dest = new Uint8Array(array);
      }
      if (!(dest instanceof Uint8Array)) {
        simpleLogger.error('dest data type must be Uint8Array');
        throw 'dest data type must be Uint8Array';
      }
      if (dest.byteLength <= offset + 3) {
        simpleLogger.error('dest length not enough');
        throw 'dest length not enough';
      }
      return (dest[offset] << 24 | dest[offset + 1] << 16 | dest[offset + 2] < 8 | dest[offset + 3]) & 0xFFFF;
    },
    getUint(array, offset, size) {
      if (size === 1) {
        return this.getUint8(array, offset);
      } else if (size === 2) {
        return this.getUint16(array, offset);
      } else if (size === 3) {
        return this.getUint24(array, offset);
      } else if (size === 4) {
        return this.getUint32(array, offset);
      }
    }
  }
  static toHexString(data) {
    if (data instanceof ArrayBuffer) {
      let raw = new Uint8Array(data);
      let hex_string = '';
      for (var b in raw) {
        let hex = raw[b].toString(16);
        if (hex.length === 1) {
          hex_string += '0' + hex;
        } else {
          hex_string += hex.toUpperCase();
        }
      }
      return hex_string.toUpperCase();
    } else if (data instanceof Uint8Array) {
      let hex_string = '';
      for (var b in data) {
        let hex = data[b].toString(16);
        if (hex.length === 1) {
          hex_string += '0' + hex;
        } else {
          hex_string += hex.toUpperCase();
        }
      }
      return hex_string.toUpperCase();
    } else if (typeof data === 'number') {
      let hex = data.toString(16).toUpperCase();
      return hex.length % 2 === 1 ? '0' + hex : hex;
    } else {
      simpleLogger.error('only support parameter type: ArrayBuffer');
      throw 'only support parameter type: ArrayBuffer';
    }
  }
}

module.exports = Endian;