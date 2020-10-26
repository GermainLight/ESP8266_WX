// 基础FunDo包
import SimpleLogger from '../../utils/SimpleLogger';

const simpleLogger = new SimpleLogger();

class Pkt {
    static _seq = 0;

    static setSeq(value) {
        return Pkt._seq = value & 0xffff;
    }

    static getSeq() {
        return Pkt._seq & 0xffff;
    }

    static getAndIncrementSeq() {
        return Pkt._seq++ & 0xffff;
    }

    static IncrementAndGetSeq() {
        return ++Pkt._seq & 0xffff;
    }

    constructor(arrayBuffer) {
        // 原始数据
        if (arrayBuffer instanceof ArrayBuffer) {
            this._raw = arrayBuffer;
        }
    }

    set raw(value) {
        if (value instanceof ArrayBuffer) {
            this._raw = value;
        }
    }

    get raw() {
        if (this._raw instanceof ArrayBuffer) {
            return this._raw;
        } else {
            simpleLogger.error('raw data is not avaliable');
            throw 'raw data is not avaliable';
        }
    }
}


module.exports = Pkt;