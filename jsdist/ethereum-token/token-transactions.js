/**
 * Created by Vlad on 11/10/2016.
 */
///<reference path="../com/models.ts"/>
///<reference path="../app/Registry.ts"/>
var jaxx;
(function (jaxx) {
    var TokenTransactions = (function () {
        function TokenTransactions() {
        }
        TokenTransactions.prototype.getNonce = function (address) {
            var url = 'http://api.etherscan.io/api?module=account&action=txlist&address={{address}}';
            url = url.replace('{{address}}', address);
            console.log(url);
            return $.get(url).then(function (result) {
                console.log(result);
                if (!result.result) {
                    throw new Error(result);
                }
                var arr = Array.isArray(result.result) ? result.result : [result.result];
                return arr.filter(function (item) {
                    return item.from == address;
                }).length;
            });
        };
        TokenTransactions.prototype.sendTransaction = function (contractAddress, toAddress, amount, gasLimit, gasPrice, myAddress, signature) {
            var _this = this;
            var promise = $.Deferred();
            this.getNonce(myAddress).done(function (nonce) {
                console.warn(' nonce ' + nonce);
                var data = _this.createData(amount, toAddress);
                console.log(data);
                var raw = _this.mapTransaction(thirdparty.web3, contractAddress, '0', nonce, gasPrice, gasLimit, data);
                console.log(raw);
                var transaction = new thirdparty.ethereum.tx(raw);
                console.log(transaction);
                transaction.sign(signature);
                var hex = transaction.serialize().toString('hex');
                _this._sendTransaction(hex).done(function (result) {
                    console.log(result);
                    promise.resolve(result);
                }).fail(promise.reject);
            });
            return promise;
        };
        TokenTransactions.prototype.createData = function (amount, address) {
            var ABI = parseInt(amount).toString(16);
            while (ABI.length < 64)
                ABI = '0' + ABI;
            address = address.substr(2);
            while (address.length < 64)
                address = '0' + address;
            var ethData = address + ABI;
            return '0xa9059cbb' + ethData;
        };
        TokenTransactions.prototype.mapTransaction = function (web3, addressTo, amount, nonce, gasPrice, gasLimit, data) {
            return {
                nonce: web3.toHex(nonce),
                gasPrice: web3.toHex(gasPrice),
                gasLimit: web3.toHex(gasLimit),
                to: addressTo,
                value: web3.toHex(amount),
                data: data
            };
        };
        TokenTransactions.prototype._sendTransaction = function (hex) {
            var url = 'https://api.etherscan.io/api?module=proxy&action=eth_sendRawTransaction&hex={{hex}}';
            url = url.replace('{{hex}}', hex);
            console.log(url);
            //return null
            return $.getJSON(url)
                .then(function (res) {
                return res;
            })
                .done(function (result) {
            })
                .fail(function (error) {
                console.error(error);
            });
        };
        TokenTransactions.prototype.destroy = function () {
        };
        return TokenTransactions;
    }());
    jaxx.TokenTransactions = TokenTransactions;
})(jaxx || (jaxx = {}));
//# sourceMappingURL=token-transactions.js.map