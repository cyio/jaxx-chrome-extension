var jaxx;
(function (jaxx) {
    var BitCoinMiningFeeController = (function () {
        function BitCoinMiningFeeController(config) {
            var _this = this;
            this.config = config;
            this.testPrice = 0;
            this.name = 'BitCoinMiningFeeController';
            BitCoinMiningFeeController.instance = this;
            this.$view = $('#BitCoinMiningFee');
            this.$view.load('js/app/bit-coin-mining-fee/bit-coin-mining-fee.html', "", function () {
                setTimeout(function () { return _this.init(); }, 1000);
            });
        }
        BitCoinMiningFeeController.prototype.init = function () {
            var _this = this;
            var ctr = jaxx.Registry.getCryptoControllerBySymbol('BTC');
            if (!ctr) {
                setTimeout(function () { return _this.init(); }, 1000);
                return;
            }
            this.$view.on('click', '.optionTrigger', function (evt) {
                console.log($(evt.currentTarget));
                _this.onSelect($(evt.currentTarget));
            });
            this.config = ctr.config;
            //console.log(ctr);
            this.symbol = ctr.symbol;
            this.overwrite(ctr);
            ctr = jaxx.Registry.getCryptoControllerBySymbol('BTCt');
            this.overwrite(ctr);
            jaxx.Registry.application$.triggerHandler(jaxx.Registry.MODULE_REDY, this);
            this.$backNavigation = $('#BTCMiningFeeBackNavigation');
            this.$closeNavigation = $('#BTCMiningFeeClose');
            this.$backNavigation.on('click', function () {
                _this.backNavigation();
            });
            this.$closeNavigation.on('click', function () {
                _this.remoteToggleMainMenu();
            });
        };
        BitCoinMiningFeeController.prototype.overwrite = function (ctr) {
            var _this = this;
            ctr.subtractMiningFee = function (total, length) {
                var price = _this.getMiningFeePerByte();
                if (_this.testPrice)
                    price = _this.testPrice;
                var bytesPerInput = 148;
                var countInputs = length;
                var numOuts = 2;
                var totalBytes = (bytesPerInput * countInputs) + (34 * numOuts) + 10;
                var feeTotal = (totalBytes * price);
                var spendable = jaxx.MATH.subtract(total, String(feeTotal));
                if (+spendable < 0) {
                    // console.log('fee total '+ feeTotal  +' where utxos total ' + total);
                    return '0';
                }
                return spendable;
            };
            ctr.getMiningPrice = function () {
                return _this.getMiningFeePerByte();
            };
            ctr.getMiningFee = function () {
                return _this.getMiningFeePerByte();
            };
            ctr.loadMiningFee = function () {
                // console.warn('loadMiningFee  ');
                _this.loadMiningFee();
            };
        };
        BitCoinMiningFeeController.prototype.remoteToggleMainMenu = function () {
            jaxx.Utils.remoteToggleMainMenu();
        };
        BitCoinMiningFeeController.prototype.backNavigation = function () {
            jaxx.Utils.backNavigation();
        };
        BitCoinMiningFeeController.prototype.selectItem = function (option) {
            var el = this.$view.find('[data-id=' + option + ']').first();
            this.selectInput(el);
        };
        BitCoinMiningFeeController.prototype.setMiningFeeData = function (data) {
            //  console.log(data);
            localStorage.setItem(this.symbol + 'miningfeeData', JSON.stringify(data));
        };
        BitCoinMiningFeeController.prototype.getMinigFeeData = function () {
            var str = localStorage.getItem(this.symbol + 'miningfeeData');
            if (str)
                return JSON.parse(str);
            return null;
        };
        BitCoinMiningFeeController.prototype.setMiningFeeOption = function (option) {
            localStorage.setItem(this.symbol + 'miningfeeOption', option);
        };
        BitCoinMiningFeeController.prototype.getMiningFeeOption = function () {
            var option = localStorage.getItem(this.symbol + 'miningfeeOption') || this.config.minigFeeOption;
            if (!option || option === 'undefined') {
                option = 'average';
                console.error(' no option');
            }
            // let option = this.config.defaultMinhgFee;
            return option;
        };
        BitCoinMiningFeeController.prototype.loadMiningFee = function () {
            var _this = this;
            var url = this.config.miningFeeUrl;
            // console.error(url);
            $.getJSON(url).then(function (res) {
                var out = {};
                for (var str in res) {
                    switch (str) {
                        case 'fastestFee':
                            out['fast'] = res[str];
                            break;
                        case 'halfHourFee':
                            out['average'] = res[str];
                            break;
                        case 'hourFee':
                            out['slow'] = res[str];
                            break;
                    }
                }
                ;
                return out;
            }).done(function (res) {
                _this.setMiningFeeData(res);
            }).fail(function (err) {
                jaxx.Registry.error$.triggerHandler(jaxx.Registry.ON_ERROR, new VOError('bitcoin-mining-fee', url, err));
                console.error(err);
            });
        };
        BitCoinMiningFeeController.prototype.onOpen = function () {
            console.log('BTC mining fee onOpen     ');
            var option = this.getMiningFeeOption();
            console.log(option);
            this.selectItem(option);
            // console.warn('Mining fee opens ')
            // console.log(this);
        };
        BitCoinMiningFeeController.prototype.getMiningFeePerByte = function () {
            if (this.testPrice)
                return this.testPrice;
            var option = this.getMiningFeeOption();
            var miningFeeData = this.getMinigFeeData();
            // console.log(miningFeeData);
            var price = miningFeeData ? miningFeeData[option] : this.config.miningFeePrice;
            // price = 20;
            // console.log('Price ' + price);
            return price;
        };
        BitCoinMiningFeeController.prototype.selectInput = function (el) {
            var name = el.data('id');
            if (this.selectedOption === name)
                return;
            if (this.$selected)
                this.$selected.prop('checked', false);
            el.prop('checked', true);
            this.$selected = el;
            this.selectedOption = name;
            this.setMiningFeeOption(name);
        };
        BitCoinMiningFeeController.prototype.onSelect = function (el) {
            console.error(el);
            var chk = el.find('.cssMiningFeeRadioBtn input');
            this.selectInput(chk);
        };
        return BitCoinMiningFeeController;
    }());
    jaxx.BitCoinMiningFeeController = BitCoinMiningFeeController;
})(jaxx || (jaxx = {}));
//# sourceMappingURL=bit-coin-mining-fee-controller.js.map