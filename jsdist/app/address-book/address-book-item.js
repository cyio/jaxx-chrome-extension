/*
* one row in list of address book contains ability to ster actions edit and delete record
*
* */
var jaxx;
(function (jaxx) {
    var AddressBookItem = (function () {
        function AddressBookItem(address) {
            this.address = address;
            this.id = address.id;
            this.outsideClickHandler = this.onClickOutside.bind(this);
        }
        AddressBookItem.prototype.onEdit = function (address) {
            console.error(' override this function');
        };
        ;
        AddressBookItem.prototype.onDelete = function (address) {
            console.error(' override this function');
        };
        // return current row value
        AddressBookItem.prototype.getAddress = function () {
            return this.address;
        };
        // renders template into view
        AddressBookItem.prototype.render = function () {
            var html = AddressBookItem.template.replace('{{address}}', this.address.address).replace('{{label}}', this.address.label);
            this.$view.html(html);
        };
        AddressBookItem.prototype.addListeners = function () {
            var _this = this;
            this.$editMenu = this.$view.find('.popup-menu');
            this.$editBtn = this.$view.find('.options');
            this.$editBtn.click(function () {
                _this.openEdit();
            });
            this.$view.find('[data-action]').click(function (item) {
                var $btn = $(item.currentTarget);
                // console.log($btn.data());
                switch (String($btn.data('action'))) {
                    case 'edit':
                        _this.onEdit(_this.address);
                        break;
                    case 'delete':
                        // console.log('delete');
                        _this.onDelete(_this.address);
                        break;
                    case 'copy':
                        jaxx.utils.Clipboard.copy(_this.address.address);
                        break;
                }
            });
        };
        AddressBookItem.prototype.onClickOutside = function () {
            var _this = this;
            document.removeEventListener('mousedown', this.outsideClickHandler);
            setTimeout(function () { return _this.closeEdit(); }, 300);
        };
        // opens edit popup
        AddressBookItem.prototype.openEdit = function () {
            if (!this.isEdit) {
                this.isEdit = true;
                document.addEventListener('mousedown', this.outsideClickHandler);
                this.$editMenu.show('fast');
            }
        };
        // close popup
        AddressBookItem.prototype.closeEdit = function () {
            if (!this.isEdit)
                return;
            this.isEdit = false;
            this.$editMenu.hide('fast');
        };
        // update address on display after it was edited
        AddressBookItem.prototype.updateAddress = function (address) {
            this.address.address = address.address;
            this.address.label = address.label;
            this.render();
            this.addListeners();
        };
        /// append row to list off all addresses
        AddressBookItem.prototype.appendTo = function ($cont) {
            this.$view = $('<li>').addClass('list-group-item');
            this.render();
            $cont.append(this.$view);
            this.addListeners();
        };
        // removes row from view
        AddressBookItem.prototype.delete = function () {
            jaxx.Animations.removeFromList(this.$view);
        };
        return AddressBookItem;
    }());
    jaxx.AddressBookItem = AddressBookItem;
})(jaxx || (jaxx = {}));
//# sourceMappingURL=address-book-item.js.map