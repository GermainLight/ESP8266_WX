const FunDoDataMeta = {
	Order: {
		Command: {
			cmd: 0x01,
			desc: '固件升级命令',
			keys: [{
				key: 0x12,
				desc: '固件信息查询',
				responseKey: 0x13,
				fields: [{
					byteIdx: 0,
					byteSize: 3,
					require: false,
					name: 'applicationVersion',
					description: 'Major version,Minor version,Revision number'
				}, {
					byteIdx: 3,
					byteSize: 1,
					require: false,
					name: 'upgradePlatform',
					description: '0:Nordic,1–Dialog,2–2502,3–android,4:BK,5:Pixart'
				}, {
					byteIdx: 4,
					byteSize: 3,
					require: false,
					name: 'serialNumber',
					description: '0:YDS-1,1:B22-066-1,2:B22-091-0,3:B22-091-1,4:B80-042-H2,5:B80-049-1,6:B80-049-2,7:B22-066-7,8:B80-042-M2,9:SW80,10:B22-066-3,11:SW808S-0.91,12：B80-042-Y2,13:B80-087,14:B80-042-Y2-33,15:B80-042-Y2-LCD1106,16:M2,17:B22-066-X9MINI-1,18:B80-042-H2CF(iBeacon),19:B22-066-H01,20:B80-042-QS80'
				}, {
					byteIdx: 7,
					byteSize: 4,
					require: false,
					name: 'protocolVersion',
					description: ''
				}]
			}, {
				key: 0x14,
				desc: '固件兼容信息查询',
				responseKey: 0x15,
				fields: [{
					byteIdx: 0,
					byteSize: 1,
					require: false,
					name: 'informtionLength',
					description: ''
				}, {
					byteIdx: 1,
					byteSize: 2,
					require: false,
					name: 'mtuSize',
					description: ''
				}, {
					byteIdx: 3,
					byteSize: 1,
					require: false,
					name: 'agps',
					description: ''
				}, {
					byteIdx: 4,
					byteSize: 1,
					require: false,
					name: 'weather',
					description: ''
				}, {
					byteIdx: 5,
					byteSize: 1,
					require: false,
					name: 'flashUpdateResponse',
					description: ''
				}]
			}]
		},
		Device: {
			cmd: 0x04,
			desc: '设备指令',
			keys: [{
				key: 0x40,
				desc: '设备电量',
				responseKey: 0x41,
				fields: [{
					byteIdx: 0,
					byteSize: 1,
					require: false,
					name: 'batteryPercentage',
					description: ''
				}, {
					byteIdx: 1,
					byteSize: 1,
					require: false,
					name: 'batteryState',
					description: ''
				}]
			}]
		},
		Sync: {
			cmd: 0x0A,
			desc: '同步数据命令',
			keys: [{
				key: 0xA0,
				desc: '同步睡眠数据',
				responseKey: 0xA2,
				fields: [{
					byteIdx: 0,
					byteSize: 1,
					require: false,
					name: 'year',
					description: ''
				}, {
					byteIdx: 1,
					byteSize: 1,
					require: false,
					name: 'month',
					description: ''
				}, {
					byteIdx: 2,
					byteSize: 1,
					require: false,
					name: 'day',
					description: ''
				}, {
					byteIdx: 3,
					byteSize: 3,
					require: false,
					repeat: true,
					name: 'sleeps',
					description: '',
					children: [{
						byteIdx: 0,
						byteSize: 1,
						require: false,
						name: 'type',
						description: '0:未进入睡眠,1轻度睡眠,2深度睡眠,3:快速眼动期'
					}, {
						byteIdx: 1,
						byteSize: 1,
						require: false,
						name: 'start',
						description: ''
					}, {
						byteIdx: 2,
						byteSize: 1,
						require: false,
						name: 'end',
						description: ''
					}]
				}]
			}, {
				key: 0xA0,
				desc: '同步计步数据',
				responseKey: 0xA3,
				fields: [{
					byteIdx: 0,
					byteSize: 1,
					require: false,
					name: 'year',
					description: ''
				}, {
					byteIdx: 1,
					byteSize: 1,
					require: false,
					name: 'month',
					description: ''
				}, {
					byteIdx: 2,
					byteSize: 1,
					require: false,
					name: 'day',
					description: ''
				}, {
					byteIdx: 3,
					byteSize: 1,
					require: false,
					name: 'hour',
					description: ''
				}, {
					byteIdx: 4,
					byteSize: 96,
					require: false,
					repeat: true,
					name: 'stepBySteps',
					description: '',
					children: [{
						byteIdx: 0,
						byteSize: 4,
						require: false,
						name: '0',
						description: '步数(0点)'
					}, {
						byteIdx: 4,
						byteSize: 4,
						require: false,
						name: '1',
						description: '步数(1点)'
					}, {
						byteIdx: 8,
						byteSize: 4,
						require: false,
						name: '2',
						description: '步数(2点)'
					}, {
						byteIdx: 12,
						byteSize: 4,
						require: false,
						name: '3',
						description: '步数(3点)'
					}, {
						byteIdx: 16,
						byteSize: 4,
						require: false,
						name: '4',
						description: '步数(4点)'
					}, {
						byteIdx: 20,
						byteSize: 4,
						require: false,
						name: '5',
						description: '步数(5点)'
					}, {
						byteIdx: 24,
						byteSize: 4,
						require: false,
						name: '6',
						description: '步数(6点)'
					}, {
						byteIdx: 28,
						byteSize: 4,
						require: false,
						name: '7',
						description: '步数(7点)'
					}, {
						byteIdx: 32,
						byteSize: 4,
						require: false,
						name: '8',
						description: '步数(8点)'
					}, {
						byteIdx: 36,
						byteSize: 4,
						require: false,
						name: '9',
						description: '步数(9点)'
					}, {
						byteIdx: 40,
						byteSize: 4,
						require: false,
						name: '10',
						description: '步数(10点)'
					}, {
						byteIdx: 44,
						byteSize: 4,
						require: false,
						name: '11',
						description: '步数(11点)'
					}, {
						byteIdx: 48,
						byteSize: 4,
						require: false,
						name: '12',
						description: '步数(12点)'
					}, {
						byteIdx: 52,
						byteSize: 4,
						require: false,
						name: '13',
						description: '步数(13点)'
					}, {
						byteIdx: 56,
						byteSize: 4,
						require: false,
						name: '14',
						description: '步数(14点)'
					}, {
						byteIdx: 60,
						byteSize: 4,
						require: false,
						name: '15',
						description: '步数(15点)'
					}, {
						byteIdx: 64,
						byteSize: 4,
						require: false,
						name: '16',
						description: '步数(16点)'
					}, {
						byteIdx: 68,
						byteSize: 4,
						require: false,
						name: '17',
						description: '步数(17点)'
					}, {
						byteIdx: 72,
						byteSize: 4,
						require: false,
						name: '18',
						description: '步数(18点)'
					}, {
						byteIdx: 76,
						byteSize: 4,
						require: false,
						name: '19',
						description: '步数(19点)'
					}, {
						byteIdx: 80,
						byteSize: 4,
						require: false,
						name: '20',
						description: '步数(20点)'
					}, {
						byteIdx: 84,
						byteSize: 4,
						require: false,
						name: '21',
						description: '步数(21点)'
					}, {
						byteIdx: 88,
						byteSize: 4,
						require: false,
						name: '22',
						description: '步数(22点)'
					}, {
						byteIdx: 92,
						byteSize: 4,
						require: false,
						name: '23',
						description: '步数(23点)'
					}]
				}]
			}, {
				key: 0xA0,
				desc: '同步心率数据',
				responseKey: 0xA4,
				fields: [{
					byteIdx: 0,
					byteSize: 7,
					name: 'heartBeats',
					repeat: true,
					description: '',
					children: [{
						byteIdx: 0,
						byteSize: 1,
						require: false,
						name: 'year',
						description: ''
					}, {
						byteIdx: 1,
						byteSize: 1,
						require: false,
						name: 'month',
						description: ''
					}, {
						byteIdx: 2,
						byteSize: 1,
						require: false,
						name: 'day',
						description: ''
					}, {
						byteIdx: 3,
						byteSize: 1,
						require: false,
						name: 'hour',
						description: ''
					}, {
						byteIdx: 4,
						byteSize: 1,
						require: false,
						name: 'minute',
						description: ''
					}, {
						byteIdx: 5,
						byteSize: 1,
						require: false,
						name: 'second',
						description: ''
					}, {
						byteIdx: 6,
						byteSize: 1,
						require: false,
						name: 'heartBeat',
						description: ''
					}]
				}]
			}, {
				key: 0xA0,
				desc: '同步血压数据',
				responseKey: 0xAD,
				fields: [{
					byteIdx: 0,
					byteSize: 8,
					require: false,
					repeat: true,
					name: 'bloodPressures',
					children: [{
						byteIdx: 0,
						byteSize: 1,
						require: false,
						name: 'year',
						description: ''
					}, {
						byteIdx: 1,
						byteSize: 1,
						require: false,
						name: 'month',
						description: ''
					}, {
						byteIdx: 2,
						byteSize: 1,
						require: false,
						name: 'day',
						description: ''
					}, {
						byteIdx: 3,
						byteSize: 1,
						require: false,
						name: 'hour',
						description: ''
					}, {
						byteIdx: 4,
						byteSize: 1,
						require: false,
						name: 'minute',
						description: ''
					}, {
						byteIdx: 5,
						byteSize: 1,
						require: false,
						name: 'second',
						description: ''
					}, {
						byteIdx: 6,
						byteSize: 1,
						require: false,
						name: 'systolicPressure',
						description: ''
					}, {
						byteIdx: 7,
						byteSize: 1,
						require: false,
						name: 'diastolicPressure',
						description: ''
					}]
				}]
			}, {
				key: 0xA0,
				desc: '同步血氧数据',
				responseKey: 0xAF,
				fields: [{
					byteIdx: 0,
					byteSize: 7,
					require: false,
					repeat: true,
					name: 'bloodOxygens',
					children: [{
						byteIdx: 0,
						byteSize: 1,
						require: false,
						name: 'year',
						description: ''
					}, {
						byteIdx: 1,
						byteSize: 1,
						require: false,
						name: 'month',
						description: ''
					}, {
						byteIdx: 2,
						byteSize: 1,
						require: false,
						name: 'day',
						description: ''
					}, {
						byteIdx: 3,
						byteSize: 1,
						require: false,
						name: 'hour',
						description: ''
					}, {
						byteIdx: 4,
						byteSize: 1,
						require: false,
						name: 'minute',
						description: ''
					}, {
						byteIdx: 5,
						byteSize: 1,
						require: false,
						name: 'second',
						description: ''
					}, {
						byteIdx: 6,
						byteSize: 1,
						require: false,
						name: 'bloodOxygen',
						description: ''
					}]
				}]
			}]
		},
	},
	Event: {
		Device: {
			cmd: 0x04,
			desc: '设备指令',
			keys: [{
				key: 0x41,
				desc: '设备电量',
				responseKey: 0x41,
				fields: [{
					byteIdx: 0,
					byteSize: 1,
					require: false,
					name: 'batteryPercentage',
					description: ''
				}, {
					byteIdx: 1,
					byteSize: 1,
					require: false,
					name: 'batteryState',
					description: ''
				}],
				callback: (bleCallback, data) => {
					if (!!bleCallback && bleCallback.onDeviceBatteryReportCallback instanceof Function) {
						bleCallback.onDeviceBatteryReportCallback(data)
					}
				}
			}]
		},
		Search: {
			cmd: 0x05,
			desc: '查找命令',
			keys: [{
				key: 0x51,
				desc: '查找手机',
				responseKey: 0x51,
				callback: (bleCallback, data) => {
					if (!!bleCallback && bleCallback.onSearchPhoneCallback instanceof Function) {
						bleCallback.onSearchPhoneCallback(data)
					}
				}
			}]
		}
	}
}

module.exports = FunDoDataMeta;