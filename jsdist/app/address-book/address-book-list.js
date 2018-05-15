// list component stored all addresses in local storage, retrieve data on demand, display addresses in a list
var jaxx;
(function (jaxx) {
    var AddressBookList = (function () {
        function AddressBookList() {
            this.addresses = [];
        }
        // save all addresses in local storage
        AddressBookList.prototype.save = function () {
            var addresses = this.getAddresses();
            addresses.forEach(function (item, i) {
                if (!item.id)
                    item.id = Date.now() + i;
            });
            //console.warn('saving ', addresses);
            localStorage.setItem('address-book', JSON.stringify(addresses));
        };
        // restored all addresses from local storage
        AddressBookList.prototype.getStoredAddresse = function () {
            return JSON.parse(localStorage.getItem('address-book') || '[]');
        };
        // returns all addresses of address book
        AddressBookList.prototype.getAddresses = function () {
            return this.addresses.map(function (item) { return item.getAddress(); });
        };
        // added new created address and saves it
        AddressBookList.prototype.addAddress = function (address) {
            var _this = this;
            address.id = Date.now();
            var view = new jaxx.AddressBookItem(address);
            view.onDelete = function (addr) { return _this.onDelete(addr); };
            view.onEdit = function (addr) { return _this.onEdit(addr); };
            view.appendTo(this.$list);
            this.addresses.push(view);
            this.save();
            setTimeout(function () {
                _this.$list.animate({ scrollTop: _this.$list.prop("scrollHeight") - _this.$list.height() }, 'slow');
            }, 200);
        };
        // updates current value of address
        AddressBookList.prototype.updateAddress = function (address) {
            // console.log(' upadet ', address);
            var old = _.find(this.addresses, { id: address.id });
            if (old) {
                // console.log(old);
                old.updateAddress(address);
                this.save();
            }
            else
                console.warn(' no address with ID ' + address.id);
        };
        // removes view from display
        AddressBookList.prototype.remove = function () {
            this.$view.remove();
            this.$view = null;
        };
        // render list from template
        AddressBookList.prototype.render = function () {
            var _this = this;
            var addrs = this.getStoredAddresse();
            this.addresses = [];
            this.$list.html('');
            if (addrs.length === 0) {
                this.$list.html('<h4>You have no addresses in your address book</h4>');
            }
            else {
                addrs.forEach(function (item) {
                    var addr = new jaxx.AddressBookItem(item);
                    addr.appendTo(_this.$list);
                    addr.onDelete = function (addr) { return _this.onDelete(addr); };
                    addr.onEdit = function (addr) { return _this.onEdit(addr); };
                    _this.addresses.push(addr);
                });
            }
            ;
        };
        /// deletes address from list and save new array
        AddressBookList.prototype.deleteAddress = function (address) {
            var res = _.remove(this.addresses, { id: address.id });
            if (res.length) {
                res.forEach(function (item) {
                    item.delete();
                });
            }
            this.save();
        };
        // load addresses from storage and arrange it by sequence
        AddressBookList.prototype.loadAddresses = function () {
            var str = localStorage.getItem('address-book') || '[]';
            var addresses = JSON.parse(str);
            return _.orderBy(addresses, 'seq');
        };
        AddressBookList.prototype.init = function () {
        };
        /// this is abstract function required for controller
        AddressBookList.prototype.onEdit = function (addres) {
        };
        /// shows confirmation of delete address and delete address form address book
        AddressBookList.prototype.onDelete = function (address) {
            /// console.warn(address);
            var _this = this;
            jaxx.components.ConfirmModal.show('Delete address', 'Are you sure you want to delete <strong>' + address.label + ' </strong> address? <br/> Deleting is permanent and cannot be undone.').then(function (res) {
                if (res === 'OK')
                    _this.deleteAddress(address);
            }).catch(function (err) {
                console.warn(err);
            });
            /*if(confirm('You want to delete '+ address.label+'?')){
                Navigation.openModal('Do you ')
                this.deleteAddress(address);
            }*/
        };
        /// appends view to display and add listeners to all buttons
        AddressBookList.prototype.appendTo = function (container) {
            var _this = this;
            var addresses = this.loadAddresses();
            var $view = $(AddressBookList.template);
            $view.appendTo(container);
            this.$list = $view.find('.list-group');
            var $btns = $view.find('[data-action]');
            $btns.click(function (item) {
                var $btn = $(item.currentTarget);
                switch (String($btn.data('action'))) {
                    case 'addAddress':
                        _this.onAddAddress($btn);
                        break;
                    case 'back':
                        _this.onBack($btn);
                        setTimeout(function () {
                            $view.remove();
                        }, 1000);
                        return;
                }
            });
            this.$view = $view;
            this.render();
            return $view;
        };
        return AddressBookList;
    }());
    jaxx.AddressBookList = AddressBookList;
})(jaxx || (jaxx = {}));
//# sourceMappingURL=address-book-list.js.map