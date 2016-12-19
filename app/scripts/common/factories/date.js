;
define([
    'angular',
    'datejs'
], function (angular) {
    /**
     * 日期工场
     * */
    var dateFactory = function ($window) {
        var self = $window.Date;
        // 季度分配
        var seasons = [
            [0,1,2],
            [3,4,5],
            [6,7,8],
            [9,10,11]
        ];

        /**
         * 获取本周的日期范围
         * */
        self.toweek = function () {
            var today = self.today();
            return [today.clone().moveToDayOfWeek(0, -1), today.clone()];
        };
        /**
         * 获取本月的日期范围
         * */
        self.tomonth = function () {
            var today = self.today();
            return [today.clone().moveToFirstDayOfMonth(), today.clone()];
        };
        /**
         * 获取本季的日期范围
         * */
        self.toseason = function () {
            var today = self.today();
            var season = null;
            for (var i = 0; i < seasons.length; i ++) {
                if ($.inArray(today.getMonth(), seasons[i]) >= 0) {
                    season = seasons[i];
                    break;
                }
            }
            return [today.clone().set({ month: season[0], day: 1 }), today.clone()];
        };

        return self;
    };

    angular.module('amengsms.factories.date', [])
        .factory('date', ['$window', dateFactory]);
});