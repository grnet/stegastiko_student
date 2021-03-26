var Reports;
(function (Reports) {
    'use strict';
    var ReportsIndexController = (function () {
        // Controller constructor, dependency instances will be passed in the order of $inject
        function ReportsIndexController($location, $window, $q, $http) {
            this.$location = $location;
            this.$window = $window;
            this.$q = $q;
            this.$http = $http;
            this.title = "The reports title";
            this.statistics = { totalCount: 200 };
            this.gridOptions = {
                columnDefs: [{
                        displayName: "Id",
                        name: "applicationId"
                    }, {
                        displayName: "Τύπος",
                        name: "applicationType"
                    }, {
                        displayName: "Όνομα Δικ.",
                        name: "userFirstName"
                    }, {
                        displayName: "Επώνυμο Δικ.",
                        name: "userLastName"
                    }, {
                        displayName: "Κατάσταση",
                        name: "applicationStatus"
                    }, {
                        displayName: "Ίδρυμα",
                        name: "institutionName"
                    }],
                data: []
            };
            // Suppress init loading of applications for now
            // this.refreshApplications();
        }
        ReportsIndexController.prototype.refreshApplications = function () {
            var _this = this;
            this.getApplications().then(function (applications) {
                _this.applicationCount = applications.totalCount;
                _this.gridOptions.data = applications.items;
            });
        };
        ReportsIndexController.prototype.getApplications = function () {
            return this.$http.get('/api/Application/Query?pageIndex=0')
                .then(function (result) { return result.data; });
        };
        return ReportsIndexController;
    }());
    // Dependencies on services
    ReportsIndexController.$inject = ['$location', '$window', '$q', '$http'];
    Reports.ReportsIndexController = ReportsIndexController;
    Reports.ReportsModule.controller('ReportsIndexController', ReportsIndexController);
})(Reports || (Reports = {}));
//# sourceMappingURL=reports.controller.js.map