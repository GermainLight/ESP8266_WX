import SimpleLogger from '../../utils/SimpleLogger'
import BleCallback from './BleCallback';
import FunDoPkt from '../bean/FunDoPkt';
import Endian from '../../utils/Endian';
import FunDoDataMeta from '../bean/FunDoDataMeta';
import {
  mergeFunDoPkt
} from '../../utils/FunDoUtils';

const simpleLogger = new SimpleLogger('info');

class BleTask {
  constructor(fundoPkt, options) {
    this.fundoPkt = fundoPkt;
    this.resolvedFunDoPkt = undefined;
    this.options = options;
  }
  mergeResolvedFunDoPkt(fundoPkt) {
    this.resolvedFunDoPkt = mergeFunDoPkt(this.resolvedFunDoPkt, fundoPkt);
  }
  getResolvedFunDoPkt() {
    return this.resolvedFunDoPkt;
  }
}

class BleServerManager extends BleCallback {
  constructor() {
    super();
    this.preDefinedBroadcastServices = [
      '0000FEA0-0000-1000-8000-00805F9B34FB',
      '0000FEE7-0000-1000-8000-00805F9B34FB',
      '00002502-0000-1000-8000-00805F9B34FB',
      '00002503-0000-1000-8000-00805F9B34FB',
      '00003802-0000-1000-8000-00805F9B34FB',
      '0783B03E-8535-B5A0-7140-A304D2495CB7',
      '0783B03E-8535-B5A0-7140-A304D2495CBA',
      '0783B03E-8535-B5A0-7140-A304D2495CB8'
    ];
    this.preDefinedServiceUUIDs = ['C3E6FEA0-E966-1000-8000-BE99C223DF6A'];
    this.preDefinedRXCharacter = ['C3E6FEA2-E966-1000-8000-BE99C223DF6A'];
    this.preDefinedTXCharacter = ['C3E6FEA1-E966-1000-8000-BE99C223DF6A'];
    this.currentConnectedDeviceServices = [];
    this.currentConnectedDeviceServicesAndCharacteristics = [];
    this.currentConnectedDeviceId = undefined;
    this.currentConnectedDeviceServiceId = undefined;
    this.currentConnectedDeviceRXCharacter = undefined;
    this.currentConnectedDeviceTXCharacter = undefined;
    this._taskQueue = new Array();
  }

  // 初始化调用序列
  serialInitialize() {
    simpleLogger.logger('serialInitialize');
    this.openBluetoothAdapter();
    this.onBluetoothAdapterStateChange();
  }

  // 特征改变回调
  doReceive(value) {
    const that = this;
    if (!!!value || !(value instanceof ArrayBuffer)) {
      simpleLogger.error('receive invalid data');
      throw 'receive invalid data';
    }
    simpleLogger.logger(`doReceive: ${Endian.toHexString(value)}`);
    // 解析分动包
    const receiveFunDoPkt = FunDoPkt.parser(value);

    let array = new Array();
    let idx = 0;

    // 指令的处理
    const topTask = that._taskQueue.shift();

    // 判断是否是事件
    if (!!!topTask) {
      for (let eventKey in FunDoDataMeta.Event) {
        const eventCategory = FunDoDataMeta.Event[eventKey];
        if (eventCategory.cmd !== receiveFunDoPkt.cmd) {
          continue;
        } else {
          // 如果请求event等于预定义的请求event
          if (!!eventCategory.keys) {
            for (let keysIdx in eventCategory.keys) {
              const keyCategory = eventCategory.keys[keysIdx];
              if (keyCategory.key !== receiveFunDoPkt.key) {
                continue;
              } else {
                const responseKey = keyCategory.responseKey;
                if (typeof responseKey === 'number' && receiveFunDoPkt.key === responseKey) {
                  // 如果回响key等于预定义的回响key
                  const fields = keyCategory.fields;
                  if (!!fields && fields instanceof Array) {
                    for (let fieldIdx in fields) {
                      let {
                        byteIdx,
                        byteSize,
                        require,
                        name,
                        description,
                        repeat,
                        children
                      } = fields[fieldIdx];
                      if (!!repeat) {
                        // 重复字段处理
                        if (children instanceof Array) {
                          array = new Array();
                          for (idx = 0; byteIdx + byteSize * (idx + 1) - 1 <= receiveFunDoPkt.l2ValueArray.byteLength; idx++) {
                            let obj = {};
                            for (let childIdx in children) {
                              const childObj = children[childIdx];
                              let childByteIdx = childObj.byteIdx;
                              let childByteSize = childObj.byteSize;
                              let childRequire = childObj.require;
                              let childName = childObj.name;
                              let childDescription = childObj.description;
                              obj[childName] = Endian.Big.getUint(receiveFunDoPkt.l2ValueArray, byteIdx + byteSize * idx + childByteIdx, childByteSize)
                            }
                            array.push(obj);
                          }
                          receiveFunDoPkt[name] = array;
                        } else {
                          simpleLogger.error(`${name} defined repeat but not defined children field`);
                          throw `${name} defined repeat but not defined children field`;
                        }
                      } else {
                        // 单一字段处理
                        if (receiveFunDoPkt.l2ValueArray.byteLength >= (byteIdx + byteSize)) {
                          // 设置name字段的值
                          receiveFunDoPkt[name] = Endian.Big.getUint(receiveFunDoPkt.l2ValueArray, byteIdx, byteSize)
                        } else {
                          if (!!require) {
                            simpleLogger.error(`${name} defined require but not supply`);
                            throw `${name} defined require but not supply`;
                          }
                        }
                      }
                    }
                  }
                  // 如果回响key等于预定义的回响key
                  if (keyCategory.callback instanceof Function) {
                    keyCategory.callback(that, receiveFunDoPkt);
                    return;
                  }
                }
              }
            }
          }
        }
      }
    } else {
      const {
        fundoPkt,
        options
      } = topTask;
      // 解析指令的数据包
      for (let cmdKey in FunDoDataMeta.Order) {
        const cmdCategory = FunDoDataMeta.Order[cmdKey];
        if (cmdCategory.cmd !== fundoPkt.cmd) {
          continue;
        } else {
          // 如果请求cmd等于预定义的请求cmd
          if (!!cmdCategory.keys) {
            for (let keysIdx in cmdCategory.keys) {
              const keyCategory = cmdCategory.keys[keysIdx];
              if (keyCategory.key !== fundoPkt.key) {
                continue;
              } else {
                const responseKey = keyCategory.responseKey;
                if (typeof responseKey === 'number' && receiveFunDoPkt.key === responseKey) {
                  // 如果回响key等于预定义的回响key
                  const fields = keyCategory.fields;
                  if (!!fields && fields instanceof Array) {
                    for (let fieldIdx in fields) {
                      let {
                        byteIdx,
                        byteSize,
                        require,
                        name,
                        description,
                        repeat,
                        children
                      } = fields[fieldIdx];
                      if (!!repeat) {
                        // 重复字段处理
                        if (children instanceof Array) {
                          array = new Array();
                          for (idx = 0; byteIdx + byteSize * (idx + 1) - 1 <= receiveFunDoPkt.l2ValueArray.byteLength; idx++) {
                            let obj = {};
                            for (let childIdx in children) {
                              const childObj = children[childIdx];
                              let childByteIdx = childObj.byteIdx;
                              let childByteSize = childObj.byteSize;
                              let childRequire = childObj.require;
                              let childName = childObj.name;
                              let childDescription = childObj.description;
                              obj[childName] = Endian.Big.getUint(receiveFunDoPkt.l2ValueArray, byteIdx + byteSize * idx + childByteIdx, childByteSize)
                            }
                            array.push(obj);
                          }
                          receiveFunDoPkt[name] = array;
                        } else {
                          simpleLogger.error(`${name} defined repeat but not defined children field`);
                          throw `${name} defined repeat but not defined children field`;
                        }
                      } else {
                        // 单一字段处理
                        if (receiveFunDoPkt.l2ValueArray.byteLength >= (byteIdx + byteSize)) {
                          // 设置name字段的值
                          receiveFunDoPkt[name] = Endian.Big.getUint(receiveFunDoPkt.l2ValueArray, byteIdx, byteSize)
                        } else {
                          if (!!require) {
                            simpleLogger.error(`${name} defined require but not supply`);
                            throw `${name} defined require but not supply`;
                          }
                        }
                      }
                    }
                  }
                }
              }
            }
          }
        }
      }
      // 多包的处理
      topTask.mergeResolvedFunDoPkt(receiveFunDoPkt);
      if (fundoPkt.seq === receiveFunDoPkt.seq && receiveFunDoPkt.hasNextPkt && fundoPkt.cmd === receiveFunDoPkt.cmd) {
        that._taskQueue.unshift(topTask);
        return;
      }
      let finalFunDoPkt = topTask.getResolvedFunDoPkt();
      simpleLogger.logFunDo(`doReceive: ${JSON.stringify(finalFunDoPkt)}`);
      if (finalFunDoPkt instanceof FunDoPkt) {
        if (!!options && !!options.doReceive && options.doReceive.complete instanceof Function) {
          options.doReceive.complete(finalFunDoPkt);
        }
        if (fundoPkt.seq === finalFunDoPkt.seq) {
          if (!!options && !!options.doReceive && options.doReceive.success instanceof Function) {
            options.doReceive.success(finalFunDoPkt);
          }
        } else {
          if (!!options && !!options.doReceive && options.doReceive.failure instanceof Function) {
            options.doReceive.failure('seq not match', finalFunDoPkt);
          }
        }
      } else {
        if (!!options && !!options.doReceive && options.doReceive.failure instanceof Function) {
          options.doReceive.failure('fundoPkt not found', receiveFunDoPkt);
        }
      }
    }
  }

  // 发送FunDo数据包
  doSend(fundoPkt, options) {
    if (fundoPkt instanceof FunDoPkt) {
      simpleLogger.logFunDo('doSend', fundoPkt);
      this._taskQueue.push(new BleTask(fundoPkt, options));
      const that = this;
      wx.writeBLECharacteristicValue({
        deviceId: that.currentConnectedDeviceId,
        serviceId: that.currentConnectedDeviceServiceId,
        characteristicId: that.currentConnectedDeviceTXCharacter,
        value: fundoPkt.raw,
        success(res) {
          if (!!options && !!options.doSend && options.doSend.success instanceof Function) {
            options.doSend.success(fundoPkt);
          }
        },
        fail(err) {
          simpleLogger.logger(`doSend failure: ${Endian.toHexString(fundoPkt.raw)}, error: ${err}`);
          if (!!options && !!options.doSend && options.doSend.failure instanceof Function) {
            options.doSend.failure(err, fundoPkt);
          }
          that.onCommonErrorCallback(err, fundoPkt);
        },
        complete(res) {
          if (!!options && !!options.doReceive && options.doSend.complete instanceof Function) {
            options.doSend.complete(fundoPkt);
          }
        }
      })
    }
  }

  // 打开蓝牙适配器
  openBluetoothAdapter() {
    simpleLogger.logger('openBluetoothAdapter');
    let options = {
      mode: 'central',
      success: res => {
        simpleLogger.logger('openBluetoothAdapter success:' + JSON.stringify(res));
      },
      fail: err => {
        simpleLogger.error('openBluetoothAdapter fail: ' + JSON.stringify(err));
        this.onCommonErrorCallback(err);
      }
    }
    wx.openBluetoothAdapter(options);
  }

  // 蓝牙适配器状态监听
  onBluetoothAdapterStateChange() {
    simpleLogger.logger('onBluetoothAdapterStateChange');
    const that = this;
    wx.onBluetoothAdapterStateChange(function (res) {
      simpleLogger.logger('onBluetoothAdapterStateChange, now is: ' + JSON.stringify(res));
      if (!!res && res.available === true) {
        that.resetAllState();
      }
      that.onBluetoothAdapterStateChangeCallback(res);
    })
  }

  // BLE连接状态监听
  onBLEConnectionStateChange() {
    simpleLogger.logger('onBLEConnectionStateChange');
    const that = this;
    wx.onBLEConnectionStateChange(res => {
      simpleLogger.logger('onBLEConnectionStateChange: ' + JSON.stringify(res));
      if (!!res && !!res.deviceId) {
        if (res.connected) {
          that.currentConnectedDeviceId = res.deviceId;
        } else {
          that.resetAllState();
        }
      }
      that.onBLEConnectionStateChangeCallback(res);
    })
  }

  // 获取蓝牙适配器状态
  getBluetoothAdapterState(successCallback) {
    simpleLogger.logger('getBluetoothAdapterState');
    const that = this;
    wx.getBluetoothAdapterState({
      success(res) {
        simpleLogger.logger('getBluetoothAdapterState success:' + JSON.stringify(res));
        successCallback(res);
      },
      fail(err) {
        simpleLogger.error('getBluetoothAdapterState fail:' + JSON.stringify(err));
        that.onCommonErrorCallback(err);
      }
    })
  }

  // 开始扫描设备
  startBluetoothDevicesDiscovery(options) {
    simpleLogger.logger('startBluetoothDevicesDiscovery');
    const that = this;
    this.getBluetoothAdapterState(
      res => {
        if (!!!res.available) {
          simpleLogger.error('bluetooth adapter not available');
          if (!!options && !!!options.slient) {
            that.onBluetoothAdapterNotAvailableCallback();
          }
        }
        if (!!res.discovering) {
          simpleLogger.error('bluetooth adapter already discovering');
          if (!!options && !!!options.slient) {
            that.onBluetoothAdapterAlreadyDiscoveringCallback();
          }
        } else {
          let options = {
            // services: this.preDefinedBroadcastServices,
            success: res => {
              simpleLogger.logger('startBluetoothDevicesDiscovery success:' + JSON.stringify(res));
              wx.onBluetoothDeviceFound(function (res) {
                // simpleLogger.logger('onBluetoothDeviceFound:' + JSON.stringify(res.devices));

                // 过滤我们的设备
                for (var deviceIdx in res.devices) {
                  for (var serviceIDX in res.devices[deviceIdx].advertisServiceUUIDs) {
                    if (that.preDefinedBroadcastServices.findIndex(uuid => uuid === res.devices[deviceIdx].advertisServiceUUIDs[serviceIDX].toUpperCase()) > -1) {
                      simpleLogger.logger('onSingleBluetoothDeviceFoundCallback:' + JSON.stringify(res.devices[deviceIdx]));
                      that.onSingleBluetoothDeviceFoundCallback(res.devices[deviceIdx]);
                      break;
                    }
                  }
                }
              })
            },
            fail: err => {
              simpleLogger.error('startBluetoothDevicesDiscovery fail: ' + JSON.stringify(err));
              if (!!options && !!!options.slient) {
                that.onCommonErrorCallback(err);
              }
            }
          }
          simpleLogger.logger('startBluetoothDevicesDiscovery');
          wx.startBluetoothDevicesDiscovery(options);
        }
      })
  }

  // 停止扫描设备
  stopBluetoothDevicesDiscovery(options) {
    simpleLogger.logger('stopBluetoothDevicesDiscovery');
    const that = this;
    this.getBluetoothAdapterState(
      res => {
        if (!!!res.available) {
          simpleLogger.error('bluetooth adapter not available');
          if (!!options && !!!options.slient) {
            that.onBluetoothAdapterNotAvailableCallback();
          }
        }
        if (!!!res.discovering) {
          simpleLogger.error('bluetooth adapter not discovering');
          if (!!options && !!!options.slient) {
            that.onBluetoothAdapterNotDiscoveringCallback();
          }
        } else {
          let options = {
            success: res => {
              simpleLogger.logger('stopBluetoothDevicesDiscovery success:' + JSON.stringify(res));
            },
            fail: err => {
              simpleLogger.error('stopBluetoothDevicesDiscovery fail: ' + JSON.stringify(err));
              if (!!options && !!!options.slient) {
                that.onCommonErrorCallback(err);
              }
            }
          }
          simpleLogger.logger('stopBluetoothDevicesDiscovery');
          wx.stopBluetoothDevicesDiscovery(options);
        }
      })
  }

  // 创建BLE连接
  createBLEConnection(deviceId) {
    simpleLogger.logger('createBLEConnection');
    const that = this;
    wx.createBLEConnection({
      deviceId,
      success(res) {
        that.currentConnectedDeviceId = deviceId;
        // that.makeBluetoothPair();
        that.getBLEDeviceRSSI();
        that.getBLEDeviceServices();
      },
      fail(err) {
        that.onCommonErrorCallback(err);
      },
      complete(res) {
        that.onCreateBLEConnectionCallback(res);
      },
    })
  }

  // 关闭BLE连接
  closeBLEConnection() {
    simpleLogger.logger('closeBLEConnection');
    const that = this;
    if (!!that.currentConnectedDeviceId) {
      wx.createBLEConnection({
        deviceId: that.currentConnectedDeviceId,
        success(res) {
          that.currentConnectedDeviceId = undefined;
        },
        fail(err) {
          that.onCommonErrorCallback(err);
        },
        complete(res){
          that.onCloseBLEConnectionCallback(res);
        }
      })
    }
  }

  // 获取设备服务列表
  getBLEDeviceServices() {
    simpleLogger.logger('getBLEDeviceServices');
    if (!!this.currentConnectedDeviceId) {
      const that = this;
      wx.getBLEDeviceServices({
        deviceId: that.currentConnectedDeviceId,
        success(res) {
          simpleLogger.logger(`getBLEDeviceServices deviceId: ${that.currentConnectedDeviceId}, services: ${JSON.stringify(res.services)}`);
          that.currentConnectedDeviceServices = res.services;
          that.onGetBLEDeviceServicesCallback(res.services);
          that.getAllBLEDeviceCharacteristics();
        },
        fail(err) {
          that.onCommonErrorCallback(err);
        }
      })
    }
  }

  // 注册特征改变回调
  notifyBLECharacteristicValueChange() {
    simpleLogger.logger('notifyBLECharacteristicValueChange');
    const that = this;
    wx.notifyBLECharacteristicValueChange({
      deviceId: that.currentConnectedDeviceId,
      serviceId: that.currentConnectedDeviceServiceId,
      characteristicId: that.currentConnectedDeviceRXCharacter,
      state: true,
      success(res) {
        simpleLogger.logger(`notifyBLECharacteristicValueChange success: deviceId: ${that.currentConnectedDeviceId}, serviceId: ${that.currentConnectedDeviceServiceId}, characteristics： ${that.currentConnectedDeviceRXCharacter}`);
        wx.onBLECharacteristicValueChange(res => {
          that.doReceive(res.value);
        })
      },
      fail(err) {
        simpleLogger.error(`notifyBLECharacteristicValueChange error: deviceId: ${that.currentConnectedDeviceId}, serviceId: ${that.currentConnectedDeviceServiceId}, characteristics： ${that.currentConnectedDeviceRXCharacter}`);
        that.onCommonErrorCallback(err);
      }
    });
  }

  // 获取当前设备的所有特征列表
  getAllBLEDeviceCharacteristics() {
    if (!!this.currentConnectedDeviceId) {
      const that = this;
      for (var serviceIdx in that.currentConnectedDeviceServices) {
        const currentService = that.currentConnectedDeviceServices[serviceIdx];
        if (that.preDefinedServiceUUIDs.findIndex(uuid => currentService.uuid.toUpperCase() === uuid) > -1) {
          simpleLogger.logger(`getBLEDeviceCharacteristics： deviceId: ${that.currentConnectedDeviceId}, serviceId: ${currentService.uuid}`);
          wx.getBLEDeviceCharacteristics({
            deviceId: that.currentConnectedDeviceId,
            serviceId: currentService.uuid,
            success(res) {
              simpleLogger.logger(`getBLEDeviceCharacteristics： deviceId: ${that.currentConnectedDeviceId}, serviceId: ${currentService.uuid}, characteristics： ${JSON.stringify(res.characteristics)}`);
              that.currentConnectedDeviceServicesAndCharacteristics[currentService] = res.characteristics;
              that.currentConnectedDeviceServiceId = currentService.uuid;
              for (var characteristicsIdx in res.characteristics) {
                const currentCharacteristic = res.characteristics[characteristicsIdx];
                if (that.preDefinedRXCharacter.findIndex(uuid => currentCharacteristic.uuid.toUpperCase() === uuid) > -1) {
                  that.currentConnectedDeviceRXCharacter = currentCharacteristic.uuid;
                  if (!!currentCharacteristic.properties.notify) {
                    that.notifyBLECharacteristicValueChange();
                  }
                }
                if (that.preDefinedTXCharacter.findIndex(uuid => currentCharacteristic.uuid.toUpperCase() === uuid) > -1) {
                  that.currentConnectedDeviceTXCharacter = currentCharacteristic.uuid;
                }
              }
              simpleLogger.logger(`getAllBLEDeviceCharacteristics: currentConnectedDeviceId: ${that.currentConnectedDeviceId}, currentConnectedDeviceRXCharacter: ${that.currentConnectedDeviceRXCharacter}, currentConnectedDeviceTXCharacter: ${that.currentConnectedDeviceTXCharacter}`);
              that.onGetBLEDeviceCharacteristicssCallback(res.characteristics);
            },
            fail(err) {
              that.onCommonErrorCallback(err);
            }
          });
        }
      }
    }
  }

  // 蓝牙配对
  makeBluetoothPair() {
    simpleLogger.logger('makeBluetoothPair');
    if (!!this.currentConnectedDeviceId) {
      const that = this;
      wx.makeBluetoothPair({
        deviceId: that.currentConnectedDeviceId,
        timeout: 20,
        success(res) {
          that.onMakeBluetoothPairCallback(res);
        },
        fail(err) {
          that.onCommonErrorCallback(err);
        }
      })
    }
  }

  // 获取RSSI
  getBLEDeviceRSSI() {
    simpleLogger.logger('getBLEDeviceRSSI');
    if (!!this.currentConnectedDeviceId) {
      const that = this;
      wx.getBLEDeviceRSSI({
        deviceId: that.currentConnectedDeviceId,
        success(res) {
          that.onGetBLEDeviceRSSICallback(res);
        },
        fail(err) {
          that.onCommonErrorCallback(err);
        }
      })
    }
  }

  // 设置MTU
  setBLEMTU(mtuSize) {
    if (typeof mtuSize === 'number') {
      const that = this;
      // MTU - 3 是多次尝试的结果，如非必要，勿修改
      wx.setBLEMTU({
        deviceId: that.currentConnectedDeviceId,
        mtu: mtuSize > 3 ? mtuSize - 3 : mtuSize,
        success(res) {
          simpleLogger.logger("setBLEMTU success")
          that.onBLEMTUSuccessCallback(res);
        },
        fail(err) {
          simpleLogger.logger("setBLEMTU success")
          that.onBLEMTUFailureCallback(err);
        },
      })
    }
  }

  // 重置所有状态
  resetAllState() {
    this.currentConnectedDeviceServices = [];
    this.currentConnectedDeviceServicesAndCharacteristics = [];
    this.currentConnectedDeviceId = undefined;
    this.currentConnectedDeviceServiceId = undefined;
    this.currentConnectedDeviceRXCharacter = undefined;
    this.currentConnectedDeviceTXCharacter = undefined;
  }

}

module.exports = BleServerManager