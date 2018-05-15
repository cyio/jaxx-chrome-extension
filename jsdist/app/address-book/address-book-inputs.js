/*
Form component to allow user input address and label
*
* */
var jaxx;
(function (jaxx) {
    var AddressBookInputs = (function () {
        function AddressBookInputs() {
        }
        /// when from is valid shows save button
        AddressBookInputs.prototype.showSaveButton = function () {
            this.$btnSave.show();
        };
        AddressBookInputs.prototype.showLabelHint = function () {
            this.labelHint = this.$view.find('[data-view=hintLabel]').fadeIn('fast');
        };
        AddressBookInputs.prototype.showAddressHint = function () {
            this.addressHint = this.$view.find('[data-view=hintAddress]').fadeIn('fast');
        };
        AddressBookInputs.prototype.hideAddressHint = function () {
            if (!this.addressHint)
                return;
            this.addressHint.fadeOut('fast');
            this.addressHint = null;
        };
        AddressBookInputs.prototype.hideLabelHint = function () {
            if (!this.labelHint)
                return;
            this.labelHint.fadeOut('fast');
            this.labelHint = null;
        };
        //////////////////////////////////////////////////////////////// end hints section
        AddressBookInputs.prototype.addListeners = function () {
            var _this = this;
            // label input
            var $el = this.$label;
            $el.focus(function () { return _this.hideLabelHint(); });
            $el.blur(function () {
                var label = String(_this.$label.val());
                if (label.length < 2)
                    _this.showLabelHint();
                _this.validate();
            });
            $el.on('input', function () { return _this.validate(); });
            ////address
            $el = this.$address;
            $el.blur(function () {
                var val = String(_this.$address.val());
                console.log(val, val.length);
                if (val.length < 10)
                    _this.showAddressHint();
                _this.validate();
            });
            $el.on('input', function () { return _this.validate(); });
            $el.focus(function () { return _this.hideAddressHint(); });
            this.$btnSave.click(function () {
                var label = String(_this.$label.val());
                var address = String(_this.$address.val());
                jaxx.DataValidator.securityCheckData({ label: label, address: address });
                if (!_this.currentAddress)
                    _this.currentAddress = {
                        id: 0,
                        label: label,
                        address: address,
                        seq: 20
                    };
                else {
                    _this.currentAddress.label = label;
                    _this.currentAddress.address = address;
                }
                _this.onSave(_this.currentAddress);
            });
            this.$btnBack.click(function () {
                _this.onBack();
                setTimeout(function () {
                    _this.$view.remove();
                }, 1000);
            });
        };
        //////////////// validation form /////////////
        AddressBookInputs.prototype.validate = function () {
            var label = String(this.$label.val());
            var address = String(this.$address.val());
            if (label.length > 1 && address.length > 9)
                this.showSaveButton();
            else
                this.$btnSave.hide();
            //console.log(label, address);
        };
        ///////// return current address edited by user
        AddressBookInputs.prototype.getAddress = function () {
            return this.currentAddress;
        };
        AddressBookInputs.prototype.setAddress = function (address) {
            this.currentAddress = address;
            this.render();
        };
        //////////////// renderer
        AddressBookInputs.prototype.render = function () {
            var address = this.currentAddress;
            if (this.$view && address) {
                this.$label.val(address.label);
                this.$address.val(address.address);
            }
        };
        ///////////////// appends view to display
        AddressBookInputs.prototype.appendTo = function ($body) {
            var _this = this;
            var $view = $('<div>').addClass('menu-page').html(AddressBookInputs.template);
            $body.append($view);
            this.$btnSave = $view.find('[data-action=save]');
            this.$label = $view.find('[data-input=label]');
            this.$address = $view.find('[data-input=address]');
            this.$btnBack = $view.find('[data-action=back]');
            this.$btnSave.hide();
            this.$view = $view;
            setTimeout(function () { return _this.addListeners(); }, 200);
            // setTimeout(()=>this.showSaveButton(), 2000);
            return $view;
        };
        return AddressBookInputs;
    }());
    jaxx.AddressBookInputs = AddressBookInputs;
})(jaxx || (jaxx = {}));
//# sourceMappingURL=address-book-inputs.js.map