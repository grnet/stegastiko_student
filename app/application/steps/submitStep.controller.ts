module Application {
    'use strict';

    export class SubmitStepController extends BaseStepController {        

        // Dependencies on services
        static $inject = ['$scope', '$q', 'ApplicationWizardService'];
        public application: IApplicationDto;
        public taxYear:number;
        // Controller constructor, dependency instances will be passed in the order of $inject
        constructor($scope: ng.IScope, $q: ng.IQService, applicationWizard: IWizardService) {
            super($scope, $q, applicationWizard)
            this.application = applicationWizard.application;   
            this.taxYear = applicationWizard.getTaxYear();      
        }

        public canLeave() {
            return true;
        }

        public canEnter() {
            return true;
        }
    }

    ApplicationModule.controller('SubmitStepController', SubmitStepController);
}