module Application {
    'use strict';

    export class AcademicIdentityStepController extends BaseStepController {

        // Dependencies on services
        static $inject = ['$scope', '$q', 'ApplicationWizardService'];
        private showSubmitBtn: boolean;
        public model: any;
        public student: IStudentDto;
        public application: IApplicationDto;
        public activeAcademicYearLabel:string;
        //title ="AcademicIdentityStep";

        // Controller constructor, dependency instances will be passed in the order of $inject
        constructor($scope: ng.IScope, $q: ng.IQService, applicationWizard: IWizardService) {
            super($scope, $q, applicationWizard);
            this.model = {academicIdNumber: '', amka:'', isAmkaNumber: true, applicationType: applicationWizard.getApplicationType()};
            this.student = applicationWizard.application.student || null;
            this.application = applicationWizard.application || null;   
            this.activeAcademicYearLabel = applicationWizard.getActiveAcademicYearLabel();        
            this.showSubmitBtn = false;
        }

        public canLeave() {
            var self = this;
            return self.student != null && self.application.applicationStatus > 0;
        }

        public canEnter() {
            return true;
        }

        public getAcademicIDData() {
            var self = this;
            self.applicationWizard.getAcademicIDData(self.model)
                .then(function (result) {
                    self.student = result;
                    self.showSubmitBtn = true;
                }, function (error) { });
        }

        public save() {
            var self = this;
            var data = {
                applicationId: self.applicationWizard.applicationId,
                applicationType: self.applicationWizard.getApplicationType(),
                specialCategory: self.applicationWizard.getApplicationSpecialCategory(),
                academicIDNumber: self.model.academicIdNumber,
                isAmkaNumber: self.model.isAmkaNumber,
                studentAMKA: self.model.amka,
                mitrwoConsent: self.applicationWizard.getMitrwoConsent()
            };
            self.applicationWizard.saveApplicationStudent(data)
                .then(function (result) {
                    if (self.application.applicationStatus == enApplicationStatus.New) {
                        if (self.applicationWizard.getApplicationType() == enApplicationType.Guardian) {
                            self.application.applicationStatus = enApplicationStatus.StudentTax;
                        }
                        else
                        {
                            self.application.applicationStatus = enApplicationStatus.ParentTax;
                        }
                    }
                    self.navigation.goToNextStep();
                    self.showSubmitBtn = false;
                }, function (error) {
                });
        }


        public startOver() {
            var self = this;
            self.student = null;
        }

        public cancel() {
            location.href = '../Index';
        }

        public showSubmit() {
            var self = this;
            return self.student != null && self.showSubmitBtn;
        }

        public getStepApplicationStatus()
        {
            return enApplicationStatus.New;
        }

        // check the cancellation date and show message
        public showCanceledAtMessage()
        {
            var self = this;
            var splitted = this.applicationWizard.getActiveAcademicYearLabel().split('-', 2);   
            var startDate = new Date(parseInt(splitted[0]), 8, 1);
            var endDate = new Date(parseInt(splitted[1]), 7, 31);
     
            // if the date is before the start date then the AcademicIdentity card should have been in the special allowed canceled paso list, so we have to show the message
            if (self.student != null &&  new Date(self.student.academicIdCanceledAt+"") <= endDate )
            {
                return true;
            }
            return false;
        }

        public areParentsAbroad() {
            
            var specialCategory = this.applicationWizard.getApplicationSpecialCategory();
            
            return specialCategory == enSpecialCategory.ParentsAbroad;                
        }
    }

    ApplicationModule.controller('AcademicIdentityStepController', AcademicIdentityStepController);
}

