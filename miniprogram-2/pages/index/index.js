//获取应用实例
const app = getApp()

Page({
  data: {
    motto: 'Hello World',
    bnrUrl: [{
      headImage: "http://imagetest.ovuems.com/20190911135610732_369.jpg",
      id: 1,
      endImage: "http://imagetest.ovuems.com/20190911135616938_360.jpg",
      title: '前情提要|万众期待的2019中国电子i"+网络安全创新创业大赛总决赛即将来袭',
      date: "2019-09-10 00:00:00"
    }, {
      headImage: "http://imagetest.ovuems.com/20190911135610732_369.jpg",
      id: 2,
      endImage: "http://imagetest.ovuems.com/20190911135616938_360.jpg",
      title: '前情提要|万众期待的2019中国电子"i"+网络安全创新创业大赛总决赛即将来袭',
      date: "2019-09-10 00:00:00"
    }],
    animationData: "",
    animationimg: "//contest.ovuems.com/applet/animate01.png",
    userInfo: {},
    hasUserInfo: false,
    canIUse: wx.canIUse('button.open-type.getUserInfo')
  },

  //事件处理函数
  bindViewTap: function() {
    wx.navigateTo({
      url: '../logs/logs'
    })
  },

  //跳转新闻列表页
  toList: function() {
    wx.navigateTo({
      url: '/pages/index/newslist/newslist'
    })
  },

  //轮播图跳转新闻详情
  clickSwiper: function(e) {
    let _id = e.currentTarget.dataset.id;
    // let _imgname = e.currentTarget.dataset.imgurl.slice(28);
    let _imgurl = e.currentTarget.dataset.imgurl;
    wx.navigateTo({
      // url: '/pages/index/newsdetail/newsdetail?id=' + _id,
      // url: '/pages/index/newsdetail/newsdetail?imgname=' + _imgname,
      url: '/pages/index/newsdetail/newsdetail?imgurl=' + _imgurl,
    })
  },

  onLoad: function() {
    var self = this;
    if (app.globalData.userInfo) {
      this.setData({
        userInfo: app.globalData.userInfo,
        hasUserInfo: true
      })
    } else if (this.data.canIUse) {
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

    //创建动画
    var animation = wx.createAnimation({
      duration: 1500,
      timingFunction: "ease",
      delay: 0,
      transformOrigin: "50% 50%",
    })
    //设置动画
    // animation.rotate(90).step();     //旋转90度
    animation.scale(2).step(); //放大1.5倍
    //animation.translate(-30,-50).step();        //偏移x,y,z
    //animation.skew(30,50).step();        //倾斜x,y
    // animation.rotate(45).scale(0.8).translate(10, 10).step();     //边旋转边放大
    //导出动画数据传递给组件的animation属性。
    this.setData({
      animationData: animation.export(),
    });
    self.getNewslist();
  },

  //请求新闻列表
  getNewslist: function() {
    var self = this;
    wx.request({
      url: 'https://contest.ovuems.com/news/listAllNews',
      method: "GET",
      data: {},
      header: {
        'content-type': 'application/json',
      },
      success(res) {
        console.log(res.data.data);
        // let swiperimgs = res.data.data ? res.data.data.sort(self.sortBytime("id")) : [];
        let swiperimgs = res.data.data ? res.data.data.reverse() : [];
        swiperimgs = swiperimgs.length > 4 ? swiperimgs.slice(0, 4) : swiperimgs;
        console.log(swiperimgs);
        self.setData({
          bnrUrl: swiperimgs,
        });
      }
    })
  },

  //轮播图排序
  sortBytime: function(propertyName) {
    return function(_obja, _objb) {
      let keya = _obja[propertyName];
      let keyb = _objb[propertyName];
      return keyb - keya
    }
  },
  getUserInfo: function(e) {
    console.log(e)
    app.globalData.userInfo = e.detail.userInfo
    this.setData({
      userInfo: e.detail.userInfo,
      hasUserInfo: true
    })
  }
})