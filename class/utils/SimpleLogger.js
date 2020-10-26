const toHexString = (data) => {
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

class SimpleLogger {

  constructor() {
    this.loggerLevel = 'info';
  }

  setLoggerLevel(loggerLevel) {
    if (loggerLevel === 'trace' ||
      loggerLevel === 'info' ||
      loggerLevel === 'error') {
      this.loggerLevel = loggerLevel;
    }
  }

  logFunDo(message, fundoPkt) {
    if (!!fundoPkt && fundoPkt.cmd !== undefined && fundoPkt.key !== undefined && fundoPkt.seq !== undefined && fundoPkt.l2Value !== undefined && fundoPkt.raw !== undefined) {
      let cmd = typeof fundoPkt.cmd === 'number' ? `cmd: 0x${toHexString(fundoPkt.cmd)}` : '';
      let key = typeof fundoPkt.key === 'number' ? `key: 0x${toHexString(fundoPkt.key)}` : '';
      let seq = typeof fundoPkt.seq === 'number' ? `seq: 0x${toHexString(fundoPkt.seq)}` : '';
      let l2Value = fundoPkt.l2Value.byteLength > 0 ? `value: 0x${toHexString(fundoPkt.l2Value)}` : '';
      let raw = fundoPkt.raw.byteLength > 0 ? `raw: 0x${toHexString(fundoPkt.raw)}` : '';
      this.logger(`${message}: ${cmd} ${key} ${seq} ${l2Value}`);
      this.logger(`${message}: ${raw}`);
    } else {
      this.logger(message);
    }
  }

  logger(message) {
    if (this.loggerLevel === 'trace') {
      console.trace(message);
    } else if (this.loggerLevel === 'info') {
      console.log(message);
    } else if (this.loggerLevel === 'error') {
      console.error(message);
    }
  }

  error(message) {
    console.error(message);
  }

}

module.exports = SimpleLogger