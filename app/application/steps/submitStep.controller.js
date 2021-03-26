var __extends = (this && this.__extends) || (function () {
    var extendStatics = Object.setPrototypeOf ||
        ({ __proto__: [] } instanceof Array && function (d, b) { d.__proto__ = b; }) ||
        function (d, b) { for (var p in b) if (b.hasOwnProperty(p)) d[p] = b[p]; };
    return function (d, b) {
        extendStatics(d, b);
        function __() { this.constructor = d; }
        d.prototype = b === null ? Object.create(b) : (__.prototype = b.prototype, new __());
    };
})();
var Application;
(function (Application) {
    'use strict';
    var SubmitStepController = (function (_super) {
        __extends(SubmitStepController, _super);
        // Controller constructor, dependency instances will be passed in the order of $inject
        function SubmitStepController($scope, $q, applicationWizard) {
            var _this = _super.call(this, $scope, $q, applicationWizard) || this;
            _this.application = applicationWizard.application;
            _this.taxYear = applicationWizard.getTaxYear();
            return _this;
        }
        SubmitStepController.prototype.canLeave = function () {
            return true;
        };
        SubmitStepController.prototype.canEnter = function () {
            return true;
        };
        return SubmitStepController;
    }(Application.BaseStepController));
    // Dependencies on services
    SubmitStepController.$inject = ['$scope', '$q', 'ApplicationWizardService'];
    Application.SubmitStepController = SubmitStepController;
    Application.ApplicationModule.controller('SubmitStepController', SubmitStepController);
})(Application || (Application = {}));
//# sourceMappingURL=submitStep.controller.js.map