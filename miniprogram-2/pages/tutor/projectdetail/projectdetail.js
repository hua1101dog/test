Page({

  /**
   * 页面的初始数据
   */
  data: {
    modalFlag: false,
    tutorInfo: {},
    url: "http://chutian.ovuems.com/admin/testaa.pdf?tdsourcetag=s_pcqq_aiomsg",
    arrTech: ['1', '2', '3', '4', '5', '6', '7', '8', '9', '10'],
    arrSubstain: ['1', '2', '3', '4', '5', '6', '7', '8', '9', '10'],
    arrComprehensive: ['1', '2', '3', '4', '5', '6', '7', '8', '9', '10'],
    // techIndex: 0,
    // substainIndex: 0,
    // comprehensiveIndex: 0,
    listarray: [],
    projectDetail: {},
    techInput: '',
    substainInput: '',
    comprehensiveInput: '',
    techScores: {},
    substainScores: {},
    comprehensiveScores: {}
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function(options) {
    var self = this;
    wx.showLoading({
      title: '加载中',
    })
    let _projectid = options.id || 8;
    let _tutorInfo = wx.getStorageSync('tutorInfo');
    self.setData({
      tutorInfo: _tutorInfo
    })
    self.getProdetail(_tutorInfo, _projectid);
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
  preventTouchMove:function(){

  },
  //请求项目详情接口
  getProdetail: function (_tutorInfo, _projectid) {
    var self= this;
    wx.request({
      url: 'https://contest.ovuems.com/park/getParkDetails',
      method: "GET",
      data: {
        id: _projectid,
        userId: _tutorInfo.tutorid
      },
      header: {
        'content-type': 'application/json',
        'cookie': "token=" + _tutorInfo.tutortoken
      },
      success(res) {
        console.log(res.data.data);
        wx.hideLoading();
        let _scorelist = res.data.data.score;
        if (_scorelist.length >=1){
          let _tech = _scorelist.find(v => (v.type == 1));
          let _substain = _scorelist.find(v => (v.type == 2));
          let _comprehensive = _scorelist.find(v => (v.type == 3));
          self.setData({
            techScores: _tech,
            substainScores: _substain,
            comprehensiveScores: _comprehensive
          })
        }
        self.setData({
          projectDetail: res.data.data,
          listarray: res.data.data.planImgs.split(',')
        })
      }
    })
  },

  //预览图片
  previewImg: function(e) {
    console.log(e.currentTarget.dataset.index);
    let index = e.currentTarget.dataset.index || 0;
    let listarray = this.data.listarray;
    wx.previewImage({
      current: listarray[index],
      urls: listarray,
    })
  },

  //安卓预览pdf
  previewPdf: function() {
    wx.downloadFile({
      url: "http://chutian.ovuems.com/admin/testaa.pdf?tdsourcetag=s_pcqq_aiomsg",
      success: function(res) {
        const filePath = res.tempFilePath;
        wx.openDocument({
          filePath: filePath
        })
      }
    })
  },

  //评分弹框出现
  show: function() {
    this.setData({
      modalFlag: true
    })
  },

  //评分弹框消失
  hide: function() {
    this.setData({
      modalFlag: false
    })
  },

  // 选择器选择
  bindPickerChange: function(e) {
    console.log('picker发送选择改变，携带值为', e.detail.value);
    let _typeIndex = e.currentTarget.dataset.type + "Index";
    this.setData({
      [_typeIndex]: e.detail.value,
      modalFlag: true
    })
  },

  // 书写备注说明
  getInputRemark: function(e) {
    let _type = e.currentTarget.dataset.type + "Input";
    this.setData({
      [_type]: e.detail.value,
    })
  },

  // 提交评分
  submitScore: function(e) {
    var self = this;
    let tutorInfo = wx.getStorageSync('tutorInfo');
    let techIndex = this.data.techIndex;
    let substainIndex = this.data.substainIndex;
    let comprehensiveIndex = this.data.comprehensiveIndex;
    if (techIndex && substainIndex && comprehensiveIndex) { //校验
      let _scoreList = [{
        "userId": tutorInfo.tutorid,
        "parkId": this.data.projectDetail.id,
        "remark": this.data.techInput,
        "grade": Number(techIndex) + 1,
        "type": "1"
      }, {
        "userId": tutorInfo.tutorid,
        "parkId": this.data.projectDetail.id,
        "remark": this.data.substainInput,
        "grade": Number(substainIndex) + 1,
        "type": "2"
      }, {
        "userId": tutorInfo.tutorid,
        "parkId": this.data.projectDetail.id,
        "remark": this.data.comprehensiveInput,
        "grade": Number(comprehensiveIndex) + 1,
        "type": "3"
      }];
      wx.request({
        url: 'https://contest.ovuems.com/score/setScore',
        method: "POST",
        data: JSON.parse(JSON.stringify(_scoreList)),
        header: {
          'content-type': 'application/json',
          'cookie': "token=" + tutorInfo.tutortoken
        },
        success(res) {
          console.log(res.data);
          if(res.data.msg=="success"){
            self.setData({
              modalFlag: false
            })
            wx.showToast({
              title: '评分成功',
              duration: 2000
            })
            self.getProdetail(tutorInfo, self.data.projectDetail.id);
          }
        }
      })
    } else {
      wx.showToast({
        // image: "//contest.ovuems.com/applet/icon-score.png",
        icon:"none",
        title: '请先完成评分',
        duration: 2000
      })
    }
  },

  //退出登录
  logOut: function () {
    var self = this;
    console.log('退出登录');
    wx.removeStorage({
      key: 'tutorInfo',
      success(res) {
        console.log(res);
        wx.navigateBack({
          delta: 1
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