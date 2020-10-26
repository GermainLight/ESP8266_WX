import FunDoPktBuilder from '../../class/ble/bean/FunDoPktBuilder';
import Endian from '../../class/utils/Endian';
import FunDoPkt from '../../class/ble/bean/FunDoPkt';

const app = getApp();
const bleServerManager = app.globalData.bleServerManager;
const simpleLogger = app.globalData.simpleLogger;

Page({
  data: {
    messages: []
  },
  appendMessage(title, type, pkt) {
    const that = this;
    if (pkt instanceof FunDoPkt) {
      let tmpMessages = that.data.messages;
      if (type === 'send') {
        tmpMessages.push({
          'title': title,
          'type': 'send',
          'cmd': that.displayFormat(pkt.cmd),
          'key': that.displayFormat(pkt.key),
          'seq': that.displayFormat(pkt.seq),
          'payload': that.displayFormat(pkt.l2ValueArray),
          'raw': that.displayFormat(pkt.raw)
        });
      } else if (type === 'receive') {
        tmpMessages.push({
          'title': title,
          'type': 'receive',
          'cmd': that.displayFormat(pkt.cmd),
          'key': that.displayFormat(pkt.key),
          'seq': that.displayFormat(pkt.seq),
          'payload': that.displayFormat(pkt.l2ValueArray),
          'raw': that.displayFormat(pkt.raw)
        });
      }
      this.setData({
        messages: JSON.parse(JSON.stringify(tmpMessages))
      })
    }
  },
  displayFormat(data) {
    if (typeof data === 'number') {
      let hex = data.toString(16);
      return hex.length % 2 === 1 ? '0x0' + hex : '0x' + hex;
    }
    if (data instanceof ArrayBuffer || data instanceof Uint8Array) {
      return Endian.toHexString(data);
    }
  },
  onQueryFramwareInfo() {
    const that = this;
    bleServerManager.doSend(FunDoPktBuilder.FirmwareInfo.builder().build(), {
      doSend: {
        success: pkt => that.appendMessage('QueryFramwareInfo', 'send', pkt),
        failure: (err, pkt) => that.appendMessage('QueryFramwareInfo', 'send', pkt)
      },
      doReceive: {
        success: pkt => that.appendMessage('QueryFramwareInfo', 'receive', pkt),
        failure: (err, pkt) => that.appendMessage('QueryFramwareInfo', 'receive', pkt)
      }
    });
  },
  onQueryFramwareCompatibility() {
    const that = this;
    bleServerManager.doSend(FunDoPktBuilder.FirmwareCompatibility.builder().build(), {
      doSend: {
        success: pkt => that.appendMessage('QueryFramwareCompatibility', 'send', pkt),
        failure: (err, pkt) => that.appendMessage('QueryFramwareCompatibility', 'send', pkt)
      },
      doReceive: {
        success: pkt => {
          that.appendMessage('QueryFramwareCompatibility', 'receive', pkt);
          if (!!pkt.mtuSize && typeof pkt.mtuSize === 'number') {
            bleServerManager.setBLEMTU(pkt.mtuSize);
          }
        },
        failure: (err, pkt) => that.appendMessage('QueryFramwareCompatibility', 'receive', pkt)
      }
    });
  },
  onSearchDevice() {
    const that = this;
    bleServerManager.doSend(FunDoPktBuilder.SearchDevice.builder().build(), {
      doSend: {
        success: pkt => that.appendMessage('SearchDevice', 'send', pkt),
        failure: (err, pkt) => that.appendMessage('SearchDevice', 'send', pkt)
      },
      doReceive: {
        success: pkt => {
          that.appendMessage('SearchDevice', 'receive', pkt);
        },
        failure: (err, pkt) => that.appendMessage('SearchDevice', 'receive', pkt)
      }
    });
  },
  onQueryDeviceBattery() {
    const that = this;
    bleServerManager.doSend(FunDoPktBuilder.QueryDeviceBattery.builder().build(), {
      doSend: {
        success: pkt => that.appendMessage('QueryDeviceBattery', 'send', pkt),
        failure: (err, pkt) => that.appendMessage('QueryDeviceBattery', 'send', pkt)
      },
      doReceive: {
        success: pkt => {
          that.appendMessage('QueryDeviceBattery', 'receive', pkt);
        },
        failure: (err, pkt) => that.appendMessage('QueryDeviceBattery', 'receive', pkt)
      }
    });
  },
  onSyncStepByStep(e) {
    let date = new Date();
    try {
      date = new Date(e.detail.value);
    } catch (err) {}
    const that = this;
    bleServerManager.doSend(FunDoPktBuilder.SyncStepByStep.builder(date).build(), {
      doSend: {
        success: pkt => that.appendMessage('SyncStepByStep', 'send', pkt),
        failure: (err, pkt) => that.appendMessage('SyncStepByStep', 'send', pkt)
      },
      doReceive: {
        success: pkt => that.appendMessage('SyncStepByStep', 'receive', pkt),
        failure: (err, pkt) => that.appendMessage('SyncStepByStep', 'receive', pkt)
      }
    });
  },
  onSyncHeartBeat(e) {
    let date = new Date();
    try {
      date = new Date(e.detail.value);
    } catch (err) {}
    const that = this;
    bleServerManager.doSend(FunDoPktBuilder.SyncHeartBeat.builder(date).build(), {
      doSend: {
        success: pkt => that.appendMessage('SyncHeartBeat', 'send', pkt),
        failure: (err, pkt) => that.appendMessage('SyncHeartBeat', 'send', pkt)
      },
      doReceive: {
        success: pkt => that.appendMessage('SyncHeartBeat', 'receive', pkt),
        failure: (err, pkt) => that.appendMessage('SyncHeartBeat', 'receive', pkt)
      }
    });
  },
  onSyncSleep(e) {
    let date = new Date();
    try {
      date = new Date(e.detail.value);
    } catch (err) {}
    const that = this;
    bleServerManager.doSend(FunDoPktBuilder.SyncSleep.builder(date).build(), {
      doSend: {
        success: pkt => that.appendMessage('SyncSleep', 'send', pkt),
        failure: (err, pkt) => that.appendMessage('SyncSleep', 'send', pkt)
      },
      doReceive: {
        success: pkt => that.appendMessage('SyncSleep', 'receive', pkt),
        failure: (err, pkt) => that.appendMessage('SyncSleep', 'receive', pkt)
      }
    });
  },
  onSyncBloodPressure() {
    const that = this;
    bleServerManager.doSend(FunDoPktBuilder.SyncBloodPressure.builder().build(), {
      doSend: {
        success: pkt => that.appendMessage('SyncBloodPressure', 'send', pkt),
        failure: (err, pkt) => that.appendMessage('SyncBloodPressure', 'send', pkt)
      },
      doReceive: {
        success: pkt => that.appendMessage('SyncBloodPressure', 'receive', pkt),
        failure: (err, pkt) => that.appendMessage('SyncBloodPressure', 'receive', pkt)
      }
    });
  },
  onSyncBloodOxygen() {
    const that = this;
    bleServerManager.doSend(FunDoPktBuilder.SyncBloodOxygen.builder().build(), {
      doSend: {
        success: pkt => that.appendMessage('SyncBloodOxygen', 'send', pkt),
        failure: (err, pkt) => that.appendMessage('SyncBloodOxygen', 'send', pkt)
      },
      doReceive: {
        success: pkt => that.appendMessage('SyncBloodOxygen', 'receive', pkt),
        failure: (err, pkt) => that.appendMessage('SyncBloodOxygen', 'receive', pkt)
      }
    });
  },
  onCloseBLEConnection() {
    bleServerManager.closeBLEConnection();
  },
  onLoad: function (options) {

  },
  onReady: function () {

  },
  onShow: function () {

  },
  onHide: function () {

  },
  onUnload: function () {

  },
  onPullDownRefresh: function () {

  },
  onReachBottom: function () {

  },
  onShareAppMessage: function () {

  }
})