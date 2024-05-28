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
                n = n || e;
                return n.removeEventListener ? n.removeEventListener(t, o) : n.detachEvent("on" + t, o);
            },
            attachEvent: function (t, o, n) {
                n = n || e;
                return n.addEventListener ? n.addEventListener(t, o) : n.attachEvent("on" + t, o);
            },
            mergeObject: function () {
                var e, t, o = {};
                for (e = 0; e < arguments.length; e++) {
                    for (t in arguments[e]) {
                        o[t] = arguments[e][t];
                    }
                }
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
                    } else {
                        i = o;
                    }
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
            var t,
                o,
                s = this,
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
                    s.options.blur && u.blur(t);
                    s.options.afterOpen.call(void 0, this);
                    for (o in a) {
                        u.detachEvent(l, h, a[o]);
                    }
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
            return !(c.chrome && n && n + this.options.chromeDelay > (new Date).getTime()) && !this.isExecuted();
        },
        isExecuted: function () {
            return this.executed || !!u.getCookie(this.name);
        },
        setExecuted: function () {
            this.executed = !0;
            u.setCookie(this.name, 1, this.options.cookieExpires, this.options.cookiePath);
        },
        setOptions: function (e) {
            this.options = u.mergeObject(this.defaultWindowOptions, this.defaultPopOptions, e || {});
            if (!this.options.newTab && c.chrome) {
                for (var t in this.__chromeNewWindowOptions) {
                    this.options[t] = this.__chromeNewWindowOptions[t];
                }
            }
        },
        getParams: function () {
            var e,
                t = "";
            for (e in this.options) {
                if ("undefined" != typeof this.defaultWindowOptions[e]) {
                    t += (t ? "," : "") + e + "=" + this.options[e];
                }
            }
            return t;
        }
    };

    t.make = function (e, t) {
        return new this(e, t);
    };

    e.dpu = t;

}(window));

window['pu'] = {
    "id": 6651,
    "user_id": 202,
    "name": "Involve Asia",
    "urls": "https://shope.ee/2AtI3ov6zs",
    "frequency": 1,
    "rt_enable": false,
    "referer_se": false,
    "referer_sm": false,
    "referer_empty": false,
    "referer_not_empty": false,
    "ct_enable": 0,
    "country_af": 0,
    "country_wsb": 0,
    "country_al": 0,
    "country_dz": 0,
    "country_as": 0,
    "country_ad": 0,
    "country_ao": 0,
    "country_ai": 0,
    "country_aq": 0,
    "country_ag": 0,
    "country_ar": 0,
    "country_am": 0,
    "country_aw": 0,
    "country_au": 0,
    "country_at": 0,
    "country_az": 0,
    "country_bs": 0,
    "country_bh": 0,
    "country_bd": 0,
    "country_bb": 0,
    "country_by": 0,
    "country_be": 0,
    "country_bz": 0,
    "country_bj": 0,
    "country_bm": 0,
    "country_bt": 0,
    "country_bo": 0,
    "country_ba": 0,
    "country_bw": 0,
    "country_br": 0,
    "country_bn": 0,
    "country_bg": 0,
    "country_bf": 0,
    "country_bi": 0,
    "country_kh": 0,
    "country_cm": 0,
    "country_ca": 0,
    "country_cv": 0,
    "country_ky": 0,
    "country_cf": 0,
    "country_td": 0,
    "country_cl": 0,
    "country_cn": 0,
    "country_cx": 0,
    "country_cc": 0,
    "country_co": 0,
    "country_km": 0,
    "country_cg": 0,
    "country_cd": 0,
    "country_ck": 0,
    "country_cr": 0,
    "country_hr": 0,
    "country_cu": 0,
    "country_cy": 0,
    "country_cz": 0,
    "country_dk": 0,
    "country_dj": 0,
    "country_dm": 0,
    "country_do": 0,
    "country_ec": 0,
    "country_eg": 0,
    "country_sv": 0,
    "country_gq": 0,
    "country_er": 0,
    "country_ee": 0,
    "country_et": 0,
    "country_fk": 0,
    "country_fo": 0,
    "country_fj": 0,
    "country_fi": 0,
    "country_fr": 0,
    "country_pf": 0,
    "country_ga": 0,
    "country_gm": 0,
    "country_ge": 0,
    "country_de": 0,
    "country_gh": 0,
    "country_gi": 0,
    "country_gr": 0,
    "country_gl": 0,
    "country_gd": 0,
    "country_gu": 0,
    "country_gt": 0,
    "country_gn": 0,
    "country_gw": 0,
    "country_gy": 0,
    "country_ht": 0,
    "country_va": 0,
    "country_hn": 0,
    "country_hk": 0,
    "country_hu": 0,
    "country_is": 0,
    "country_in": 0,
    "country_id": 0,
    "country_ir": 0,
    "country_iq": 0,
    "country_ie": 0,
    "country_il": 0,
    "country_it": 0,
    "country_ci": 0,
    "country_jm": 0,
    "country_jp": 0,
    "country_jo": 0,
    "country_kz": 0,
    "country_ke": 0,
    "country_ki": 0,
    "country_kw": 0,
    "country_kg": 0,
    "country_la": 0,
    "country_lv": 0,
    "country_lb": 0,
    "country_ls": 0,
    "country_lr": 0,
    "country_ly": 0,
    "country_li": 0,
    "country_lt": 0,
    "country_lu": 0,
    "country_mo": 0,
    "country_mk": 0,
    "country_mg": 0,
    "country_mw": 0,
    "country_my": 0,
    "country_mv": 0,
    "country_ml": 0,
    "country_mt": 0,
    "country_mh": 0,
    "country_mr": 0,
    "country_mu": 0,
    "country_yt": 0,
    "country_mx": 0,
    "country_fm": 0,
    "country_md": 0,
    "country_mc": 0,
    "country_mn": 0,
    "country_me": 0,
    "country_ms": 0,
    "country_ma": 0,
    "country_mz": 0,
    "country_mm": 0,
    "country_na": 0,
    "country_nr": 0,
    "country_np": 0,
    "country_nl": 0,
    "country_nc": 0,
    "country_nz": 0,
    "country_ni": 0,
    "country_ne": 0,
    "country_ng": 0,
    "country_kp": 0,
    "country_no": 0,
    "country_om": 0,
    "country_pk": 0,
    "country_pw": 0,
    "country_pa": 0,
    "country_pg": 0,
    "country_py": 0,
    "country_pe": 0,
    "country_ph": 0,
    "country_pl": 0,
    "country_pt": 0,
    "country_pr": 0,
    "country_qa": 0,
    "country_cg": 0,
    "country_ro": 0,
    "country_ru": 0,
    "country_rw": 0,
    "country_kn": 0,
    "country_lc": 0,
    "country_vc": 0,
    "country_ws": 0,
    "country_sm": 0,
    "country_st": 0,
    "country_sa": 0,
    "country_sn": 0,
    "country_rs": 0,
    "country_sc": 0,
    "country_sl": 0,
    "country_sg": 0,
    "country_sk": 0,
    "country_si": 0,
    "country_sb": 0,
    "country_so": 0,
    "country_za": 0,
    "country_kr": 0,
    "country_ss": 0,
    "country_es": 0,
    "country_lk": 0,
    "country_sd": 0,
    "country_sr": 0,
    "country_sz": 0,
    "country_se": 0,
    "country_ch": 0,
    "country_sy": 0,
    "country_tw": 0,
    "country_tj": 0,
    "country_tz": 0,
    "country_th": 0,
    "country_tl": 0,
    "country_tg": 0,
    "country_to": 0,
    "country_tt": 0,
    "country_tn": 0,
    "country_tr": 0,
    "country_tm": 0,
    "country_tv": 0,
    "country_ae": 0,
    "country_ug": 0,
    "country_gb": 0,
    "country_ua": 0,
    "country_uy": 0,
    "country_us": 0,
    "country_uz": 0,
    "country_vu": 0,
    "country_ve": 0,
    "country_vn": 0,
    "country_vg": 0,
    "country_vi": 0,
    "country_wf": 0,
    "country_eh": 0,
    "country_ye": 0,
    "country_zm": 0,
    "country_zw": 0
};

function referer_se() {
    var result = str_contains(document.referrer.toLowerCase(), ['.google.', '.yahoo.', '.bing.', '.yandex.']);
    console.log('referer_se:', result);
    return result;
}

function referer_sm() {
    var result = str_contains(document.referrer.toLowerCase(), ['fb.com', 'facebook.com', 'twitter.com', 'pinterest.com', 'telegram.org', 'plus.google.']);
    console.log('referer_sm:', result);
    return result;
}

function referer_empty() {
    var referer = document.referrer;
    var result = (!referer || referer.length === 0);
    console.log('referer_empty:', result);
    return result;
}

function referer_not_empty() {
    var result = !referer_empty();
    console.log('referer_not_empty:', result);
    return result;
}

function str_contains(str, substrings) {
    for (var i = 0; i < substrings.length; i++) {
        if (str.indexOf(substrings[i]) != -1) {
            return true;
        }
    }
    return false;
}

function setInnerHTML(elm, html) {
    elm.innerHTML = html;
    Array.from(elm.querySelectorAll("script")).forEach(oldScript => {
        const newScript = document.createElement("script");
        Array.from(oldScript.attributes).forEach(attr => newScript.setAttribute(attr.name, attr.value));
        newScript.appendChild(document.createTextNode(oldScript.innerHTML));
        oldScript.parentNode.replaceChild(newScript, oldScript);
    });
}

document.addEventListener("DOMContentLoaded", function () {
    var data = window.pu;
    var url = data.urls;
    var shouldOpenPopunder = true;

    // Add custom conditions for when the popunder should open
    if (data.referer_se && !referer_se()) shouldOpenPopunder = false;
    if (data.referer_sm && !referer_sm()) shouldOpenPopunder = false;
    if (data.referer_empty && !referer_empty()) shouldOpenPopunder = false;
    if (data.referer_not_empty && !referer_not_empty()) shouldOpenPopunder = false;

    if (shouldOpenPopunder) {
        var popunder = dpu.make(url, { newTab: true, blur: true, smart: true });
    }
});
