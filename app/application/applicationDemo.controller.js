var Application;
(function (Application) {
    'use strict';
    var ApplicationDemoController = (function () {
        // Controller constructor, dependency instances will be passed in the order of $inject
        function ApplicationDemoController($location, $http, validationService, modalService) {
            this.$location = $location;
            this.$http = $http;
            this.validationService = validationService;
            this.modalService = modalService;
            this.title = 'this is the home page for authenticated user';
            this.isBusy = false;
            this.hitCount = 0;
            this.loadedAt = new Date().toString();
            this.applications = [];
        }
        ApplicationDemoController.prototype.increment = function () {
            this.hitCount++;
        };
        ApplicationDemoController.prototype.showModal = function (type) {
            console.log('SHOWMODAL');
            type = type || 'info';
            this.modalService[type]('Title!!', 'And the description goes here...');
        };
        ApplicationDemoController.prototype.refreshLoadedAt = function () {
            this.loadedAt = new Date().toString();
            var isAFM = this.validationService.checkIsAFM('106868386');
            var isAMKA1 = this.validationService.checkIsAMKA('08108700561');
            var isAMKA3 = this.validationService.checkIsAMKA('08108700564');
            var isAMKA4 = this.validationService.checkIsAMKA('26079101254');
            var isAMKA2 = this.validationService.checkIsAMKA('27037904632');
            var isAcademicId = this.validationService.checkIsAcademicId('166127033115');
        };
        ApplicationDemoController.prototype.getApplications = function () {
            var _this = this;
            this.isBusy = true;
            this.$http.get('/api/Application').then(function (result) {
                console.log(result);
                _this.applications = result.data;
            }).then(function () {
                _this.isBusy = false;
            });
        };
        return ApplicationDemoController;
    }());
    // Dependencies on services
    ApplicationDemoController.$inject = ['$location', '$http', 'ApplicationValidationService', 'ModalService'];
    Application.ApplicationDemoController = ApplicationDemoController;
    Application.ApplicationModule.controller('ApplicationDemoController', ApplicationDemoController);
})(Application || (Application = {}));
//# sourceMappingURL=applicationDemo.controller.js.map