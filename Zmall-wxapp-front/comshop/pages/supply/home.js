var app = getApp(), util = require("../../utils/util.js"), wcache = require("../../utils/wcache.js"), status = require("../../utils/index.js");

Page({
    mixins: [ require("../../mixin/cartMixin.js") ],
    data: {
        list: [],
        info: [],
        cartNum: 0
    },
    supplyId: 0,
    page: 1,
    onLoad: function(t) {
        this.supplyId = t.id || 0, "undefined" != t.share_id && 0 < t.share_id && wcache.put("share_id", t.share_id), 
        this.getData();
    },
    authSuccess: function() {
        this.getData(), this.setData({
            needAuth: !1
        });
    },
    getData: function() {
        var t = wx.getStorageSync("token"), n = this, e = wx.getStorageSync("community");
        app.util.request({
            url: "entry/wxapp/index",
            data: {
                controller: "supply.get_details",
                token: t,
                page: n.page,
                is_random: 1,
                head_id: e.communityId,
                id: n.supplyId
            },
            dataType: "json",
            success: function(t) {
                if (0 == t.data.code) {
                    var e = n.data.list, a = t.data.data || [], i = e.concat(t.data.list);
                    1 == n.page && wx.setNavigationBarTitle({
                        title: a.storename || a.shopname || "供应商"
                    });
                    var s = !1;
                    0 == t.data.list.length && (s = !0), n.setData({
                        list: i,
                        info: a,
                        noMore: s
                    });
                } else n.setData({
                    noMore: !0
                });
            }
        });
    },
    onShow: function() {
        var a = this, i = this;
        util.check_login_new().then(function(t) {
            if (t) a.setData({
                needAuth: !1
            }), (0, status.cartNum)("", !0).then(function(t) {
                0 == t.code && i.setData({
                    cartNum: t.data
                });
            }); else {
                var e = a.specialId;
                a.setData({
                    needAuth: !0,
                    navBackUrl: "/lionfish_comshop/pages/supply/home?id=" + e
                });
            }
        });
    },
    onPullDownRefresh: function() {},
    onReachBottom: function() {
        this.data.noMore || (this.page++, this.getData());
    },
    onShareAppMessage: function(t) {
        var e = this.data.info.storename || "供应商主页", a = wx.getStorageSync("member_id");
        return {
            title: e,
            path: "lionfish_comshop/pages/special/index?id=" + this.supplyId + "&share_id=" + a,
            success: function(t) {},
            fail: function(t) {}
        };
    }
});