var jaxx;
(function (jaxx) {
    /**
     * Utility class for measuring the time taken for any actions
     * */
    var PerformanceMonitor = (function () {
        function PerformanceMonitor() {
            this.start();
        }
        PerformanceMonitor.prototype.start = function () {
            this.startTime = performance.now();
        };
        PerformanceMonitor.prototype.getExecutionTime = function () {
            return performance.now() - this.startTime;
        };
        return PerformanceMonitor;
    }());
    jaxx.PerformanceMonitor = PerformanceMonitor;
})(jaxx || (jaxx = {}));
//# sourceMappingURL=performance-monitor.js.map