import SimpleLogger from '../utils/SimpleLogger';
import FunDoConstants from '../ble/bean/FunDoConstants';

const simpleLogger = new SimpleLogger();

const deepMergeObject = (dest, src) => {
	for (var key in src) {
		if (dest[key] === undefined) {
			dest[key] = src[key];
			continue;
		}
		if (isJSON(src[key]) || isArray(src[key])) {
			deepMergeObject(dest[key], src[key]);
		} else {
			dest[key] = src[key];
		}
	}
}

const KEEP_OLDER = ['_mark', '_cmd', '_mark', '_seq', '_key', '_crc'];
const ACCEPT_NEWER = ['_hasNextPkt', '_isOk', '_isRsp', '_l1Ver']
const APPEND_NEWER = []
const ADD_NEWER = ['_l2ValLen']
const mergeFunDoPkt = (dest, src) => {
	if (dest === undefined) {
		dest = src;
		return dest;
	}
	for (let prop in src) {
		if ('_raw' === prop) {
			// 合并raw
			if (dest[prop] === undefined) {
				dest[prop] = src[prop];
			} else {
				if (dest[prop] instanceof ArrayBuffer && src[prop] instanceof ArrayBuffer) {
					if (dest.l2Value instanceof ArrayBuffer && src.l2Value instanceof ArrayBuffer) {
						let len = dest.l2Value.byteLength + src.l2Value.byteLength;
						let value = new ArrayBuffer(len);
						let valueArr = new Uint8Array(value);
						valueArr.set(dest.l2ValueArray, 0);
						valueArr.set(src.l2ValueArray, dest.l2Value.byteLength);
						dest.l2Value = value;
					}
				}
			}
		} else if (KEEP_OLDER.findIndex(p => p === prop) > -1) {
			// 保持旧值
			continue;
		} else if (ACCEPT_NEWER.findIndex(p => p === prop) > -1) {
			// 接受新值
			dest[prop] = src[prop];
		} else if (ADD_NEWER.findIndex(p => p === prop) > -1) {
			// 累积新值
			if (typeof dest[prop] === 'number' && typeof src[prop] === 'number') {
				dest[prop] += src[prop];
			}
		} else if (isArray(src[prop])) {
			if (dest[prop] === undefined) {
				dest[prop] = src[prop];
			} else {
				dest[prop] = dest[prop].concat(src[prop]);
			}
		} else if (isJSON(src[prop])) {
			if (dest[prop] === undefined) {
				dest[prop] = src[prop];
			} else {
				dest[prop] = mergeFunDoPkt(dest[prop], src[prop]);
			}
		} else {
			dest[prop] = src[prop];
		}
	}
	return dest;
}

const isJSON = (target) => {
	return typeof target == "object" && target.constructor == Object;
}

const isArray = (o) => {
	return Object.prototype.toString.call(o) == '[object Array]';
}

module.exports = {
	mergeFunDoPkt: mergeFunDoPkt
}