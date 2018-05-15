var jaxx;
(function (jaxx) {
    var components;
    (function (components) {
        var ConfirmModal = (function () {
            function ConfirmModal() {
            }
            ConfirmModal.show = function (title, message) {
                //console.warn(ConfirmModal)
                var html = ConfirmModal.template.replace('{{title}}', title).replace('{{message}}', message);
                var confirm = $(html);
                $('body').append(confirm);
                confirm.fadeIn('fast');
                return new Promise(function (resolve, reject) {
                    // console.warn(confirm);
                    confirm.find('[data-action]').click(function (evt) {
                        resolve($(evt.currentTarget).data('action'));
                        confirm.fadeOut('fast', function () {
                            confirm.remove();
                        });
                    });
                });
            };
            return ConfirmModal;
        }());
        components.ConfirmModal = ConfirmModal;
    })(components = jaxx.components || (jaxx.components = {}));
    var utils;
    (function (utils) {
        var Clipboard = (function () {
            function Clipboard() {
            }
            Clipboard.copy = function (copyValue) {
                if (window.native && window.native.copyToClipboard) {
                    window.native.copyToClipboard(copyValue);
                }
                else {
                    var temp_textArea = document.getElementById('clipboard'); // we have a global text area ready to use for copying
                    temp_textArea.value = copyValue;
                    temp_textArea.select();
                }
                if (window.document.execCommand('copy')) {
                    Navigation.flashBanner('Address copied to clipboard.', 2, FlashBannerColor.SUCCESS);
                }
                else {
                    Navigation.flashBanner("Couldn't copy.", 2, FlashBannerColor.ERROR);
                }
            };
            return Clipboard;
        }());
        utils.Clipboard = Clipboard;
    })(utils = jaxx.utils || (jaxx.utils = {}));
})(jaxx || (jaxx = {}));
//# sourceMappingURL=clipboard.js.map