///<reference path="../Registry.ts"/>
/*
*Address Scratch Pad  module
* This feature will allow users to store external addresses and will make it easy to send funds to external addresses. This feature will also have a link to block explorer where users can easily check funds and transactions and copy to clipboard.
*
* */
var jaxx;
(function (jaxx) {
    var AddressBookController = (function () {
        function AddressBookController() {
            var _this = this;
            //content:JQuery;
            this.id = 'AddressBookController';
            jaxx.Registry.application$.on(jaxx.Registry.ON_APPLICATION_READY, function (e) { return _this.load(function () { }); });
            jaxx.Registry.application$.on(jaxx.Registry.SHOW_ADDRESS_BOOK, function (e) { return _this.showAddressBook(); });
            jaxx.Registry.application$.on(jaxx.Registry.SHOW_ADDRESS_INPUT, function (e, addr) { return _this.showInputFields(addr); });
            jaxx.Registry.application$.on(jaxx.Registry.ADDRESS_BOOK_DELETE_ADDRESS, function (e, index) {
                var addrs = _this.list.getAddresses();
                if (addrs.length) {
                    var addr = addrs[index];
                    // console.log(addr);
                    if (addr)
                        _this.list.onDelete(addr);
                    else
                        console.warn(' no address index ' + index);
                }
            });
            $('#btnTemporaryAddressBook').click(function () { jaxx.Registry.application$.triggerHandler(jaxx.Registry.SHOW_ADDRESS_BOOK); });
            AddressBookController.instance = this;
        }
        // returns all adderesses stored in address book
        AddressBookController.prototype.getScratchPadAddresses = function () {
            return this.list.getAddresses();
        };
        // is address book empty
        AddressBookController.prototype.hasAddresses = function () {
            return this.getScratchPadAddresses().length != 0;
        };
        AddressBookController.prototype.hideAddressBook = function () {
            this.$view.remove();
            this.$view = null;
        };
        AddressBookController.prototype.showAddressBook = function () {
            if (!this.$view) {
                var div = this.list.appendTo($('body'));
                div.addClass('settings AddressBookList');
                this.$view = div;
            }
            Navigation.pushSettings('AddressBookList');
        };
        // interface to show input fields for address book
        AddressBookController.prototype.showInputFields = function (address) {
            //console.warn(address);
            var div = this.inputs.appendTo($('body'));
            div.addClass('settings AddressBookInputs');
            Navigation.pushSettings('AddressBookInputs');
            if (!address)
                address = { id: 0, label: '', address: '', seq: 20 };
            this.inputs.setAddress(address);
        };
        AddressBookController.prototype.addListeners = function () {
            var _this = this;
            this.inputs.onBack = function () {
                Navigation.popSettings();
            };
            this.inputs.onSave = function (address) {
                /// console.warn(address);
                if (address.id) {
                    _this.list.updateAddress(address);
                }
                else {
                    _this.list.addAddress(address);
                }
                // this.list.render();
                Navigation.popSettings();
            };
            this.list.onAddAddress = function () { return _this.showInputFields(null); };
            this.list.onEdit = function (addr) { return _this.showInputFields(addr); };
            this.list.onBack = function () {
                Navigation.popSettings();
                setTimeout(function () { return _this.hideAddressBook(); }, 1000);
            };
        };
        // initialize html after loaded
        AddressBookController.prototype.initTemplates = function (callBack) {
            var _this = this;
            jaxx.AddressBookInputs.template = this.div.children('#AddressBookInputs').html();
            jaxx.AddressBookList.template = this.div.children('#list').html();
            jaxx.AddressBookItem.template = this.div.children('#list-item').html();
            jaxx.components.ConfirmModal.template = this.div.children('#confirm').html();
            if (!jaxx.AddressBookInputs.template) {
                setTimeout(function () { return _this.initTemplates(callBack); }, 500);
                return;
            }
            this.list = new jaxx.AddressBookList();
            this.inputs = new jaxx.AddressBookInputs();
            this.addListeners();
            jaxx.Registry.application$.triggerHandler(jaxx.Registry.MODULE_REDY, this);
        };
        // load into module all required files
        AddressBookController.prototype.load = function (callBack) {
            var _this = this;
            // console.warn('init');
            this.$container = $('#ViewPortMain');
            this.div = $('<div>').load('js/app/address-book/address-book.html');
            var x1 = $.getScript('jsdist/app/address-book/address-book-inputs.js');
            var x2 = $.getScript('jsdist/app/address-book/address-book-item.js');
            var x3 = $.getScript('jsdist/app/address-book/address-book-list.js');
            $.when(this.div, x1, x2, x3).then(function (v0, v1, v2, v3) {
                //this.$main = $(v0.children('#main').html()).attr('id', 'AddressBookModule');         // console.warn(this.main);
                setTimeout(function () {
                    _this.initTemplates(callBack);
                }, 100);
            });
        };
        return AddressBookController;
    }());
    jaxx.AddressBookController = AddressBookController;
})(jaxx || (jaxx = {}));
// register module in application registry
jaxx.Registry.register(new jaxx.AddressBookController());
//# sourceMappingURL=address-book-controller.js.map