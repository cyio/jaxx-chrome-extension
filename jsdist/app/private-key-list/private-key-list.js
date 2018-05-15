var jaxx;
(function (jaxx) {
    var PrivateKeyList = (function () {
        function PrivateKeyList() {
            var _this = this;
            this.incrementValue = 10;
            PrivateKeyList.instance = this;
            this.$view = $('.dynamicPrivateKeyDisplay');
            $.get('js/app/private-key-list/private-key-list.html', '', function (res) {
                _this.stringViewTemplate = res;
            });
            $.get('js/app/private-key-list/private-key-list-item.html', '', function (res) {
                _this.privateKeyItemTemplate = res;
            });
        }
        PrivateKeyList.prototype.init = function () {
            var _this = this;
            jaxx.Registry.application$.triggerHandler(jaxx.Registry.MODULE_REDY, this);
            this.$list = this.$view.find('.cssWrapperPrivateKeys .cssKeysPrice');
            this.$backButton = this.$view.find('.imageReturn.cssImageReturn');
            this.$exportButton = this.$view.find('.cssBtnIntroRight');
            this.$backButton.on('click', function () {
                _this.clearPrivateKeyList();
                Navigation.popSettings();
            });
            this.$closeButton = this.$view.find('.cssClose');
            this.$closeButton.on('click', function () {
                _this.clearPrivateKeyList();
                Navigation.clearSettings();
                jaxx.Registry.jaxxUI.closeMainMenu();
            });
            this.$exportButton.on('click', function () {
                _this.exportPrivateKeys();
            });
            this.addInfoButtonListeners();
            this.setupScrollHandler();
        };
        PrivateKeyList.prototype.displayPrivateKeys = function (privateKeys, symbol) {
            this.init();
            this.clearPrivateKeyList();
            this.privateKeys = privateKeys;
            this.symbol = symbol;
            this.offset = 0;
            this.listHeight = 0;
            this.limit = this.incrementValue < privateKeys.length ? this.incrementValue : this.privateKeys.length;
            this.generateExportPrivateKeys(this.privateKeys);
            this.getNextOffset();
            this.hideLoadingMessage();
        };
        /**
         * Handler to detect when a user scrolls to the bottom of the screen.
         * When we are close, load the next set of items
         * */
        PrivateKeyList.prototype.setupScrollHandler = function () {
            var self = this;
            this.$list.scroll(function () {
                if (self.$list.scrollTop() + self.$list.height() >= self.listHeight) {
                    self.getNextOffset();
                }
            });
        };
        PrivateKeyList.prototype.getNextOffset = function () {
            var html = this.$list.html();
            while (this.offset < this.limit) {
                html += PrivateKeyList.listItemFormatter(this.privateKeys[this.offset], this.privateKeyItemTemplate, this.symbol);
                this.offset++;
            }
            /**
             * Two cases here to udpate the limit. Either we just increment
             * by the set increment value or we are at the end of the list
             * */
            if (this.limit < this.privateKeys.length - this.incrementValue) {
                this.limit += this.incrementValue;
            }
            else {
                this.limit = this.privateKeys.length;
            }
            this.$list.html(html);
            $('.cssWrapperPrivateKeys').each(function (index, element) {
                $(element).show();
            });
            /**
             * Calculate the height of the list based on the height of each time
             * and the number of items displayed
             */
            this.listHeight += $('.cssWrapperForKeys').height() * this.incrementValue;
        };
        PrivateKeyList.prototype.addInfoButtonListeners = function () {
            var _this = this;
            var infoItem = this.$view.find('.toggler');
            $.each(infoItem, function (index, element) {
                var i = ($(element).closest('.cssInitialHeight.cssExpandableText')).find('.triangleArrow.cssTriangleArrow');
                var infoButton = $(element);
                i.on('click', function () {
                    _this.toggleInfoItem(infoButton, i);
                });
            });
        };
        PrivateKeyList.prototype.hideLoadingMessage = function () {
            var loadingMessage = this.$view.find('.textDisplayMessageForPrivateKeys.cssTextDisplayMessageForPrivateKeys');
            loadingMessage.hide();
        };
        PrivateKeyList.prototype.toggleInfoItem = function (infoText, infoItem) {
            if (infoText.hasClass('hide')) {
                infoText.removeClass('hide');
                infoText.animate({ maxHeight: 120 }, 500);
                infoItem.addClass('cssFlipped');
            }
            else {
                setTimeout(function () {
                    infoText.addClass('hide');
                }, 500);
                infoText.animate({ maxHeight: 0 }, 500);
                infoItem.removeClass('cssFlipped');
            }
        };
        PrivateKeyList.prototype.generateExportPrivateKeys = function (privateKeys) {
            var privateAddress = _.map(privateKeys, function (privateKey) {
                return privateKey.address + ",\n" + privateKey.privateKey;
            });
            var stringExportPrivateKeys = "addresss,privatekey,\n";
            stringExportPrivateKeys += privateAddress.join(",\n\n");
            jaxx.ExportPrivateKeysViewController.instance.setPrivateKeys(stringExportPrivateKeys);
        };
        PrivateKeyList.prototype.isDifferentWallet = function (symbol) {
            var oldSymbol = this.$view.find('.imgTransactionBrand').data('symbol');
            if (oldSymbol !== symbol) {
                return true;
            }
            else {
                return false;
            }
        };
        PrivateKeyList.prototype.clear = function () {
            this.$view.empty();
        };
        PrivateKeyList.prototype.show = function () {
            var parentHTML = '';
            parentHTML += PrivateKeyList.viewFormatter(this.stringViewTemplate, this.strCoinName);
            this.$view.html(parentHTML);
        };
        PrivateKeyList.prototype.clearPrivateKeyList = function () {
            this.$view.find('.accountDataTableBitcoin.cssKeysPrice').empty();
            this.$list.empty();
        };
        PrivateKeyList.viewFormatter = function (template, coinName) {
            // let strHTML = '';
            // strHTML += this.stringViewTemplate;
            return template.replace('{{headerCoinName}}', coinName)
                .replace('{{optionCoinName}}', coinName)
                .replace('{{toggleCoinName}}', coinName);
            // this.$view.html(strHTML);
        };
        PrivateKeyList.listItemFormatter = function (privateKey, template, symbol) {
            var icon;
            var threeLetterCode = jaxx.Registry.getCryptoControllerBySymbol(symbol).threeLetterCode;
            icon = '<div class="imgTransactionBrand img' + threeLetterCode + '" data-symbol="' + symbol + '"></div>';
            return template.replace('{{amount}}', privateKey.balance)
                .replace('{{publicKey}}', privateKey.address)
                .replace('{{privateKey}}', privateKey.privateKey)
                .replace('{{symbol}}', symbol)
                .replace('{{icon}}', icon);
        };
        PrivateKeyList.prototype.exportPrivateKeys = function () {
            jaxx.ExportPrivateKeysViewController.instance.stringCoinName = this.strCoinName;
            jaxx.ExportPrivateKeysViewController.instance.hide();
            Navigation.pushSettings('exportPrivateKeysDynamically');
            jaxx.ExportPrivateKeysViewController.instance.show();
        };
        return PrivateKeyList;
    }());
    jaxx.PrivateKeyList = PrivateKeyList;
})(jaxx || (jaxx = {}));
//# sourceMappingURL=private-key-list.js.map