module Application {
    'use strict';

    export interface IApplicationWizardNavigation {
        goToNextStep(): void;
        goToPreviousStep(): void;
        currentStep(): IWizardStep;
    }

    export class ApplicationController implements IApplicationWizardNavigation {

        // Dependencies on services
        static $inject = ['$location', '$state', '$window', 'ApplicationWizardService', 'appState'];

        // Properties / state of the controller
        steps: Array<IWizardStep>;
        applicationId: number;
        title: string;

        // Controller constructor, dependency instances will be passed in the order of $inject
        constructor(
            private $location: ng.ILocationService,
            private $state: angular.ui.IStateService,
            private $window: ng.IWindowService,
            private applicationWizardService: IWizardService,
            private appState: any) {
            this.steps = applicationWizardService.steps.slice();
        }

        public canGoToStep(stepName) {
            return stepName != 'publish';
        }

        public currentStep() {
            return this.applicationWizardService.getCurrentStep();
        }

        public goToNextStep() {
            var currentStep = this.currentStep();
            if (!currentStep) {
                this.navigateToStep(this.steps[0]);
            }
            else if (!currentStep.isLast) {
                var curIdx = this.steps.indexOf(currentStep);
                this.navigateToStep(this.steps[curIdx + 1]);
            }
        }

        public goToPreviousStep() {
            var currentStep = this.currentStep();
            if (!currentStep) {
                this.navigateToStep(this.steps[0]);
            }
            else if (!currentStep.isFirst) {
                var curIdx = this.steps.indexOf(currentStep);
                this.navigateToStep(this.steps[curIdx - 1]);
            }
        }

        public goToList() {
            this.$window.location.href = '/Application';
        }

        private navigateToStep(step) {
            this.$state.go(step.name, { applicationId: step.applicationId });
        }

        public getProtectedMemberCriterionFulfilled() {
            if (this.applicationWizardService.getApplicationType() == enApplicationType.Guardian) {
                var cond = this.applicationWizardService.application == null || this.applicationWizardService.application.student == null || (this.applicationWizardService.application.student != null
                    && this.applicationWizardService.application.student.protectedMemberIncomeFulfilled !== false);

                return cond;
            }
            else {
                return true;
            }
        }
    }

    ApplicationModule.controller('ApplicationController', ApplicationController);
}