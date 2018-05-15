var jaxx;
(function (jaxx) {
    var Animations;
    (function (Animations) {
        function removeFromList($view) {
            var ref = $view.addClass('move-out-right');
            setTimeout(function () {
                ref.remove();
            }, 1000);
        }
        Animations.removeFromList = removeFromList;
    })(Animations = jaxx.Animations || (jaxx.Animations = {}));
})(jaxx || (jaxx = {}));
//# sourceMappingURL=jaxx-animations.js.map