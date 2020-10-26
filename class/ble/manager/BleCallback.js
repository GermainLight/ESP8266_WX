import SimpleLogger from '../../utils/SimpleLogger'
const simpleLogger = new SimpleLogger('info');

import Endian from '../../utils/Endian';

class BleCallback {

  constructor() {
    // 通用错误回调
    this.onCommonErrorCallback = err => simpleLogger.logger('default onCommonErrorCallback: ' + JSON.stringify(err));
    // 蓝牙适配器状态变化回调
    this.onBluetoothAdapterStateChangeCallback = data => simpleLogger.logger('default onBluetoothAdapterStateChangeCallback: ' + JSON.stringify(data));
    // 单个蓝牙设备发现回调
    this.onSingleBluetoothDeviceFoundCallback = data => simpleLogger.logger('default onSingleBluetoothDeviceFoundCallback: ' + JSON.stringify(data));
    // 蓝牙适配器不可用回调
    this.onBluetoothAdapterNotAvailableCallback = data => simpleLogger.logger('default onBluetoothAdapterNotAvailableCallback: ' + JSON.stringify(data));
    // 蓝牙适配器已处于发现状态回调
    this.onBluetoothAdapterAlreadyDiscoveringCallback = data => simpleLogger.logger('default onBluetoothAdapterAlreadyDiscoveringCallback: ' + JSON.stringify(data));
    // 蓝牙适配器不处于发现状态回调
    this.onBluetoothAdapterNotDiscoveringCallback = data => simpleLogger.logger('default onBluetoothAdapterNotDiscoveringCallback: ' + JSON.stringify(data));
    // 打开蓝牙适配器失败回调
    this.onOpenBluetoothAdapterFailCallback = data => simpleLogger.logger('default onOpenBluetoothAdapterFailCallback: ' + JSON.stringify(data));
    // 设备连接状态变化回调
    this.onBLEConnectionStateChangeCallback = data => simpleLogger.logger('default onBLEConnectionStateChangeCallback: ' + JSON.stringify(data));
    // 创建BLE设备连接回调
    this.onCreateBLEConnectionCallback = data => simpleLogger.logger('default onCreateBLEConnectionCallback: ' + JSON.stringify(data));
    // 关闭BLE设备连接回调
    this.onCloseBLEConnectionCallback = data => simpleLogger.logger('default onCloseBLEConnectionCallback: ' + JSON.stringify(data));
    // 获取BLE设备服务回调
    this.onGetBLEDeviceServicesCallback = data => simpleLogger.logger('default onGetBLEDeviceServicesCallback: ' + JSON.stringify(data));
    // 获取BLE设备特征回调
    this.onGetBLEDeviceCharacteristicssCallback = data => {
      simpleLogger.logger(`default onGetBLEDeviceCharacteristicssCallback: currentConnectedDeviceId: ${this.currentConnectedDeviceId}, currentConnectedDeviceRXCharacter: ${this.currentConnectedDeviceRXCharacter}, currentConnectedDeviceTXCharacter: ${this.currentConnectedDeviceTXCharacter}`);
    };
    // 蓝牙设备配对回调
    this.onMakeBluetoothPairCallback = data => simpleLogger.logger('default onMakeBluetoothPairCallback: ' + JSON.stringify(data));
    // 获取BLE设备RSSI回调
    this.onGetBLEDeviceRSSICallback = data => simpleLogger.logger('default onGetBLEDeviceRSSICallback: ' + JSON.stringify(data));
    // BLE通知消息
    this.onBLECharacteristicValueChangeCallback = data => simpleLogger.logger(`default onBLECharacteristicValueChangeCallback: deviceId: ${data.deviceId}, serviceId: ${data.serviceId}, characteristicId: ${data.characteristicId}, value: ${Endian.toHexString(data.value)}`);
    // BLE设置MTU成功回调
    this.onBLEMTUSuccessCallback = data => simpleLogger.logger('default onBLEMTUSuccessCallback: ' + JSON.stringify(data));
    // BLE设置MTU失败回调
    this.onBLEMTUFailureCallback = data => simpleLogger.logger('default onBLEMTUFailureCallback: ' + JSON.stringify(data));
    // 查找手机事件
    this.onSearchPhoneCallback = () => simpleLogger.logger('default onSearchPhoneCallback');
    // 设备电量上报事件
    this.onDeviceBatteryReportCallback = data => simpleLogger.logger(`default onDeviceBatteryReportCallback ${data}`);
  }

  // 通用错误回调
  registOnCommonErrorCallback(callback) {
    simpleLogger.logger('registOnCommonErrorCallback: ' + (callback instanceof Function));
    if (callback instanceof Function) {
      this.onCommonErrorCallback = callback;
    }
  }

  // 蓝牙适配器状态变化回调
  registOnBluetoothAdapterStateChangeCallback(callback) {
    simpleLogger.logger('registOnBluetoothAdapterStateChangeCallback: ' + (callback instanceof Function));
    if (callback instanceof Function) {
      this.onBluetoothAdapterStateChangeCallback = callback;
    }
  }

  // 单个蓝牙设备发现回调
  registOnSingleBluetoothDeviceFoundCallback(callback) {
    simpleLogger.logger('registOnSingleBluetoothDeviceFoundCallback:' + (callback instanceof Function));
    if (callback instanceof Function) {
      this.onSingleBluetoothDeviceFoundCallback = callback;
    }
  }

  // 蓝牙适配器不可用回调
  registOnBluetoothAdapterNotAvailableCallback(callback) {
    simpleLogger.logger('registOnBluetoothAdapterNotAvailableCallback:' + (callback instanceof Function));
    if (callback instanceof Function) {
      this.onBluetoothAdapterNotAvailableCallback = callback;
    }
  }

  // 蓝牙适配器已处于发现状态回调
  registOnBluetoothAdapterAlreadyDiscoveringCallback(callback) {
    simpleLogger.logger('registOnBluetoothAdapterAlreadyDiscoveringCallback:' + (callback instanceof Function));
    if (callback instanceof Function) {
      this.onBluetoothAdapterAlreadyDiscoveringCallback = callback;
    }
  }

  // 蓝牙适配器不处于发现状态回调
  registOnBluetoothAdapterNotDiscoveringCallback(callback) {
    simpleLogger.logger('registOnBluetoothAdapterNotDiscoveringCallback:' + (callback instanceof Function));
    if (callback instanceof Function) {
      this.onBluetoothAdapterNotDiscoveringCallback = callback;
    }
  }

  // 打开蓝牙适配器失败回调
  registOnOpenBluetoothAdapterFailCallback(callback) {
    simpleLogger.logger('registOnOpenBluetoothAdapterFailCallback:' + (callback instanceof Function));
    if (callback instanceof Function) {
      this.onOpenBluetoothAdapterFailCallback = callback;
    }
  }

  // 设备连接状态变化回调
  registOnBLEConnectionStateChangeCallback(callback) {
    simpleLogger.logger('registOnBLEConnectionStateChangeCallback:' + (callback instanceof Function));
    if (callback instanceof Function) {
      this.onBLEConnectionStateChangeCallback = callback;
    }
  }

  // 创建BLE设备连接回调
  registOnCreateBLEConnectionCallback(callback) {
    simpleLogger.logger('registOnCreateBLEConnectionCallback:' + (callback instanceof Function));
    if (callback instanceof Function) {
      this.onCreateBLEConnectionCallback = callback;
    }
  }

  // 关闭BLE设备连接回调
  registOnCloseBLEConnectionCallback(callback) {
    simpleLogger.logger('registOnCloseBLEConnectionCallback:' + (callback instanceof Function));
    if (callback instanceof Function) {
      this.onCloseBLEConnectionCallback = callback;
    }
  }

  // 获取BLE设备服务回调
  registOnGetBLEDeviceServicesCallback(callback) {
    simpleLogger.logger('registOnGetBLEDeviceServicesCallback:' + (callback instanceof Function));
    if (callback instanceof Function) {
      this.onGetBLEDeviceServicesCallback = callback;
    }
  }

  // 获取BLE设备服务回调
  registOnBLECharacteristicValueChangeCallback(callback) {
    simpleLogger.logger('registOnBLECharacteristicValueChangeCallback:' + (callback instanceof Function));
    if (callback instanceof Function) {
      this.onBLECharacteristicValueChangeCallback = callback;
    }
  }
  // BLE设置MTU成功回调
  registOnBLEMTUSuccessCallback(callback) {
    simpleLogger.logger('registOnBLEMTUSuccessCallback:' + (callback instanceof Function));
    if (callback instanceof Function) {
      this.onBLEMTUSuccessCallback = callback;
    }
  }
  // BLE设置MTU失败回调
  registOnBLEMTUFailureCallback(callback) {
    simpleLogger.logger('registOnBLEMTUFailureCallback:' + (callback instanceof Function));
    if (callback instanceof Function) {
      this.onBLEMTUFailureCallback = callback;
    }
  }
  // 查找手机事件
  registOnSearchPhoneCallback(callback) {
    simpleLogger.logger('registOnSearchPhoneCallback:' + (callback instanceof Function));
    if (callback instanceof Function) {
      this.onSearchPhoneCallback = callback;
    }
  }
  // 设备电量上报事件
  registOnDeviceBatteryReportCallback(callback) {
    simpleLogger.logger('registOnDeviceBatteryReportCallback:' + (callback instanceof Function));
    if (callback instanceof Function) {
      this.onDeviceBatteryReportCallback = callback;
    }
  }
}


module.exports = BleCallback;