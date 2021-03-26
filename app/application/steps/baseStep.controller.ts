module Application {
    'use strict';

    export class BaseStepController implements ng.IController {

        // Dependencies on services
        static $inject = ['$scope', '$q', 'ApplicationWizardService'];

        protected navigation: IApplicationWizardNavigation;
        
        title: string = this.applicationWizard.getApplicationType() == enApplicationType.Guardian ? 'Αίτησή μου ως δικαιούχος γονέας για το εξαρτώμενο τέκνο μου' : 'Αίτησή μου ως δικαιούχος φοιτητής';
        // Controller constructor, dependency instances will be passed in the order of $inject
        constructor(
            protected $scope: any,
            protected $q: ng.IQService,
            protected applicationWizard: IWizardService
        ) {
            this.applicationWizard.setCurrentStep(this);            
            this.navigation = $scope.$parent.vm;
            $scope.$on('$destroy', this.dispose.bind(this));
        }

        public canLeave() {
            return true;
        }

        public canEnter() {
            return true;
        }

        public dispose() {
            this.navigation = null;
            this.applicationWizard = null;
            //console.log(`Step disposed: ${this.title}`);
        }

        public isGuardian() {            
            if (this.applicationWizard.application.applicationType != null) {
                return this.applicationWizard.application.applicationType === enApplicationType.Guardian;
            } else {                
                return this.applicationWizard.getApplicationType() === enApplicationType.Guardian;   
            }            
        }

    }

    ApplicationModule.controller('BaseStepController', BaseStepController);
}