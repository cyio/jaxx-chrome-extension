var __extends = (this && this.__extends) || (function () {
    var extendStatics = Object.setPrototypeOf ||
        ({ __proto__: [] } instanceof Array && function (d, b) { d.__proto__ = b; }) ||
        function (d, b) { for (var p in b) if (b.hasOwnProperty(p)) d[p] = b[p]; };
    return function (d, b) {
        extendStatics(d, b);
        function __() { this.constructor = d; }
        d.prototype = b === null ? Object.create(b) : (__.prototype = b.prototype, new __());
    };
})();
var jaxx;
(function (jaxx) {
    var CoinController = jaxx.CoinController;
    var CoinControllerMiningFeeExtension = (function (_super) {
        __extends(CoinControllerMiningFeeExtension, _super);
        function CoinControllerMiningFeeExtension() {
            return _super !== null && _super.apply(this, arguments) || this;
        }
        return CoinControllerMiningFeeExtension;
    }(CoinController));
    jaxx.CoinControllerMiningFeeExtension = CoinControllerMiningFeeExtension;
})(jaxx || (jaxx = {}));
//# sourceMappingURL=coin-controller-mining-fee-extension.js.map