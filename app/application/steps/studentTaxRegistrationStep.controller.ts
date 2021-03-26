module Application {
    'use strict';

    export class StudentTaxRegistrationStepController extends BaseStepController {
        
        // Dependencies on services
        static $inject = ['$scope', '$q', 'ApplicationWizardService'];
        private canSubmit: boolean;
        public model: any;
        public application: IApplicationDto;

        // Controller constructor, dependency instances will be passed in the order of $inject
        constructor($scope: ng.IScope, $q: ng.IQService, applicationWizard: IWizardService) {
            super($scope, $q, applicationWizard)
            this.model = {};
            this.application = applicationWizard.application || null;            
            this.canSubmit = false;
            this.model.StudentLastName = this.application.student.studentLastName;
            this.model.StudentFirstName = this.application.student.studentFirstName;
            this.model.applicationId = this.applicationWizard.applicationId;
        }

        public canLeave() {
            var self = this;
            return self.application.student != null && self.application.applicationStatus > enApplicationStatus.StudentTax;
        }

        public canEnter() {
            return true;
        }

        public save() {
            var self = this;
            var data = {
                applicationId: self.applicationWizard.applicationId,
                studentAFM: self.model.StudentAFM,
                studentLastName: self.application.student.studentLastName,
                studentFirstName: self.application.student.studentFirstName
            };
            self.applicationWizard.saveStudentAFM(data)
                .then(function(result) {
                    self.application = result;
                    self.canSubmit = false;
                    if (self.application.applicationStatus == enApplicationStatus.StudentTax) {
                        self.application.applicationStatus = enApplicationStatus.ParentTax;
                    }
                    self.navigation.goToNextStep();
                }, function(error) {
                });
        }

        public getStudentGsisData() {
            var self = this;
            self.applicationWizard.getStudentGsisData(self.model)
                .then(function(result) {
                    self.application.student = result;
                    self.canSubmit = true;
                }, function(error) {
                });
        }

        public startOver() {
            var self = this;
            self.application.student.studentAFM = null;
        }


        public showSubmitBtn() {
            var self = this;
            return self.application.applicationStatus == enApplicationStatus.StudentTax || self.canSubmit;
        }

        public isEUCitizen() {
            if (this.application.student.isEUCitizen == true) {
                return "ΝΑΙ";
            }
            return "ΟΧΙ";
        }

        public getStepApplicationStatus()
        {
            return enApplicationStatus.StudentTax;
        }
    }

    ApplicationModule.controller('StudentTaxRegistrationStepController', StudentTaxRegistrationStepController);
}