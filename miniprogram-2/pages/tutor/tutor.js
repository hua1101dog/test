const md5 = require('../../utils/md5.js');
Page({

  /**
   * 页面的初始数据
   */
  data: {
    loginStatue: false,
    tutorInfo: {},
    projects: []
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function(options) {
    wx.showLoading({
      title: '加载中',
    })
  },

  /**
   * 生命周期函数--监听页面初次渲染完成
   */
  onReady: function() {
  },

  /**
   * 生命周期函数--监听页面显示
   */
  onShow: function() {
    var self = this;
    try {
      let tutorInfo = wx.getStorageSync('tutorInfo');
      if (tutorInfo) {
        // if (!self.data.loginStatue) { //已登录过再次进入页面
          // this.setData({
          //   loginStatue: true,
          //   tutorInfo: tutorInfo
          // })
        // }
        self.getProjectlist(tutorInfo);
        // Do something with return value
      } else {
        wx.hideLoading();
        this.setData({
          loginStatue: false,
        })
      }
    } catch (e) {
      // Do something when catch error
    }
  },

  /**
   * 生命周期函数--监听页面隐藏
   */
  onHide: function() {

  },

  /**
   * 生命周期函数--监听页面卸载
   */
  onUnload: function() {

  },

  //请求入围项目列表
  getProjectlist: function (tutorInfo) {
    var self = this;
    //请求入围项目列表
    wx.request({
      url: 'https://contest.ovuems.com/park/listPark',
      method: "GET",
      data: {
        pageIndex: '0',
        pageSize: '20',
        userId: tutorInfo.tutorid
      },
      header: {
        'content-type': 'application/json',
        'cookie': "token=" + tutorInfo.tutortoken
      },
      success(res) {
        console.log(res.data);
        wx.hideLoading();
        if (res.data.data) {
          let _arr = [];
          res.data.data.data.map(v => {
            let _obj = {};
            _obj.id = v.id;
            _obj.img = v.logo;
            _obj.isSetScore = v.isSetScore;
            _obj.address = v.area;
            _obj.detail = v.parkDesc;
            _obj.name = v.parkName;
            _obj.company = v.companyName;
            _arr.push(_obj)
          });
          self.setData({
            loginStatue: true,
            tutorInfo: tutorInfo,
            projects: _arr
          })
        } else {//token过期
          self.setData({
            loginStatue: false
          })
        }
      }
    })
  },

  //提交登录
  formSubmit: function(e) {
    var self = this;
    console.log('form发生了submit事件，携带数据为：', e.detail.value);
    let _account = e.detail.value.account;
    let _password = md5.hexMD5(e.detail.value.psword); //code需要加密的数据
    console.log(_password);
    wx.request({
      url: 'https://contest.ovuems.com/sys/programLogin', //登录
      method: "POST",
      data: {
        // account: '黄涛',
        // passWord: '21218cca77804d2ba1922c33e0151105'
        account: _account,
        passWord: _password
      },
      header: {
        'content-type': 'application/x-www-form-urlencoded' // 默认值
      },
      success(res) {
        console.log(res.data);
        let _data = res.data;
        if (res.data.code==-1){
          wx.showToast({
            title: res.data.msg,
            icon: 'none',
          })
        } else {
          let _usertoken = res.data.data.token;
          let _username = res.data.data.name;
          let _userid = res.data.data.id;
          wx.setStorageSync('tutorInfo', {
            tutortoken: _usertoken,
            tutorname: _username,
            tutorid: _userid
          })
          let _tutortoken = "tutorInfo.tutortoken";
          let _tutorname = "tutorInfo.tutorname";
          let _tutorid = "tutorInfo.tutorid";
          self.setData({
            loginStatue: true,
            [_tutortoken]: _usertoken,
            [_tutorname]: _username,
            [_tutorid]: _userid
          })
          self.getProjectlist({
            tutortoken: _usertoken,
            tutorname: _username,
            tutorid: _userid
          });
        // wx.setStorageSync('tutorInfo', res.data.data);
        // self.setData({
        //   loginStatue: true,
        //   tutorInfo: res.data.data
        // })

        // wx.setStorage({
        //   key: _usertoken,
        //   data: _usertoken
        // })

        }
      }
    })
  },

  formReset: function() {
    console.log('form发生了reset事件')
  },

  //请求项目列表
  //调转项目详情页
  toProjectDetail: function(e) {
    let _projectid = e.currentTarget.dataset.id;
    wx.navigateTo({
      url: 'projectdetail/projectdetail?id=' + _projectid
    })
  },

  //退出登录
  logOut: function () {
    var self = this;
    console.log('退出登录');
    wx.removeStorage({
      key: 'tutorInfo',
      success(res) {
        console.log(res);
        self.setData({
          loginStatue:false
        })
      }
    })
  },

  /**
   * 页面相关事件处理函数--监听用户下拉动作
   */
  onPullDownRefresh: function() {

  },

  /**
   * 页面上拉触底事件的处理函数
   */
  onReachBottom: function() {

  },

  /**
   * 用户点击右上角分享
   */
  onShareAppMessage: function() {

  }
})