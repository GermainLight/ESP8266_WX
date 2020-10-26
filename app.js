import SimpleLogger from './class/utils/SimpleLogger'
const simpleLogger = new SimpleLogger('info');

import BleServerManager from './class/ble/manager/BleServerManager';
const bleServerManager = new BleServerManager();

App({
  onLaunch: function () {
    // 注册相关回调
    bleServerManager.registOnCommonErrorCallback(err => {
      simpleLogger.error(err);
      switch (err.errCode) {
        case 0:
          wx.showToast({
            title: '操作成功',
            icon: 'none',
            duration: 2000
          });
          break;
        case -1:
          wx.showToast({
            title: '设备已连接',
            icon: 'none',
            duration: 2000
          });
          break;
        case 10000:
          wx.showToast({
            title: '未初始化蓝牙适配器',
            icon: 'none',
            duration: 2000
          });
          break;
        case 10001:
          wx.showToast({
            title: '当前蓝牙适配器不可用',
            icon: 'none',
            duration: 2000
          });
          break;
        case 10002:
          wx.showToast({
            title: '没有找到指定设备',
            icon: 'none',
            duration: 2000
          });
          break;
        case 10003:
          wx.showToast({
            title: '连接失败',
            icon: 'none',
            duration: 2000
          });
          break;
        case 10004:
          wx.showToast({
            title: '没有找到指定服务',
            icon: 'none',
            duration: 2000
          });
          break;
        case 10005:
          wx.showToast({
            title: '没有找到指定特征值',
            icon: 'none',
            duration: 2000
          });
          break;
        case 10006:
          wx.showToast({
            title: '当前连接已断开',
            icon: 'none',
            duration: 2000
          });
          break;
        case 10007:
          wx.showToast({
            title: '当前特征值不支持此操作',
            icon: 'none',
            duration: 2000
          });
          break;
        case 10008:
          wx.showToast({
            title: '其余所有系统上报的异常',
            icon: 'none',
            duration: 2000
          });
          break;
        case 10009:
          wx.showToast({
            title: '系统版本低于 4.3 不支持 BLE',
            icon: 'none',
            duration: 2000
          });
          break;
        case 10012:
          wx.showToast({
            title: '连接超时',
            icon: 'none',
            duration: 2000
          });
          break;
        case 10013:
          wx.showToast({
            title: '连接 deviceId 为空或者是格式不正确',
            icon: 'none',
            duration: 2000
          });
          break;
        default:
          wx.showToast({
            title: '未知错误',
            icon: 'none',
            duration: 2000
          });
          break;

      }
    });
    bleServerManager.registOnOpenBluetoothAdapterFailCallback(() => {
      wx.showToast({
        title: '蓝牙适配器打开失败',
        icon: 'none',
        duration: 2000
      });
    });
    bleServerManager.registOnBluetoothAdapterNotAvailableCallback(() => {
      wx.showToast({
        title: '蓝牙适配器不可用',
        icon: 'none',
        duration: 2000
      });
    });
    bleServerManager.registOnBluetoothAdapterAlreadyDiscoveringCallback(() => {
      wx.showToast({
        title: '正在搜索设备',
        icon: 'none',
        duration: 2000
      });
    });
    bleServerManager.registOnBluetoothAdapterNotAvailableCallback(() => {
      wx.showToast({
        title: '停止搜索设备',
        icon: 'none',
        duration: 2000
      });
    });
    bleServerManager.registOnBLEConnectionStateChangeCallback(res => {
      simpleLogger.logger(`device ${res.deviceId} state has changed, connected: ${res.connected}`);
    });
    bleServerManager.registOnCreateBLEConnectionCallback(res => {
      wx.hideNavigationBarLoading();
      if (!!res && res.errCode === 0) {
        wx.showToast({
          title: '连接设备成功',
          icon: 'none',
          duration: 2000
        })
        wx.redirectTo({
          url: '/pages/home/home',
        })
      } else {
        simpleLogger.error(res);
        wx.showToast({
          title: '连接设备失败',
          icon: 'none',
          duration: 2000
        })
        wx.redirectTo({
          url: '/pages/bluetooth/bluetooth',
        })
      }
    });
    bleServerManager.registOnCloseBLEConnectionCallback(res => {
      if (!!res && res.errCode === 0) {
        wx.showToast({
          title: '断开设备成功',
          icon: 'none',
          duration: 2000
        })
        wx.redirectTo({
          url: '/pages/bluetooth/bluetooth',
        })
      } else {
        simpleLogger.error(res);
        wx.showToast({
          title: '连接设备失败',
          icon: 'none',
          duration: 2000
        })
        wx.redirectTo({
          url: '/pages/bluetooth/bluetooth',
        })
      }
    });
    bleServerManager.serialInitialize();

    // // 展示本地存储能力
    // var logs = wx.getStorageSync('logs') || []
    // logs.unshift(Date.now())
    // wx.setStorageSync('logs', logs)

    // // 登录
    // wx.login({
    //   success: res => {
    //     // 发送 res.code 到后台换取 openId, sessionKey, unionId
    //   }
    // })
    // // 获取用户信息
    // wx.getSetting({
    //   success: res => {
    //     if (res.authSetting['scope.userInfo']) {
    //       // 已经授权，可以直接调用 getUserInfo 获取头像昵称，不会弹框
    //       wx.getUserInfo({
    //         success: res => {
    //           // 可以将 res 发送给后台解码出 unionId
    //           this.globalData.userInfo = res.userInfo

    //           // 由于 getUserInfo 是网络请求，可能会在 Page.onLoad 之后才返回
    //           // 所以此处加入 callback 以防止这种情况
    //           if (this.userInfoReadyCallback) {
    //             this.userInfoReadyCallback(res)
    //           }
    //         }
    //       })
    //     }
    //   }
    // })
  },
  globalData: {
    bleServerManager: bleServerManager,
    simpleLogger: simpleLogger,
    userInfo: null
  }
})