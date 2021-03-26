var Application;
(function (Application) {
    'use strict';
    var ApplicationModalInstanceController = (function () {
        function ApplicationModalInstanceController($scope, $uibModalInstance) {
            this.$scope = $scope;
            this.$uibModalInstance = $uibModalInstance;
        }
        ApplicationModalInstanceController.prototype.cancel = function () {
            this.$uibModalInstance.dismiss('cancel');
        };
        ApplicationModalInstanceController.prototype.print = function () {
            window.frames["ifUsageTerms"].focus();
            window.frames["ifUsageTerms"].print();
        };
        return ApplicationModalInstanceController;
    }());
    ApplicationModalInstanceController.$inject = ['$scope', '$uibModalInstance'];
    Application.ApplicationModalInstanceController = ApplicationModalInstanceController;
    Application.ApplicationModule.controller('ApplicationModalInstanceController', ApplicationModalInstanceController);
})(Application || (Application = {}));
//# sourceMappingURL=application.modalInstance.controller.js.map