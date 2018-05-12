//index.js
//获取应用实例
const app = getApp()

Page({
  data: {
    guidance: '摇一摇惹怒灭霸',
    imgSrc: '../../img/b_snap.png',
    motto: "🙇‍",
    userInfo: {},
    hasUserInfo: false,
    canIUse: wx.canIUse('button.open-type.getUserInfo')
  },
  onLoad: function () {
    var _this = this
    if (app.globalData.userInfo) {
      this.setData({
        userInfo: app.globalData.userInfo,
        hasUserInfo: true
      })
    } else if (this.data.canIUse){
      // 由于 getUserInfo 是网络请求，可能会在 Page.onLoad 之后才返回
      // 所以此处加入 callback 以防止这种情况
      app.userInfoReadyCallback = res => {
        this.setData({
          userInfo: res.userInfo,
          hasUserInfo: true
        })
      }
    } else {
      // 在没有 open-type=getUserInfo 版本的兼容处理
      wx.getUserInfo({
        success: res => {
          app.globalData.userInfo = res.userInfo
          this.setData({
            userInfo: res.userInfo,
            hasUserInfo: true
          })
        }
      })
    }
    
    // 定义全局变量
    var lastTime = 0; // 记录上次摇动的时间
    var x = 0,
        y = 0,
        z = 0,
        lastX = 0,
        lastY = 0,
        lastZ = 0;  // 此组变量分别记录对应x、y、z三轴的数值和上次的数值
    var shakeSpeed = 110; // 设置阈值
    // 摇一摇函数
    function shake(acceleration) {
      var nowTime = new Date().getTime(); // 记录当前时间
      if (nowTime - lastTime > 100) {
        var diffTime = nowTime - lastTime;  // 记录时间段
        lastTime = nowTime; // 记录本次摇动时间，为下次计算摇动时间做准备
        x = acceleration.x;
        y = acceleration.y;
        z = acceleration.z;
        var speed = Math.abs(x + y + z - lastX - lastY - lastZ) / diffTime * 10000;
        console.log(speed);
        if (speed > shakeSpeed) {
          wx.stopAccelerometer();
          // 振动
          wx.vibrateLong();
          // 播放音频
          wx.playBackgroundAudio({
            dataUrl: 'http://okxpzy3p1.bkt.clouddn.com/snap.mp3',
          })
          _this.setData({
            guidance: "啪！",
            imgSrc: '../../img/a_snap.png',
          })
          wx.onBackgroundAudioStop(function() {
            if (Math.round(Math.random() * 1 + 0) == 1) {
              _this.setData({
                motto: "存活"
              })
            } else {
              _this.setData({
                motto: "幻灭"
              })
            }
          })
        }
        // 重置
        lastX = x;
        lastY = y;
        lastZ = z;
      }
    }
    wx.onAccelerometerChange(shake)
  },
  onShow: function() {
    this.setData({
      guidance: '摇一摇惹怒灭霸',
      imgSrc: '../../img/b_snap.png',
      motto: "🙇‍",
    })
    wx.startAccelerometer();
  },
  getUserInfo: function(e) {
    console.log(e)
    app.globalData.userInfo = e.detail.userInfo
    this.setData({
      userInfo: e.detail.userInfo,
      hasUserInfo: true
    })
  },
})
