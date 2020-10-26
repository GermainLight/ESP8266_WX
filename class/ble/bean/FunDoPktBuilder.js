import Pkt from './Pkt';
import FunDoPkt from './FunDoPkt';
import SimpleLogger from '../../utils/SimpleLogger';
const simpleLogger = new SimpleLogger();

class FunDoPktBuilder {
	constructor() {
		this._cmd = 0x00;
		this._key = 0x00;
		this._seq = 0x00;
		this._value = new ArrayBuffer(0);
	}
	withCmd(data) {
		this._cmd = data;
		return this;
	}
	withKey(data) {
		this._key = data;
		return this;
	}
	withSeq(data) {
		this._seq = data;
		return this;
	}
	withValue(data) {
		this._value = data;
		return this;
	}
	build() {
		let fundoPkt = new FunDoPkt();
		fundoPkt.isOk = true;
		fundoPkt.cmd = this._cmd;
		fundoPkt.key = this._key;
		fundoPkt.seq = this._seq === 0 ? Pkt.IncrementAndGetSeq() : this._seq;
		fundoPkt.l2Value = this._value;
		fundoPkt.resetCrc();
		return fundoPkt;
	}
}

// 获取固件信息
class FirmwareInfoBuilder extends FunDoPktBuilder {
	constructor() {
		simpleLogger.logger(`FirmwareInfoBuilder`)
		super();
		this.withCmd(0x01).withKey(0x12);
	}
}

// 获取设备兼容信息
class FirmwareCompatibilityBuilder extends FunDoPktBuilder {
	constructor() {
		simpleLogger.logger(`FirmwareCompatibilityBuilder`)
		super();
		this.withCmd(0x01).withKey(0x14);
	}
}

// 查找设备
class SearchDeviceBuilder extends FunDoPktBuilder {
	constructor() {
		simpleLogger.logger(`SearchDeviceBuilder`)
		super();
		this.withCmd(0x05).withKey(0x50);
	}
}

// 查询设备电量
class QueryDeviceBatteryBuilder extends FunDoPktBuilder {
	constructor() {
		simpleLogger.logger(`QueryDeviceBatteryBuilder`)
		super();
		this.withCmd(0x04).withKey(0x40);
	}
}

// 同步数据基类
class SyncDataBuilder extends FunDoPktBuilder {
	constructor() {
		super();
		this.withCmd(0x0A).withKey(0xA0)
	}
}

// 同步计步数据
class SyncStepByStepBuilder extends SyncDataBuilder {
	constructor(date) {
		simpleLogger.logger(`SyncStepByStepBuilder: ${date}`)
		super();
		let raw = new ArrayBuffer(7);
		let rawArray = new Uint8Array(raw);
		rawArray[0] = 0x03;
		if (date instanceof Date) {
			rawArray[1] = date.getFullYear() - 2000;
			rawArray[2] = date.getMonth() + 1;
			rawArray[3] = date.getDate();
			// rawArray[4] = date.getHours();
			// rawArray[5] = date.getMinutes();
			// rawArray[6] = date.getSeconds();
			rawArray[4] = 0;
			rawArray[5] = 0;
			rawArray[6] = 0;
		} else {
			// 默认2000-01-01 00:00:00
			rawArray[1] = 0;
			rawArray[2] = 1;
			rawArray[3] = 1;
			rawArray[4] = 0;
			rawArray[5] = 0;
			rawArray[6] = 0;
		}
		this.withValue(raw);
	}
}

// 同步心率数据
class SyncHeartBeatBuilder extends SyncDataBuilder {
	constructor(date) {
		simpleLogger.logger(`SyncHeartBeatBuilder: ${date}`)
		super();
		let raw = new ArrayBuffer(7);
		let rawArray = new Uint8Array(raw);
		rawArray[0] = 0x02;
		if (date instanceof Date) {
			rawArray[1] = date.getFullYear() - 2000;
			rawArray[2] = date.getMonth() + 1;
			rawArray[3] = date.getDate();
			rawArray[4] = date.getHours();
			rawArray[5] = date.getMinutes();
			rawArray[6] = date.getSeconds();
		} else {
			// 默认2000-01-01 00:00:00
			rawArray[1] = 0;
			rawArray[2] = 1;
			rawArray[3] = 1;
			rawArray[4] = 0;
			rawArray[5] = 0;
			rawArray[6] = 0;
		}
		this.withValue(raw);
	}
}

// 同步睡眠数据
class SyncSleepBuilder extends SyncDataBuilder {
	constructor(date) {
		simpleLogger.logger(`SyncSleepBuilder: ${date}`)
		super();
		let raw = new ArrayBuffer(7);
		let rawArray = new Uint8Array(raw);
		rawArray[0] = 0x01;
		if (date instanceof Date) {
			rawArray[1] = date.getFullYear() - 2000;
			rawArray[2] = date.getMonth() + 1;
			rawArray[3] = date.getDate();
			rawArray[4] = date.getHours();
			rawArray[5] = date.getMinutes();
			rawArray[6] = date.getSeconds();
		} else {
			// 默认2000-01-01 00:00:00
			rawArray[1] = 0;
			rawArray[2] = 1;
			rawArray[3] = 1;
			rawArray[4] = 0;
			rawArray[5] = 0;
			rawArray[6] = 0;
		}
		this.withValue(raw);
	}
}

// 同步血压数据
class SyncBloodPressureBuilder extends SyncDataBuilder {
	constructor(date) {
		simpleLogger.logger(`SyncBloodPressureBuilder: ${date}`)
		super();
		let raw = new ArrayBuffer(7);
		let rawArray = new Uint8Array(raw);
		rawArray[0] = 0x05;
		if (date instanceof Date) {
			rawArray[1] = date.getFullYear() - 2000;
			rawArray[2] = date.getMonth() + 1;
			rawArray[3] = date.getDate();
			rawArray[4] = date.getHours();
			rawArray[5] = date.getMinutes();
			rawArray[6] = date.getSeconds();
		} else {
			// 默认2000-01-01 00:00:00
			rawArray[1] = 0;
			rawArray[2] = 1;
			rawArray[3] = 1;
			rawArray[4] = 0;
			rawArray[5] = 0;
			rawArray[6] = 0;
		}
		this.withValue(raw);
	}
}

// 同步血氧数据
class SyncBloodOxygenBuilder extends SyncDataBuilder {
	constructor(date) {
		simpleLogger.logger(`SyncBloodOxygenBuilder: ${date}`)
		super();
		let raw = new ArrayBuffer(7);
		let rawArray = new Uint8Array(raw);
		rawArray[0] = 0x07;
		if (date instanceof Date) {
			rawArray[1] = date.getFullYear() - 2000;
			rawArray[2] = date.getMonth() + 1;
			rawArray[3] = date.getDate();
			rawArray[4] = date.getHours();
			rawArray[5] = date.getMinutes();
			rawArray[6] = date.getSeconds();
		} else {
			// 默认2000-01-01 00:00:00
			rawArray[1] = 0;
			rawArray[2] = 1;
			rawArray[3] = 1;
			rawArray[4] = 0;
			rawArray[5] = 0;
			rawArray[6] = 0;
		}
		this.withValue(raw);
	}
}

module.exports = {
	FunDoPktBuilder: FunDoPktBuilder,
	// 获取固件信息
	FirmwareInfo: {
		builder: () => new FirmwareInfoBuilder()
	},
	// 获取固件兼容信息
	FirmwareCompatibility: {
		builder: () => new FirmwareCompatibilityBuilder()
	},
	// 查找设备
	SearchDevice: {
		builder: () => new SearchDeviceBuilder()
	},
	// 查询设备电量
	QueryDeviceBattery: {
		builder: () => new QueryDeviceBatteryBuilder()
	},
	// 同步睡眠数据
	SyncStepByStep: {
		builder: date => new SyncStepByStepBuilder(date)
	},
	// 同步心率信息
	SyncHeartBeat: {
		builder: date => new SyncHeartBeatBuilder(date)
	},
	// 同步睡眠数据
	SyncSleep: {
		builder: date => new SyncSleepBuilder(date)
	},
	// 同步血压数据
	SyncBloodPressure: {
		builder: date => new SyncBloodPressureBuilder(date)
	},
	// 同步血氧数据
	SyncBloodOxygen: {
		builder: date => new SyncBloodOxygenBuilder(date)
	},
}