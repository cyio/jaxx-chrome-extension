var JaxxShapeShiftHelper = function () {
    this._base = "https://shapeshift.io/";
    this._entrypoint_marketinfo = this._base + "marketinfo/";
    this._entrypoint_shift = this._base + "shift/";
    this._avatarImage = 'images/ui_elements/shapeShift-small-icon.png';
    this._triggered = false;
    this._currentShiftParams = null;
    this._updateShiftMarketTaskID = null;
    this._receivePair = [];

    for (var i = 0; i < COIN_NUMCOINTYPES; i++) {
        if (i === COIN_BITCOIN) {
            this._receivePair[i] = COIN_ETHEREUM;
        } else {
            this._receivePair[i] = COIN_BITCOIN;
        }
    }

    this._initMarketData = [];
};

JaxxShapeShiftHelper.networkDefinitions = {
    "apiKey": "180aaede8f5451a52847824f4965cc25f43a5d2bb49f483c1f1ecc8afad661b65e22a01046bfd67257e31189b48f5a1ec35207653bd017f8203f4241c763074a",
};

JaxxShapeShiftHelper.prototype.initialize = function () {

};

JaxxShapeShiftHelper.prototype.getIsTriggered = function () {
    return this._triggered;
};

JaxxShapeShiftHelper.prototype.setIsTriggered = function (triggered) {
    this._triggered = triggered;
};

JaxxShapeShiftHelper.prototype.reset = function () {
    this.clearUpdateIntervalIfNecessary();
    this._marketData = JSON.parse(JSON.stringify(this._initMarketData));
    this._triggered = false;
};

JaxxShapeShiftHelper.prototype.loadReceivePairForCoinType = function (symbolSend, symbolReceive, callBack) {
    var pair = symbolSend + '_' + symbolReceive;
    var self = this;

    RequestSerializer.getJSON(this._entrypoint_marketinfo + pair, function (data, status, param) {
        callBack(data);
    }, true, null);
};

JaxxShapeShiftHelper.prototype.getReceivePairForCoinType = function (coinType) {
    return this._receivePair[coinType];
};

JaxxShapeShiftHelper.prototype.getMarketForCoinTypeSend = function (coinType) {
    var coinPair = this.getReceivePairForCoinType(coinType);
    return this._marketData[coinType][coinPair];
};

JaxxShapeShiftHelper.prototype.getMarketMinimumForCoinTypeSend = function (coinType) {
    return this._marketData[coinType][this.getReceivePairForCoinType(coinType)].depositMin;
};

JaxxShapeShiftHelper.prototype.clearUpdateIntervalIfNecessary = function (coinType) {
    clearInterval(this._updateShiftMarketTaskID);
    this._updateShiftMarketTaskID = null;
};

JaxxShapeShiftHelper.prototype.updateShapeShiftMarket = function (curMarketData) {
    var self = this;

    RequestSerializer.getJSON(this._entrypoint_marketinfo + curMarketData.pair, function (data, status, param) {
        self.updateShapeshiftMarketInfoCallback(data, status, param);
    }, true, curMarketData);
};

JaxxShapeShiftHelper.prototype.isMultiShiftValid = function (coinType, numShiftsRequired) {
    var timestamp = new Date().getTime();
    var curMarketData = this.getMarketForCoinTypeSend(coinType);
    var coinTypeDict = this.getPairCoinTypeDict(curMarketData.pair);
    var receiveAddress = wallet.getPouchFold(coinTypeDict.receive).getCurrentReceiveAddress();
    var returnAddress = wallet.getPouchFold(coinTypeDict.send).getCurrentReceiveAddress();
    var depositeAddress = wallet.getPouchFold(curCoinType).getShapeShiftDepositAddress();
    var isPreviousMultiShiftInvalid = false;

    if (this._currentShiftParams !== null) {
        var shiftHasTimedOut = (timestamp - this._currentShiftParams.timestamp) > 3 * 60 * 1000;

        if (this._currentShiftParams.numShiftsTotal !== numShiftsRequired ||
            this._currentShiftParams.receiveAddress !== receiveAddress ||
            this._currentShiftParams.returnAddress !== returnAddress ||
            this._currentShiftParams.shiftMarketData.depositAddress !== depositeAddress ||
            shiftHasTimedOut
        ) {
            isPreviousMultiShiftInvalid = true;
        }
    } else {
        isPreviousMultiShiftInvalid = true;
    }

    return !isPreviousMultiShiftInvalid;
};

JaxxShapeShiftHelper.prototype.getMultiShiftResults = function (coinType, numShiftsRequired) {
    var isShiftComplete = true;

    if (this.isMultiShiftValid(coinType, numShiftsRequired)) {
        for (var i = 0; i < numShiftsRequired; i++) {
            if (this._currentShiftParams.shiftMarketData.multiShift[i].depositAddress === null) {
                isShiftComplete = false;
            }
        }
    } else {
        isShiftComplete = false;
    }

    if (isShiftComplete) {
        return this._currentShiftParams.shiftMarketData;
    } else {
        return null;
    }
};

JaxxShapeShiftHelper.prototype.requestMultiShift = function (coinType, numShiftsRequired, callback) {
    // This function makes a request to ShapeShift's API for the target coin and then after saving the deposit address
    // and request timestamp it uses the callback given in our parameters
    var timestamp = new Date().getTime();
    var curMarketData = this.getMarketForCoinTypeSend(coinType);
    var coinTypeDict = this.getPairCoinTypeDict(curMarketData.pair);
    var receiveAddress = wallet.getPouchFold(coinTypeDict.receive).getCurrentReceiveAddress();
    var returnAddress = wallet.getPouchFold(coinTypeDict.send).getCurrentReceiveAddress();
    var isPreviousMultiShiftInvalid = !this.isMultiShiftValid(coinType, numShiftsRequired);

    if (isPreviousMultiShiftInvalid === true) {
        if (curMarketData.depositMax == null || curMarketData.depositMin == null || curMarketData.exchangeRate == null) {
            //@note: @todo: @here: refresh the shapeshift info.
        } else {
            var self = this;
            g_JaxxApp.getUI().beginShapeShiftMultiShift();
            curMarketData.multiShift = [];

            var shiftOptions = {
                withdrawal: receiveAddress,
                pair: curMarketData.pair,
                returnAddress: returnAddress,
                apiKey: JaxxShapeShiftHelper.networkDefinitions.apiKey
            };

            for (i = 0; i < numShiftsRequired; i++) {
                curMarketData.multiShift.push({depositAddress: null, timestamp: null});
            }

            var shiftParams = {
                numShiftsTotal: numShiftsRequired,
                numShiftsPassed: 0,
                numShiftsFailed: 0,
                completionCallback: callback,
                shiftMarketData: curMarketData,
                receiveAddress: receiveAddress,
                returnAddress: returnAddress,
                timestamp: timestamp
            };

            this._currentShiftParams = shiftParams;

            for (i = 0; i < numShiftsRequired; i++) {
                var passthroughParams = {curMarketData: curMarketData, multiShiftDataIndex: i, shiftParams: shiftParams}
                jaxx.Registry.currentTransactionTemp = shiftOptions;

                RequestSerializer.postJSON(this._entrypoint_shift, shiftOptions, function (shiftInfo, status, passthroughParams) {
                    if (!shiftInfo || status !== 'success' || shiftInfo.error) {
                        console.error("JaxxShapeShiftHelper :: requestMultiShift :: error :: while attempting the shift :: " + (shiftInfo && shiftInfo.error) ? " :: shiftInfo.error :: " + shiftInfo.error : "");
                        jaxx.Registry.currentTransactionTemp = null;
                        passthroughParams.shiftParams.numShiftsFailed++;
                    } else {
                        passthroughParams.shiftParams.numShiftsPassed++;
                        var sendType = self.getCoinTypeForAbbreviatedName(shiftInfo.depositType.toLowerCase());
                        var receiveType = self.getCoinTypeForAbbreviatedName(shiftInfo.withdrawalType.toLowerCase());
                        self._marketData[sendType][receiveType].depositAddress = shiftInfo.deposit; // An error here means that Shapeshift was not able to fetch a valid address to deposit the bitcoins.
                        self._marketData[sendType][receiveType].timestamp = new Date().getTime();
                        self._marketData[sendType][receiveType].multiShift[passthroughParams.multiShiftDataIndex].depositAddress = shiftInfo.deposit;
                        self._marketData[sendType][receiveType].multiShift[passthroughParams.multiShiftDataIndex].timestamp = new Date().getTime();
                        //@note: @todo: @next: @here: only callback when actually completed.
                    }

                    if (passthroughParams.shiftParams.numShiftsTotal === passthroughParams.shiftParams.numShiftsPassed + passthroughParams.shiftParams.numShiftsFailed) {
                        g_JaxxApp.getUI().endShapeShiftMultiShift();
                        passthroughParams.shiftParams.completionCallback(passthroughParams.shiftParams);
                    }

                }, true, passthroughParams);
            }
        }
    } else {
        console.log("JaxxShapeShiftHelper :: requestMultiShift unnecessary");
    }
};
