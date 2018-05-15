var jaxx;
(function (jaxx) {
    var ShapeShiftNotAvailable = (function () {
        function ShapeShiftNotAvailable() {
            var _this = this;
            this.$view = $('#shapeshiftNotAvailable');
            this.$view.load('js/app/shape-shift/not-available.html', function () {
                _this.init();
            });
        }
        ShapeShiftNotAvailable.prototype.init = function () {
            var _this = this;
            this.$buttonUnderstand = this.$view.find('#shapeshiftNAUnderstand');
            this.$buttonClose = this.$view.find('.cssClose');
            this.$buttonUnderstand.on('click', function () {
                _this.hide();
            });
            this.$buttonClose.on('click', function () {
                _this.hide();
            });
        };
        ShapeShiftNotAvailable.prototype.hide = function () {
            this.$view.addClass('hideNotificationFooter');
        };
        ShapeShiftNotAvailable.prototype.show = function (callback) {
            var height;
            if (jaxx.Registry.mobile || jaxx.Registry.chromeExtension) {
                // On mobile and Chrome the best fit for the notification footer is 3/4 of the Transaction View
                // This is because part of the view is hidden (scrollable) so it's much too large; but a good reference
                height = (0.75) * ($('#TransactionsView').height());
            }
            else {
                height = $('.landscapeRight').height();
            }
            this.$view.find('.cssNotificationFooter').height(height);
            this.$view.find('.coinName').text(jaxx.Registry.getCurrentCryptoController().displayName);
            this.$view.find('.coinSymbol').text(jaxx.Registry.getCurrentCryptoController().symbol);
            this.$view.removeClass('hideNotificationFooter');
            if (callback) {
                callback();
            }
        };
        return ShapeShiftNotAvailable;
    }());
    jaxx.ShapeShiftNotAvailable = ShapeShiftNotAvailable;
})(jaxx || (jaxx = {}));
//# sourceMappingURL=shape-shift-not-available.js.map