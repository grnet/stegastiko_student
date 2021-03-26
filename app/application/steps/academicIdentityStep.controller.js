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
    var AcademicIdentityStepController = (function (_super) {
        __extends(AcademicIdentityStepController, _super);
        //title ="AcademicIdentityStep";
        // Controller constructor, dependency instances will be passed in the order of $inject
        function AcademicIdentityStepController($scope, $q, applicationWizard) {
            var _this = _super.call(this, $scope, $q, applicationWizard) || this;
            _this.model = { academicIdNumber: '', amka: '', isAmkaNumber: true, applicationType: applicationWizard.getApplicationType() };
            _this.student = applicationWizard.application.student || null;
            _this.application = applicationWizard.application || null;
            _this.activeAcademicYearLabel = applicationWizard.getActiveAcademicYearLabel();
            _this.showSubmitBtn = false;
            return _this;
        }
        AcademicIdentityStepController.prototype.canLeave = function () {
            var self = this;
            return self.student != null && self.application.applicationStatus > 0;
        };
        AcademicIdentityStepController.prototype.canEnter = function () {
            return true;
        };
        AcademicIdentityStepController.prototype.getAcademicIDData = function () {
            var self = this;
            self.applicationWizard.getAcademicIDData(self.model)
                .then(function (result) {
                self.student = result;
                self.showSubmitBtn = true;
            }, function (error) { });
        };
        AcademicIdentityStepController.prototype.save = function () {
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
                if (self.application.applicationStatus == Application.enApplicationStatus.New) {
                    if (self.applicationWizard.getApplicationType() == Application.enApplicationType.Guardian) {
                        self.application.applicationStatus = Application.enApplicationStatus.StudentTax;
                    }
                    else {
                        self.application.applicationStatus = Application.enApplicationStatus.ParentTax;
                    }
                }
                self.navigation.goToNextStep();
                self.showSubmitBtn = false;
            }, function (error) {
            });
        };
        AcademicIdentityStepController.prototype.startOver = function () {
            var self = this;
            self.student = null;
        };
        AcademicIdentityStepController.prototype.cancel = function () {
            location.href = '../Index';
        };
        AcademicIdentityStepController.prototype.showSubmit = function () {
            var self = this;
            return self.student != null && self.showSubmitBtn;
        };
        AcademicIdentityStepController.prototype.getStepApplicationStatus = function () {
            return Application.enApplicationStatus.New;
        };
        // check the cancellation date and show message
        AcademicIdentityStepController.prototype.showCanceledAtMessage = function () {
            var self = this;
            var splitted = this.applicationWizard.getActiveAcademicYearLabel().split('-', 2);
            var startDate = new Date(parseInt(splitted[0]), 8, 1);
            var endDate = new Date(parseInt(splitted[1]), 7, 31);
            // if the date is before the start date then the AcademicIdentity card should have been in the special allowed canceled paso list, so we have to show the message
            if (self.student != null && new Date(self.student.academicIdCanceledAt + "") <= endDate) {
                return true;
            }
            return false;
        };
        AcademicIdentityStepController.prototype.areParentsAbroad = function () {
            var specialCategory = this.applicationWizard.getApplicationSpecialCategory();
            return specialCategory == Application.enSpecialCategory.ParentsAbroad;
        };
        return AcademicIdentityStepController;
    }(Application.BaseStepController));
    // Dependencies on services
    AcademicIdentityStepController.$inject = ['$scope', '$q', 'ApplicationWizardService'];
    Application.AcademicIdentityStepController = AcademicIdentityStepController;
    Application.ApplicationModule.controller('AcademicIdentityStepController', AcademicIdentityStepController);
})(Application || (Application = {}));
//# sourceMappingURL=academicIdentityStep.controller.js.map