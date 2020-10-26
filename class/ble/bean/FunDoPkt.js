import Pkt from "./Pkt";
import Endian from '../../utils/Endian';
import SimpleLogger from "../../utils/SimpleLogger";
import FunDoConstants from "./FunDoConstants";
import {
  CRC8
} from '../../utils/CRC';


class FunDoPkt extends Pkt {

  static parser(arrayBuffer) {
    if (!(arrayBuffer instanceof ArrayBuffer)) {
      simpleLogger.error(`FunDoPktParser only support parse ArrayBuffer: ${Endian.toHexString(arrayBuffer)}`);
      throw `FunDoPktParser only support parse ArrayBuffer: ${Endian.toHexString(arrayBuffer)}`;
    }
    if (arrayBuffer.byteLength < 13) {
      simpleLogger.error(`parse FunDoPkt failed: invalid data lenth: ${Endian.toHexString(arrayBuffer)}`);
      throw `parse FunDoPkt failed: invalid data lenth: ${Endian.toHexString(arrayBuffer)}`;
    }
    return new FunDoPkt(arrayBuffer);
  }

  constructor(arrayBuffer) {
    super();
    if (arrayBuffer instanceof ArrayBuffer) {
      this._mark = 0xBA;
      this._raw = arrayBuffer;
      const opt = this.rawArray[FunDoConstants.L1.VER_MASK.IDX];
      this._hasNextPkt = (opt & FunDoConstants.L1.HAS_NEXT_PKT_MARK.MASK) > 0;
      this._isOk = (opt & FunDoConstants.L1.HAS_ERR.MASK) > 0;
      this._isRsp = (opt & FunDoConstants.L1.IS_RSP.MASK) > 0;
      this._l1Ver = opt & FunDoConstants.L1.VER_MASK.MASK;
      this._l2Len = Endian.Big.getUint16(this.rawArray, FunDoConstants.L1.LEN.IDX);
      this._crc = Endian.Big.getUint16(this.rawArray, FunDoConstants.L1.CRC.IDX);
      this._seq = Endian.Big.getUint16(this.rawArray, FunDoConstants.L1.SEQ.IDX);

      // L2
      this._cmd = this.rawArray[FunDoConstants.L2.CMD.IDX];
      this._l1Ver = this.rawArray[FunDoConstants.L2.VER.IDX];
      this._key = this.rawArray[FunDoConstants.L2.KEY.IDX];
      this._l2ValLen = Endian.Big.getUint16(this.rawArray, FunDoConstants.L2.LEN.IDX);
      // this._l2Value = new ArrayBuffer(this._l2ValLen);
      // this.l2ValueArray.set(this.rawArray.subarray(FunDoConstants.MIN_LEN), 0);
    } else {
      // L1
      this._mark = 0xBA;
      this._hasNextPkt = false;
      this._isOk = true;
      this._isRsp = false;
      this._l1Ver = 0x00;
      this._l2Len = 0x05;
      this._crc = 0x00;
      this._seq = 0x00;
      // L2
      this._cmd = 0x00;
      this._l2Ver = 0x00;
      this._key = 0x00;
      this._l2ValLen = 0x00;
      // payload
      this._l2Value = new ArrayBuffer(0);
      // raw
      this._raw = new ArrayBuffer(FunDoConstants.MIN_LEN);
      this.rawArray[FunDoConstants.L1.MARK.IDX] = this.mark;
      if (this.isOk)
        this.rawArray[FunDoConstants.L1.VER_MASK.IDX] &= FunDoConstants.L1.HAS_ERR.MASK;
      if (this.l1Ver != 0x00)
        this.rawArray[FunDoConstants.L1.VER_MASK.IDX] &= FunDoConstants.L1.VER_MASK.MASK;
      if (this.isRsp)
        this.rawArray[FunDoConstants.L1.VER_MASK.IDX] &= FunDoConstants.L1.IS_RSP.MASK;
      Endian.Big.putUint16(this.rawArray, FunDoConstants.L1.LEN.IDX, this.l2Len);
      this.rawArray[FunDoConstants.L1.CRC.IDX] = this.crc;
      Endian.Big.putUint16(this.rawArray, FunDoConstants.L1.SEQ.IDX, this.seq);
      this.rawArray[FunDoConstants.L2.CMD.IDX] = this.cmd;
      Endian.Big.putUint16(this.rawArray, FunDoConstants.L2.LEN.IDX, this.l2ValLen);
      this.rawArray[FunDoConstants.L2.KEY.IDX] = this.key;
      if (this.l2Value.byteLength > 0)
        this.rawArray.set(this.l2ValueArray, FunDoConstants.L2.VALUE.IDX);
    }
  }

  set mark(val) {
    this.rawArray[FunDoConstants.L1.MARK.IDX] = val;
  }
  set hasNextPkt(val) {
    this._hasNextPkt = val;
    this.rawArray[FunDoConstants.L1.HAS_NEXT_PKT_MARK.IDX] |= FunDoConstants.L1.HAS_NEXT_PKT_MARK.MASK;
  }
  set isOk(val) {
    this._isOk = val;
    this.rawArray[FunDoConstants.L1.HAS_ERR.IDX] |= FunDoConstants.L1.HAS_ERR.MASK;
  }
  set isRsp(val) {
    this._isRsp = val;
    this.rawArray[FunDoConstants.L1.IS_RSP.IDX] |= FunDoConstants.L1.IS_RSP.MASK;
  }
  set l1Ver(val) {
    this._l1Ver = val;
    this.rawArray[FunDoConstants.L1.VER_MASK.IDX] |= (FunDoConstants.L1.VER_MASK.MASK & val);
  }
  set l2Len(val) {
    this._l2Len = val;
    Endian.Big.putUint16(this.rawArray, FunDoConstants.L1.LEN.IDX, val);
  }
  set crc(val) {
    this._crc = val;
    this.rawArray[FunDoConstants.L1.CRC.IDX] = val;
  }
  set l1Ver(val) {
    this._l1Ver = val;
    this.rawArray[FunDoConstants.L1.VER_MASK.IDX] = val;
  }
  set seq(val) {
    this._seq = val;
    Endian.Big.putUint16(this.rawArray, FunDoConstants.L1.SEQ.IDX, val);
  }
  set cmd(val) {
    this._cmd = val;
    this.rawArray[FunDoConstants.L2.CMD.IDX] = val;
  }
  set l2Ver(val) {
    this._l2Ver = val;
    this.rawArray[FunDoConstants.L2.VER.IDX] = val;
  }
  set key(val) {
    this._key = val;
    this.rawArray[FunDoConstants.L2.KEY.IDX] = val;
  }
  set l2Value(val) {
    if (val instanceof ArrayBuffer && val.byteLength > 0) {
      let newRawLength = this.rawArray.byteLength;
      if (val.byteLength !== this.l2Len) {
        // 暂时不考虑多个key:val的情况
        newRawLength = FunDoConstants.MIN_LEN + val.byteLength;
      }
      let newRaw = new ArrayBuffer(newRawLength);
      let newRawArray = new Uint8Array(newRaw);
      newRawArray.set(this.rawArray);
      newRawArray.set(new Uint8Array(val), FunDoConstants.L2.VALUE.IDX);
      Endian.Big.putUint16(newRawArray, FunDoConstants.L2.LEN.IDX, val.byteLength);
      Endian.Big.putUint16(newRawArray, FunDoConstants.L1.LEN.IDX, val.byteLength + FunDoConstants.L2.MIN_LEN);
      this._raw = newRaw;
    }
  }
  get mark() {
    return this._mark
  }
  get hasNextPkt() {
    return this._hasNextPkt
  }
  get isOk() {
    return this._isOk
  }
  get isRsp() {
    return this._isRsp
  }
  get l1Ver() {
    return this._l1Ver
  }
  get l2Len() {
    return this._l2Len
  }
  get crc() {
    return this._crc
  }
  get seq() {
    return this._seq
  }
  // L2
  get cmd() {
    return this._cmd
  }
  get l2Ver() {
    return this._l2Ver
  }
  get key() {
    return this._key
  }
  get l2ValLen() {
    return this._l2ValLen
  }
  // payload
  get l2Value() {
    return this._raw.slice(FunDoConstants.L2.VALUE.IDX);
  }
  // raw
  get raw() {
    return this._raw
  }
  get rawArray() {
    return new Uint8Array(this._raw);
  }
  get l2ValueArray() {
    return this.rawArray.subarray(FunDoConstants.L2.VALUE.IDX);
  }
  resetCrc() {
    let crc8 = new CRC8();
    crc8.update(this.rawArray.subarray(8));
    Endian.Big.putUint16(this.rawArray, FunDoConstants.L1.CRC.IDX, crc8.get());
  }
}

module.exports = FunDoPkt