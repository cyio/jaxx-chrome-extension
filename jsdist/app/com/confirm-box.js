var jaxx;
(function (jaxx) {
    // confirm box will show on the bottom of screen with 2 buttons name specified in array. default value ACCEPT, DECLINE
    // callback function return label of button user clicked
    // message not implemented at this moment
    // extra classes will be added to confirm view to have custom background colors
    /*
        usage
    
        ConfirmBox.show('message',
            {
                extraClasses:'red alert',
                buttons:['YES','NO'],
                callBack:(label:string, target:JQuery)=>{
                            console.log(label);
                        }
            }
        );*/
    var ConfirmBox = (function () {
        function ConfirmBox(id) {
            this.id = id;
            ConfirmBox.instance = this;
        }
        ConfirmBox.prototype.init = function () {
            var str = $('#ConfirmTemplate').text();
            this.$view = $(str);
            this.$view.attr('id', 'ConfirmComponent');
            this.$buttons = this.$view.find('.btn');
            //Registry.USER$.on(Registry.USER_CLICK, ()=> this.hide());
            //this.buttonsContainer = this.$view.find('.cssInnerBoxCallToAction').first();
        };
        /// removes current confirm message from screen
        ConfirmBox.prototype.hide = function () {
            var _this = this;
            ConfirmBox.currentMessage = null;
            this.$view.addClass('hidden');
            setTimeout(function () { return _this.$view.remove(); }, 1000);
        };
        // to hide current confirm box on application level
        ConfirmBox.hide = function () {
            ConfirmBox.currentMessage = null;
            ConfirmBox.instance.hide();
        };
        // show confirmation box with callback
        ConfirmBox.prototype.show = function (message, callBack, options) {
            var _this = this;
            if (!this.$view)
                this.init();
            var btns = this.$buttons;
            var self = this;
            if (options.extraClasses)
                this.$view.addClass(options.extraClasses);
            if (options.buttons) {
                btns.each(function (i, item) {
                    var btn = $(item);
                    btn.click(function (evt) {
                        self.hide();
                        callBack(btn.text(), evt.currentTarget);
                    });
                    if (i < options.buttons.length) {
                        var text = options.buttons[i];
                        if (text) {
                            btn.text(text);
                            btn.show();
                        }
                    }
                    else
                        btn.hide();
                });
            }
            this.$view.appendTo('body');
            setTimeout(function () { return _this.$view.removeClass('hidden'); }, 200);
        };
        /// confirm box accessible on application level
        ConfirmBox.show = function (message, callBack, options) {
            if (ConfirmBox.currentMessage === message)
                return;
            ConfirmBox.currentMessage = message;
            ConfirmBox.instance.show(message, callBack, options);
        };
        return ConfirmBox;
    }());
    jaxx.ConfirmBox = ConfirmBox;
    jaxx.Registry.register(new ConfirmBox('ConfirmBox'));
})(jaxx || (jaxx = {}));
//# sourceMappingURL=confirm-box.js.map