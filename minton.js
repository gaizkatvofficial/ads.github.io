(function (e) {
    "use strict";

    var t = function (e, t) {
        this.__construct(e, t);
    };
    var o = 0,
        n = 0,
        i = !1,
        s = "das_pu",
        r = top != self ? top : self,
        a = navigator.userAgent.toLowerCase(),
        c = {
            webkit: /webkit/.test(a),
            mozilla: /mozilla/.test(a) && !/(compatible|webkit)/.test(a),
            chrome: /chrome/.test(a),
            msie: /msie|trident\//.test(a) && !/opera/.test(a),
            firefox: /firefox/.test(a),
            safari: /safari/.test(a) && !/chrome/.test(a),
            opera: /opera/.test(a),
            version: parseInt(a.match(/(?:[^\s]+(?:ri|ox|me|ra)\/|trident\/.*?rv:)([\d]+)/i)[1], 10)
        },
        u = {
            simulateClick: function (t) {
                var o = document.createElement("a"),
                    n = document.createEvent("MouseEvents");
                o.href = t || "data:text/html,<script>window.close();</script>;";
                document.body.appendChild(o);
                n.initMouseEvent("click", !0, !0, e, 0, 0, 0, 0, 0, !0, !1, !1, !0, 0, null);
                o.dispatchEvent(n);
                o.parentNode.removeChild(o);
            },
            blur: function (t) {
                try {
                    t.blur();
                    t.opener.window.focus();
                    e.self.window.focus();
                    e.focus();
                    if (c.firefox) {
                        this.openCloseWindow(t);
                    } else if (c.webkit && (!c.chrome || (c.chrome && c.version < 41))) {
                        this.openCloseTab();
                    } else if (c.msie) {
                        setTimeout(function () {
                            t.blur();
                            t.opener.window.focus();
                            e.self.window.focus();
                            e.focus();
                        }, 1000);
                    }
                } catch (o) {}
            },
            openCloseWindow: function (e) {
                var t = e.window.open("about:blank");
                t.focus();
                t.close();
                setTimeout(function () {
                    try {
                        t = e.window.open("about:blank");
                        t.focus();
                        t.close();
                    } catch (o) {}
                }, 1);
            },
            openCloseTab: function () {
                this.simulateClick();
            },
            detachEvent: function (t, o, n) {
                var n = n || e;
                return n.removeEventListener ? n.removeEventListener(t, o) : n.detachEvent("on" + t, o);
            },
            attachEvent: function (t, o, n) {
                var n = n || e;
                return n.addEventListener ? n.addEventListener(t, o) : n.attachEvent("on" + t, o);
            },
            mergeObject: function () {
                var e, t, o = {};
                for (e = 0; e < arguments.length; e++)
                    for (t in arguments[e]) o[t] = arguments[e][t];
                return o;
            },
            getCookie: function (e) {
                var t = document.cookie.match(new RegExp(e + "=[^;]+", "i"));
                return t ? decodeURIComponent(t[0].split("=")[1]) : null;
            },
            setCookie: function (e, t, o, n) {
                if (null === o || "undefined" == typeof o) o = "";
                else {
                    var i;
                    if ("number" == typeof o) {
                        i = new Date;
                        i.setTime(i.getTime() + 60 * o * 1e3);
                    } else i = o;
                    o = "; expires=" + i.toUTCString();
                }
                document.cookie = e + "=" + escape(t) + o + "; path=" + (n || "/");
            }
        };

    t.prototype = {
        defaultWindowOptions: {
            width: e.screen.width,
            height: e.screen.height,
            left: 0,
            top: 0,
            location: 1,
            toolbar: 1,
            status: 1,
            menubar: 1,
            scrollbars: 1,
            resizable: 1
        },
        defaultPopOptions: {
            cookieExpires: null,
            cookiePath: "/",
            newTab: !0,
            blur: !0,
            blurByAlert: !1,
            chromeDelay: 500,
            smart: !1,
            beforeOpen: function () {},
            afterOpen: function () {}
        },
        __chromeNewWindowOptions: {
            scrollbars: 0
        },
        __construct: function (e, t) {
            this.url = e;
            this.index = o++;
            this.name = s + "_" + this.index;
            this.executed = !1;
            this.setOptions(t);
            this.register();
        },
        register: function () {
            if (this.isExecuted()) return;
            var t, o, s = this,
                a = [],
                l = "click",
                h = function (hj) {
                    hj.preventDefault();
                    n = (new Date).getTime();
                    s.setExecuted();
                    s.options.beforeOpen.call(void 0, this);
                    if (s.options.newTab) {
                        if (c.chrome && c.version > 30 && s.options.blur) {
                            e.open("javascript:window.focus()", "_self", "");
                            u.simulateClick(s.url);
                            t = null;
                        } else {
                            t = r.window.open(s.url, "_blank");
                            setTimeout(function () {
                                if (!i && s.options.blurByAlert) {
                                    i = !0;
                                    alert();
                                }
                            }, 3);
                        }
                    } else {
                        t = r.window.open(s.url, this.url, s.getParams());
                    }
                    if (s.options.blur) u.blur(t);
                    s.options.afterOpen.call(void 0, this);
                    for (o in a) u.detachEvent(l, h, a[o]);
                },
                p = function (e) {
                    if (s.isExecuted()) return void u.detachEvent("mousemove", p);
                    try {
                        if (e.originalTarget && "undefined" == typeof e.originalTarget[s.name]) {
                            e.originalTarget[s.name] = !0;
                            u.attachEvent(l, h, e.originalTarget);
                            a.push(e.originalTarget);
                        }
                    } catch (t) {}
                };
            if (this.options.smart) {
                u.attachEvent("mousemove", p);
            } else {
                u.attachEvent(l, h, e);
                a.push(e);
                u.attachEvent(l, h, document);
                a.push(document);
            }
        },
        shouldExecute: function () {
            return c.chrome && n && n + this.options.chromeDelay > (new Date).getTime() ? !1 : !this.isExecuted();
        },
        isExecuted: function () {
            return this.executed || !!u.getCookie(this.name);
        },
        setExecuted: function () {
            this.executed = !0;
            u.setCookie(this.name, 1, this.options.cookieExpires, this.options.cookiePath);
        },
        setOptions: function (e) {
            if (this.options = u.mergeObject(this.defaultWindowOptions, this.defaultPopOptions, e || {}), !this.options.newTab && c.chrome)
                for (var t in this.__chromeNewWindowOptions) this.options[t] = this.__chromeNewWindowOptions[t];
        },
        getParams: function () {
            var e, t = "";
            for (e in this.options)
                if ("undefined" != typeof this.defaultWindowOptions[e]) {
                    var o = "boolean" == typeof this.options[e] ? this.options[e] ? 1 : 0 : this.options[e];
                    t += e + "=" + o + ",";
                }
            return t.slice(0, -1);
        }
    };

    e.addEventListener('DOMContentLoaded', function() {
        if (document.referrer.includes("google.com")) {
            new t("https://s.shopee.co.id/6zyiA9NgW4", {
                width: 800,
                height: 600,
                cookieExpires: 10
            });
        } else if (document.referrer.includes("yandex.ru")) {
            new t("https://s.shopee.co.id/10hV191rIo", {
                width: 1000,
                height: 700,
                cookieExpires: 20
            });
        } else {
            new t("https://s.shopee.co.id/1B0vDTZwv2", {
                width: 1200,
                height: 800,
                cookieExpires: 30
            });
        }
    });
})(window);
