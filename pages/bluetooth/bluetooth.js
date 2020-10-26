Page({

  /**
   * 页面的初始数据
   */
  data: {
    bluetoothAdapterDiscovering: false,
    foundDevices: Array()
  },
  startScanBleDevice: function (options) {
    getApp().globalData.simpleLogger.logger('startScanBleDevice');
    wx.showNavigationBarLoading();
    getApp().globalData.bleServerManager.startBluetoothDevicesDiscovery();
    setTimeout(() => {
      wx.hideNavigationBarLoading();
      getApp().globalData.bleServerManager.stopBluetoothDevicesDiscovery({
        slient: true
      });
    }, 10000)
  },
  stopScanBleDevice: function (options) {
    getApp().globalData.simpleLogger.logger('stopScanBleDevice');
    wx.hideNavigationBarLoading();
    getApp().globalData.bleServerManager.stopBluetoothDevicesDiscovery();
  },
  onConnectDevice: function (ele) {
    if (!!!ele || !!!ele.currentTarget || !!!ele.currentTarget.dataset || !!!ele.currentTarget.dataset.deviceid) {
      getApp().globalData.simpleLogger.error("deviceId not found");
      wx.showToast({
        title: '设别MAC未找到',
        icon: 'none',
        duration: 2000
      });
    }
    wx.showNavigationBarLoading();
    getApp().globalData.bleServerManager.createBLEConnection(ele.currentTarget.dataset.deviceid);
    this.stopScanBleDevice();
  },
  onLoad: function (options) {},
  onReady: function () {},
  onShow: function () {
    getApp().globalData.bleServerManager.registOnBluetoothAdapterStateChangeCallback(res => {
      if (!!!res.available) {
        getApp().globalData.simpleLogger.logger('error', 'bluetooth adapter not available');
        wx.showToast({
          title: '蓝牙适配器不可用',
          icon: 'none',
          duration: 2000
        });
      } else {
        this.setData({
          bluetoothAdapterDiscovering: !!res.discovering
        })
      }
    });
    getApp().globalData.bleServerManager.registOnSingleBluetoothDeviceFoundCallback(res => {
      let tmpFoundDevices = this.data.foundDevices;
      if (tmpFoundDevices.findIndex(dev => !!dev && !!res && dev.deviceId === res.deviceId) === -1) {
        tmpFoundDevices.push(res);
        this.setData({
          foundDevices: JSON.parse(JSON.stringify(tmpFoundDevices))
        })
      }
    });
    this.startScanBleDevice();
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