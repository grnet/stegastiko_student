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
    var PreviewStepController = (function (_super) {
        __extends(PreviewStepController, _super);
        // Controller constructor, dependency instances will be passed in the order of $inject
        function PreviewStepController($scope, $uibModal, $q, applicationWizard) {
            var _this = _super.call(this, $scope, $q, applicationWizard) || this;
            _this.$uibModal = $uibModal;
            _this.application = applicationWizard.application || null;
            _this.model = {};
            _this.model.usageTermsChecked = _this.application.hasAcceptedTerms;
            return _this;
        }
        PreviewStepController.prototype.canLeave = function () {
            return this.application.applicationStatus == 5;
        };
        PreviewStepController.prototype.canEnter = function () {
            return true;
        };
        PreviewStepController.prototype.save = function () {
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
        };
        PreviewStepController.prototype.doCheck = function () {
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
        };
        //public printTerms() {
        //    window.frames["ifUsageTerms"].focus();
        //    window.frames["ifUsageTerms"].print();
        //}
        PreviewStepController.prototype.getUserAddress = function () {
            if (this.application.user.address != null) {
                return this.application.user.address;
            }
            else {
                return "ΤΚ " + this.application.user.zipCode + ", " + this.application.user.cityName + ", " + this.application.user.prefectureName;
            }
        };
        PreviewStepController.prototype.canSubmit = function () {
            return this.model.usageTermsChecked;
        };
        PreviewStepController.prototype.printTerms = function () {
            var me = this;
            var modalInstance = this.$uibModal.open({
                templateUrl: me._getTemplate('../../../Content/pages/modalUsageTerms.html'),
                size: "lg",
                windowClass: 'myNewModal-modal-window',
                controller: "ApplicationModalInstanceController as vm"
            });
            modalInstance.result.catch(function (err) {
            });
        };
        PreviewStepController.prototype._getTemplate = function (url) {
            return [url].join('');
        };
        PreviewStepController.prototype.hasOtherDegree = function () {
            if (this.application.student.hasOtherDegree == true) {
                return "ΝΑΙ";
            }
            return "ΟΧΙ";
        };
        PreviewStepController.prototype.isEUCitizen = function () {
            if (this.application.student.isEUCitizen == true) {
                return "ΝΑΙ";
            }
            return "ΟΧΙ";
        };
        PreviewStepController.prototype.getMitrwoConsent = function () {
            if (this.application.mitrwoPolitwnConsent == true || this.applicationWizard.getMitrwoConsent()) {
                return "ΝΑΙ";
            }
            return "ΟΧΙ";
        };
        PreviewStepController.prototype.showMitrwoConsent = function () {
            if (this.applicationWizard.getApplicationSpecialCategory() == Application.enSpecialCategory.Orphan
                || this.application.parentsAreDivorced
                || this.application.otherParentHasDied) {
                return true;
            }
            return false;
        };
        PreviewStepController.prototype.getLabelSpecialCategory = function () {
            var specialCategory = this.applicationWizard.getApplicationSpecialCategory();
            var taxYear = this.applicationWizard.getTaxYear();
            var startYear = taxYear - 26;
            /*
                Orphan = 1,
                ParentsAbroad = 2,
                Over25 = 3,
                NotProtectedMember = 4
            */
            if (specialCategory == Application.enSpecialCategory.Orphan) {
                return "Ορφανός από τους 2 γονείς";
            }
            else if (specialCategory == Application.enSpecialCategory.ParentsAbroad) {
                return "Οι γονείς είναι κάτοικοι εξωτερικού";
            }
            else if (specialCategory == Application.enSpecialCategory.Over25) {
                return "Ο φοιτητής κατά το φορολογικό έτος " + taxYear + " ήταν πάνω από είκοσι πέντε (25) ετών, είχε δηλαδή γεννηθεί μέχρι την 31/12/" + startYear;
            }
            else if (specialCategory == Application.enSpecialCategory.NotProtectedMember) {
                return "Ο φοιτητής είναι υπόχρεος σε υποβολή φορολογικής δήλωσης και δεν θεωρείται εξαρτώμενο μέλος, σύμφωνα με το άρθρο 11 του ν. 4172/ 2013(Α' 167)";
            }
            else {
                return "";
            }
        };
        PreviewStepController.prototype.areParentsAbroad = function () {
            var specialCategory = this.applicationWizard.getApplicationSpecialCategory();
            return specialCategory == Application.enSpecialCategory.ParentsAbroad;
        };
        return PreviewStepController;
    }(Application.BaseStepController));
    // Dependencies on services
    PreviewStepController.$inject = ['$scope', '$uibModal', '$q', 'ApplicationWizardService'];
    Application.PreviewStepController = PreviewStepController;
    Application.ApplicationModule.controller('PreviewStepController', PreviewStepController);
})(Application || (Application = {}));
//# sourceMappingURL=previewStep.controller.js.map