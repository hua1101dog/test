Page({

  /**
   * 页面的初始数据
   */
  data: {
    img: "",
    imgs: [
      "//contest.ovuems.com/applet/2019newsdetail.png",
      "//contest.ovuems.com/applet/2019newsdetail.png",
      "//contest.ovuems.com/applet/2019newsdetail.png",
      "//contest.ovuems.com/applet/2019newsdetail.png"
    ]
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function(options) {
    // let imgs = this.data.imgs;
    // let pages = getCurrentPages();
    // let _index = pages[2] ? pages[2].options.id : 0;
    // console.log(_index);
    // this.setData({
    //   img: imgs[_index]
    // });
    console.log(options);
    this.setData({
      // img: "//contest.ovuems.com/applet/" + options.imgname
      img: options.imgurl
    });
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