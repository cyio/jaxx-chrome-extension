var jaxx;
(function (jaxx) {
    // class responsible to show different messages during initialization errors and no internet
    var InitializationMessage = (function () {
        function InitializationMessage() {
            this.noInternetConnectionMessage = 'No Internet Connection';
            this.serviceUnavailableMessage = 'Jaxx service unavailable';
            this.initializatioFaled = 'Initialization Failed';
            this.initialization = 'Initializing wallet';
            this.tryLater = 'Please Try late';
        }
        InitializationMessage.prototype.init = function () {
            var _this = this;
            this.$container = $('#InitializingLoading');
            this.$initialization = this.$container.children('img').first();
            this.$refreshLoading = $('#refresh-loading');
            jaxx.Registry.application$.on(jaxx.Registry.ON_RESTORE_HISTORY_START, function () {
                _this.showInitialization();
            });
            jaxx.Registry.CTR$.on(jaxx.Registry.CTR_ERROR_NO_INTERNET_ON_RESTORE_HISTORY, function (evt, ctr) {
                var cur = jaxx.Registry.getCurrentCryptoController();
                if (!cur)
                    return;
                if (cur.config.symbol === ctr.config.symbol) {
                    _this.showMessage(_this.noInternetConnectionMessage);
                    $('#overlay').hide();
                }
            });
        };
        // to show initialization message
        InitializationMessage.prototype.showInitialization = function () {
            if (!this.$view)
                return;
            this.$initialization.show();
            this.$view.remove();
            this.$view = null;
        };
        // hides initialization message and error messages
        InitializationMessage.prototype.hideAll = function () {
            this.$initialization.hide();
            this.$view.remove();
        };
        // hides initialization message and shows error message
        InitializationMessage.prototype.showMessage = function (message) {
            //if(this.currentMessage === message) return;
            this.currentMessage = message;
            this.$initialization.hide();
            if (!this.$view)
                this.$view = $('<div>').addClass('init-message');
            this.$view.text(message);
            this.$container.append(this.$view);
        };
        return InitializationMessage;
    }());
    jaxx.InitializationMessage = InitializationMessage;
    // class to control online/offline indicator green/red
    var NetworkConnectionIndicator = (function () {
        function NetworkConnectionIndicator(id) {
            var _this = this;
            this.id = id;
            this.isVisible = false;
            jaxx.Registry.isOnline = window.navigator.onLine;
            window.addEventListener('offline', function (e) {
                jaxx.Registry.NET$.triggerHandler(jaxx.Registry.NET_OFFLINE);
                jaxx.Registry.isOnline = false;
                _this.offLine();
            });
            window.addEventListener('online', function (e) {
                jaxx.Registry.NET$.triggerHandler(jaxx.Registry.NET_ONLINE);
                jaxx.Registry.isOnline = true;
                _this.onLine();
            });
            jaxx.Registry.application$.on(jaxx.Registry.ON_APPLICATION_READY, function () {
                _this.init();
            });
        }
        NetworkConnectionIndicator.prototype.init = function () {
            this.$container = $('#HamburgerMenu');
            this.show();
            if (jaxx.Registry.isOnline)
                this.onLine();
        };
        NetworkConnectionIndicator.prototype.onLine = function () {
            if (this.isOnline)
                return;
            this.$view.addClass('bg-green');
            this.isOnline = true;
        };
        NetworkConnectionIndicator.prototype.offLine = function () {
            if (!this.isOnline)
                return;
            this.$view.removeClass('bg-green');
            this.isOnline = false;
        };
        /// each visual has to have show/hide interface
        NetworkConnectionIndicator.prototype.show = function () {
            if (this.isVisible)
                return;
            if (!this.$view)
                this.$view = $('<div>').addClass('network-indicator');
            this.$container.append(this.$view);
            this.isVisible = true;
        };
        NetworkConnectionIndicator.prototype.hide = function () {
            if (!this.isVisible)
                return;
            this.$view.remove();
            this.isVisible = false;
        };
        return NetworkConnectionIndicator;
    }());
    jaxx.NetworkConnectionIndicator = NetworkConnectionIndicator;
    // instantiation indicator and registering it in case to access;
    jaxx.Registry.register(new NetworkConnectionIndicator('NetworkConnectionIndicator'));
    // controller responsible to show messages during initialisation failed process. and provides 3 attempts to retry initialization if service failing
    var NetworkConnectionController = (function () {
        function NetworkConnectionController(id) {
            var _this = this;
            this.id = id;
            // if user click retry button it will call restore history one more time in current crypto controller
            this.attempts = 0;
            jaxx.Registry.isOnline = navigator.onLine;
            jaxx.Registry.application$.on(jaxx.Registry.ON_APPLICATION_READY, function () {
                _this.init();
                jaxx.Registry.application$.triggerHandler(jaxx.Registry.MODULE_REDY, 'NetworkConnectionController');
            });
        }
        NetworkConnectionController.prototype.init = function () {
            var _this = this;
            this.failedInitializationMessage = new InitializationMessage();
            this.failedInitializationMessage.init();
            jaxx.Registry.application$.triggerHandler(jaxx.Registry.ON_RESTORE_HISTORY_START, function (evt, ctr) {
                _this.attempts = 0;
            });
            jaxx.Registry.CTR$.on(jaxx.Registry.CTR_SERVICE_ERROR, function (evt, ctr) {
                var cur = jaxx.Registry.getCurrentCryptoController();
                if (cur.config.symbol === ctr.config.symbol) {
                    var enabled = jaxx.Registry.getWalletsEnabledSorted();
                    if (enabled.length === 1) {
                        _this.failedInitializationMessage.showMessage(_this.failedInitializationMessage.initializatioFaled);
                        _this.showRetryMessage('serviceError', ['RETRY']);
                    }
                    else {
                        _this.failedInitializationMessage.showMessage(_this.failedInitializationMessage.serviceUnavailableMessage);
                        _this.showRetryMessage('serviceError', ['RETRY', 'CANCEL']);
                    }
                }
            });
        };
        NetworkConnectionController.prototype.retryInitialization = function () {
            this.failedInitializationMessage.showInitialization();
            this.attempts++;
            var ctr = jaxx.Registry.getCurrentCryptoController();
            ctr.restoreHistory(function (err) {
                console.warn(err);
                // if(!err) this.attempts = 0;
            });
        };
        // shows confirm box
        NetworkConnectionController.prototype.showRetryMessage = function (message, buttons, callBack) {
            var _this = this;
            var self = this;
            jaxx.ConfirmBox.show(message, function (text) {
                if (text === 'RETRY')
                    _this.retryInitialization();
                else {
                    _this.failedInitializationMessage.showMessage(_this.failedInitializationMessage.initializatioFaled);
                    $('#overlay').hide();
                    jaxx.Registry.application$.triggerHandler(jaxx.Registry.KILL_HISTORY);
                    _this.attempts = 0;
                }
            }, { extraClasses: null, buttons: buttons });
        };
        return NetworkConnectionController;
    }());
    jaxx.NetworkConnectionController = NetworkConnectionController;
    jaxx.Registry.register(new NetworkConnectionController('NetworkConnection'));
})(jaxx || (jaxx = {}));
//# sourceMappingURL=network-connection.js.map