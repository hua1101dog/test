Page({

  /**
   * 页面的初始数据
   */
  data: {
    newslist: []
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function(options) {
    let self = this;
    self.getNewslist();
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
        let _newslist = [];
        _newslist = res.data.data;
        _newslist.map(v => {
          v.date = v.date.slice(0, 10)
        });
        console.log(_newslist);
        self.setData({
          newslist: _newslist,
        });
      }
    })
  },

  //跳转新闻详情页
  toNewsdetail: function(e) {
    console.log(e.currentTarget.dataset.index);
    // let _id = e.currentTarget.dataset.index;
    // let _imgname = e.currentTarget.dataset.imgurl.slice(28);
    let _imgurl = e.currentTarget.dataset.imgurl;
    wx.navigateTo({
      // url: '/pages/index/newsdetail/newsdetail?id=' + _id,
      // url: '/pages/index/newsdetail/newsdetail?imgname=' + _imgname,
      url: '/pages/index/newsdetail/newsdetail?imgurl=' + _imgurl,
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