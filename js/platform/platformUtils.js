var PlatformUtils = function () {
};

PlatformUtils.outputAllChecks = function () {
    console.log("browserChromeCheck :: " + PlatformUtils.browserChromeCheck());
    console.log("extensionSafariCheck :: " + PlatformUtils.extensionSafariCheck());
    console.log("extensionChromeCheck :: " + PlatformUtils.extensionChromeCheck());
    console.log("extensionFirefoxCheck :: " + PlatformUtils.extensionFirefoxCheck());
};

PlatformUtils.browserChromeCheck = function () {
    return (typeof(chrome) !== "undefined" && typeof(chrome.extension) === "undefined");
};

PlatformUtils.extensionSafariCheck = function () {
    return (typeof(safari) !== 'undefined' && safari.self && /Safari/i.test(navigator.userAgent) && !/Chrome/i.test(navigator.userAgent));
};

PlatformUtils.extensionChromeCheck = function () {
    if (typeof(chrome) !== "undefined" && typeof(chrome.extension) !== "undefined" && typeof(chrome.extension.connect) !== "undefined") {
        //@note: this should be the final packed extension key: ilbikpphdpklejgkfhfmmllabablgcil
        var myPort = chrome.extension.connect('ilbikpphdpklejgkfhfmmllabablgcil', null);
        return (typeof(myPort) !== "undefined")
    } else {
        return false;
    }
};

PlatformUtils.extensionFirefoxCheck = function () {
    return (navigator.userAgent.indexOf("Firefox") > 0);
};

PlatformUtils.extensionCheck = function () {
    return (PlatformUtils.extensionChromeCheck() || PlatformUtils.extensionFirefoxCheck() || PlatformUtils.extensionSafariCheck());
};

PlatformUtils.desktopCheck = function () {
    return (typeof process !== 'undefined' && process.versions['electron']);
};

PlatformUtils.mobileCheck = function () {
    if (/webOS|IEMobile|Opera Mini/i.test(navigator.userAgent)) {
        return true;
    }
    else {
        return (PlatformUtils.mobileIphoneCheck() || PlatformUtils.mobileIpadCheck() || PlatformUtils.mobileBlackberryCheck() || PlatformUtils.mobileAndroidCheck());
    }
};

PlatformUtils.mobileIphoneCheck = function () {
    return (/iPhone|iPod/i.test(navigator.userAgent));
};

PlatformUtils.mobileIpadCheck = function () {
    return (/iPad/i.test(navigator.userAgent));
};

PlatformUtils.mobileiOSCheck = function () {
    return (PlatformUtils.mobileIphoneCheck() || PlatformUtils.mobileIpadCheck());
};


PlatformUtils.mobileBlackberryCheck = function () {
    return (/BlackBerry/i.test(navigator.userAgent));
};

PlatformUtils.mobileAndroidCheck = function () {
    return (/Android/i.test(navigator.userAgent));
};