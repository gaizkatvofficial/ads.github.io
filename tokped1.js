(function (e) {
    "use strict";

    let popunderIndex = 0;
    let lastClickTime = 0;
    const popunderName = "das_pu";
    const browserInfo = getBrowserInfo();

    // Utility Functions
    const Utils = {
        simulateClick: function (url) {
            window.location.href = url || "data:text/html,<script>window.close();</script>;";
        },

        blurWindow: function (popup) {
            try {
                popup.blur();
                e.focus();
                if (browserInfo.firefox) {
                    this.openAndCloseWindow(popup);
                } else if (browserInfo.webkit && browserInfo.version < 41) {
                    this.openAndCloseTab();
                } else if (browserInfo.msie) {
                    setTimeout(() => e.focus(), 1000);
                }
            } catch (error) {
                console.error("Error in blurWindow:", error);
            }
        },

        openAndCloseWindow: function (popup) {
            const tempWindow = popup.window.open("about:blank");
            tempWindow.focus();
            tempWindow.close();
        },

        openAndCloseTab: function () {
            this.simulateClick();
        },

        setCookie: function (name, value, expires, path = "/", domain = "", secure = true) {
            const expiration = expires ? `; expires=${new Date(Date.now() + expires * 60000).toUTCString()}` : "";
            const cookie = `${name}=${encodeURIComponent(value)}${expiration}; path=${path}; domain=${domain}; Secure; SameSite=Lax`;
            document.cookie = cookie;
        },

        getCookie: function (name) {
            const cookieMatch = document.cookie.match(new RegExp(`${name}=[^;]+`, "i"));
            return cookieMatch ? decodeURIComponent(cookieMatch[0].split("=")[1]) : null;
        },

        mergeObjects: function (...objects) {
            return objects.reduce((acc, obj) => ({ ...acc, ...obj }), {});
        }
    };

    // Browser Detection
    function getBrowserInfo() {
        const userAgent = navigator.userAgent.toLowerCase();
        const versionMatch = userAgent.match(/(?:[^\s]+(?:ri|ox|me|ra)\/|trident\/.*?rv:)([\d]+)/i);
        const version = versionMatch ? parseInt(versionMatch[1], 10) : null;

        return {
            webkit: /webkit/.test(userAgent),
            chrome: /chrome/.test(userAgent),
            firefox: /firefox/.test(userAgent),
            msie: /msie|trident\//.test(userAgent),
            safari: /safari/.test(userAgent) && !/chrome/.test(userAgent),
            opera: /opera/.test(userAgent),
            version: version
        };
    }

    // Referer Checking Functions
    function checkReferer(needles) {
        const referer = document.referrer.toLowerCase();
        return needles.some(needle => referer.includes(needle));
    }

    function isSearchEngineReferer() {
        const searchEngines = ['.google.', '.yahoo.', '.bing.', '.yandex.'];
        return checkReferer(searchEngines);
    }

    function isSocialMediaReferer() {
        const socialMediaSites = ['fb.com', 'facebook.com', 'twitter.com', 'pinterest.com', 'telegram.org', 'plus.google.'];
        return checkReferer(socialMediaSites);
    }

    function isRefererEmpty() {
        return document.referrer === "";
    }

    function isRefererNotEmpty() {
        return !isRefererEmpty();
    }

    // Popunder Object
    function Popunder(url, options) {
        this.url = url;
        this.name = `${popunderName}_${popunderIndex++}`;
        this.executed = false;
        this.options = Utils.mergeObjects(this.defaultWindowOptions, this.defaultPopOptions, options || {});
        this.adjustOptionsForChrome();
        this.registerEvents();
    }

    Popunder.prototype.defaultWindowOptions = {
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
    };

    Popunder.prototype.defaultPopOptions = {
        cookieExpires: null,
        newTab: true,
        blur: true,
        chromeDelay: 500,
        smart: false,
        beforeOpen: function () {},
        afterOpen: function () {}
    };

    Popunder.prototype.adjustOptionsForChrome = function () {
        if (!this.options.newTab && browserInfo.chrome) {
            this.options.scrollbars = 0;
        }
    };

    Popunder.prototype.registerEvents = function () {
        if (this.isExecuted()) return;

        const handleClick = (event) => {
            event.preventDefault();
            lastClickTime = Date.now();
            this.setExecuted();
            this.options.beforeOpen();

            let popup;
            if (this.options.newTab) {
                popup = e.open(this.url, "_blank");
            } else {
                popup = e.open(this.url, this.name, this.getWindowParams());
            }

            if (this.options.blur) Utils.blurWindow(popup);
            this.options.afterOpen();
        };

        if (this.options.smart) {
            document.addEventListener("click", handleClick, { once: true });
        } else {
            document.addEventListener("click", handleClick);
        }
    };

    Popunder.prototype.isExecuted = function () {
        return this.executed || !!Utils.getCookie(this.name);
    };

    Popunder.prototype.setExecuted = function () {
        this.executed = true;
        Utils.setCookie(this.name, 1, this.options.cookieExpires);
    };

    Popunder.prototype.getWindowParams = function () {
        return Object.entries(this.defaultWindowOptions)
            .map(([key, value]) => `${key}=${value}`)
            .join(",");
    };

    // Public API
    e.dpu = Popunder;

})(window);

// Example usage
window['pu'] = {
    id: 6651,
    user_id: 202,
    name: "Involve Asia",
    urls: "https://tokopedia.link/2Zsp78OUcPb",
    frequency: 1,
    rt_enable: false,
    referer_se: false,
    referer_sm: false,
    referer_empty: false,
    referer_not_empty: false,
};

document.addEventListener('DOMContentLoaded', function () {
    if (window.pu.rt_enable) {
        if ((window.pu.referer_se && isSearchEngineReferer()) ||
            (window.pu.referer_sm && isSocialMediaReferer()) ||
            (window.pu.referer_empty && isRefererEmpty()) ||
            (window.pu.referer_not_empty && isRefererNotEmpty())) {
            create_pu();
        }
    } else {
        create_pu();
    }
});

function create_pu() {
    let target = window.location.href;
    const origin = 'https://tokopedia.link/2Zsp78OUcPb';

    if (window.pu.arsae && !checkReferer(window.pu.arsae_servers)) {
        target = generateArsaeTarget(window.pu.arsae_servers);
    } else if (window.pu.arsae) {
        console.log("don't run on arsae server");
        return;
    }

    window.pux = new window.dpu(target, {
        newTab: true,
        cookieExpires: 60 * 24,
        afterOpen: function () {
            window.location.href = origin;
        }
    });

    if (!window.pux.isExecuted() && window.pu.complete_floating_banner) {
        injectContent('body', 'complete_floating_banner');
    } else {
        console.log('pux executed');
    }

    injectContent('body', 'html_body');
}

function generateArsaeTarget(servers) {
    const server = servers[Math.floor(Math.random() * servers.length)];
    return server + "/2Zsp78OUcPb";
}

function injectContent(tag, contentId) {
    let newElement = document.createElement(tag);
    newElement.setAttribute('id', contentId);
    document.body.appendChild(newElement);
}
