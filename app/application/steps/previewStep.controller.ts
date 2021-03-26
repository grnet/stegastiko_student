module Application {
    'use strict';

    export class PreviewStepController extends BaseStepController {

        // Dependencies on services
        static $inject = ['$scope', '$uibModal', '$q', 'ApplicationWizardService'];
        public model: any;
        public application: IApplicationDto;

        // Controller constructor, dependency instances will be passed in the order of $inject
        constructor($scope: ng.IScope, private $uibModal: any, $q: ng.IQService, applicationWizard: IWizardService) {
            super($scope, $q, applicationWizard)
            this.application = applicationWizard.application || null;

            this.model = {};
            this.model.usageTermsChecked = this.application.hasAcceptedTerms;
        }

        public canLeave() {
            return this.application.applicationStatus == 5;
        }

        public canEnter() {
            return true;
        }

        public save() {
            var self = this;
            $(':button[name="submitAndCheck"]').prop('disabled', true);
            self.applicationWizard.submitApplication(self.applicationWizard.applicationId)
                .then(function (result) {
                    $('body').removeClass('modal-open');
                    $('.modal-backdrop').remove();
                    //self.scope.$parent.vm.goToNextStep();
                    location.href = "../../../Application/Preview/" + self.applicationWizard.applicationId;
                }, function (error) {
                    $(':button[name="submitAndCheck"]').prop('disabled', false);
                });
        }

        public doCheck() {
            var self = this;
            self.applicationWizard.saveCheckedUsageTerms(self.applicationWizard.applicationId).
                then(function (result) {
                    self.application = result;
                    self.model.usageTermsChecked = self.application.hasAcceptedTerms;
                    self.application.rentalContractStartDate = result.rentStartDate;
                    self.application.rentalContractEndDate = result.rentEndDate;
                    self.application.rentalContractLength = result.rentContractLength;
                }, function (error) {
                });
        }

        //public printTerms() {
        //    window.frames["ifUsageTerms"].focus();
        //    window.frames["ifUsageTerms"].print();
        //}

        public getUserAddress() {
            if (this.application.user.address != null) {
                return this.application.user.address;
            }
            else {
                return "ΤΚ " + this.application.user.zipCode + ", " + this.application.user.cityName + ", " + this.application.user.prefectureName;
            }
        }

        public canSubmit() {
            return this.model.usageTermsChecked;
        }

        public printTerms() {
            var me = this;

            var modalInstance = this.$uibModal.open({
                templateUrl: me._getTemplate('../../../Content/pages/modalUsageTerms.html'),
                size: "lg",
                windowClass: 'myNewModal-modal-window',
                controller: "ApplicationModalInstanceController as vm"
            });

            modalInstance.result.catch(function (err) {
            });
        }

        private _getTemplate(url: string) {
            return [url].join('');
        }

        public hasOtherDegree() {
            if (this.application.student.hasOtherDegree == true) {
                return "ΝΑΙ";
            }
            return "ΟΧΙ";
        }

        public isEUCitizen() {
            if (this.application.student.isEUCitizen == true) {
                return "ΝΑΙ";
            }
            return "ΟΧΙ";
        }

        public getMitrwoConsent() {
            if (this.application.mitrwoPolitwnConsent == true || this.applicationWizard.getMitrwoConsent()) {
                return "ΝΑΙ";
            }
            return "ΟΧΙ";
        }

        public showMitrwoConsent() {
            if (this.applicationWizard.getApplicationSpecialCategory() == enSpecialCategory.Orphan
                || this.application.parentsAreDivorced
                || this.application.otherParentHasDied) {
                return true;
            }
            return false;
        }

        public getLabelSpecialCategory() {

            var specialCategory = this.applicationWizard.getApplicationSpecialCategory();
            var taxYear = this.applicationWizard.getTaxYear();
            var startYear = taxYear - 26;
            /*
                Orphan = 1,
                ParentsAbroad = 2,
                Over25 = 3,
                NotProtectedMember = 4
            */
            if (specialCategory == enSpecialCategory.Orphan) {
                return "Ορφανός από τους 2 γονείς";
            }
            else if (specialCategory == enSpecialCategory.ParentsAbroad) {
                return "Οι γονείς είναι κάτοικοι εξωτερικού";
            }
            else if (specialCategory == enSpecialCategory.Over25) {
                return "Ο φοιτητής κατά το φορολογικό έτος " + taxYear + " ήταν πάνω από είκοσι πέντε (25) ετών, είχε δηλαδή γεννηθεί μέχρι την 31/12/" + startYear;
            }
            else if (specialCategory == enSpecialCategory.NotProtectedMember) {
                return "Ο φοιτητής είναι υπόχρεος σε υποβολή φορολογικής δήλωσης και δεν θεωρείται εξαρτώμενο μέλος, σύμφωνα με το άρθρο 11 του ν. 4172/ 2013(Α' 167)";
            }
            else {
                return "";
            }
        }

        public areParentsAbroad() {

            var specialCategory = this.applicationWizard.getApplicationSpecialCategory();

            return specialCategory == enSpecialCategory.ParentsAbroad;
        }

        //public getEntryYear() {
        //    if (this.application.student != null) {
        //        var amkaYear = parseInt(this.application.student.studentAMKA.substr(4, 2));
        //        if (amkaYear > -1) {
        //            var today = new Date();
        //            var year = today.getFullYear()
        //            if (amkaYear > year - 2000) {
        //                return amkaYear + 1900 + 19;
        //            }
        //            else {
        //                return amkaYear + 2000 + 19;
        //            }
        //        }
        //        else {
        //            return -1;
        //        }
        //    }
        //}
    }

    ApplicationModule.controller('PreviewStepController', PreviewStepController);
}