var Application;
(function (Application) {
    'use strict';
    var ApplicationController = (function () {
        // Controller constructor, dependency instances will be passed in the order of $inject
        function ApplicationController($location, $state, $window, applicationWizardService, appState) {
            this.$location = $location;
            this.$state = $state;
            this.$window = $window;
            this.applicationWizardService = applicationWizardService;
            this.appState = appState;
            this.steps = applicationWizardService.steps.slice();
        }
        ApplicationController.prototype.canGoToStep = function (stepName) {
            return stepName != 'publish';
        };
        ApplicationController.prototype.currentStep = function () {
            return this.applicationWizardService.getCurrentStep();
        };
        ApplicationController.prototype.goToNextStep = function () {
            var currentStep = this.currentStep();
            if (!currentStep) {
                this.navigateToStep(this.steps[0]);
            }
            else if (!currentStep.isLast) {
                var curIdx = this.steps.indexOf(currentStep);
                this.navigateToStep(this.steps[curIdx + 1]);
            }
        };
        ApplicationController.prototype.goToPreviousStep = function () {
            var currentStep = this.currentStep();
            if (!currentStep) {
                this.navigateToStep(this.steps[0]);
            }
            else if (!currentStep.isFirst) {
                var curIdx = this.steps.indexOf(currentStep);
                this.navigateToStep(this.steps[curIdx - 1]);
            }
        };
        ApplicationController.prototype.goToList = function () {
            this.$window.location.href = '/Application';
        };
        ApplicationController.prototype.navigateToStep = function (step) {
            this.$state.go(step.name, { applicationId: step.applicationId });
        };
        ApplicationController.prototype.getProtectedMemberCriterionFulfilled = function () {
            if (this.applicationWizardService.getApplicationType() == Application.enApplicationType.Guardian) {
                var cond = this.applicationWizardService.application == null || this.applicationWizardService.application.student == null || (this.applicationWizardService.application.student != null
                    && this.applicationWizardService.application.student.protectedMemberIncomeFulfilled !== false);
                return cond;
            }
            else {
                return true;
            }
        };
        return ApplicationController;
    }());
    // Dependencies on services
    ApplicationController.$inject = ['$location', '$state', '$window', 'ApplicationWizardService', 'appState'];
    Application.ApplicationController = ApplicationController;
    Application.ApplicationModule.controller('ApplicationController', ApplicationController);
})(Application || (Application = {}));
//# sourceMappingURL=application.controller.js.map