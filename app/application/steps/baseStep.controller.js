var Application;
(function (Application) {
    'use strict';
    var BaseStepController = (function () {
        // Controller constructor, dependency instances will be passed in the order of $inject
        function BaseStepController($scope, $q, applicationWizard) {
            this.$scope = $scope;
            this.$q = $q;
            this.applicationWizard = applicationWizard;
            this.title = this.applicationWizard.getApplicationType() == Application.enApplicationType.Guardian ? 'Αίτησή μου ως δικαιούχος γονέας για το εξαρτώμενο τέκνο μου' : 'Αίτησή μου ως δικαιούχος φοιτητής';
            this.applicationWizard.setCurrentStep(this);
            this.navigation = $scope.$parent.vm;
            $scope.$on('$destroy', this.dispose.bind(this));
        }
        BaseStepController.prototype.canLeave = function () {
            return true;
        };
        BaseStepController.prototype.canEnter = function () {
            return true;
        };
        BaseStepController.prototype.dispose = function () {
            this.navigation = null;
            this.applicationWizard = null;
            //console.log(`Step disposed: ${this.title}`);
        };
        BaseStepController.prototype.isGuardian = function () {
            if (this.applicationWizard.application.applicationType != null) {
                return this.applicationWizard.application.applicationType === Application.enApplicationType.Guardian;
            }
            else {
                return this.applicationWizard.getApplicationType() === Application.enApplicationType.Guardian;
            }
        };
        return BaseStepController;
    }());
    // Dependencies on services
    BaseStepController.$inject = ['$scope', '$q', 'ApplicationWizardService'];
    Application.BaseStepController = BaseStepController;
    Application.ApplicationModule.controller('BaseStepController', BaseStepController);
})(Application || (Application = {}));
//# sourceMappingURL=baseStep.controller.js.map