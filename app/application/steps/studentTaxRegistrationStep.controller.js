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
    var StudentTaxRegistrationStepController = (function (_super) {
        __extends(StudentTaxRegistrationStepController, _super);
        // Controller constructor, dependency instances will be passed in the order of $inject
        function StudentTaxRegistrationStepController($scope, $q, applicationWizard) {
            var _this = _super.call(this, $scope, $q, applicationWizard) || this;
            _this.model = {};
            _this.application = applicationWizard.application || null;
            _this.canSubmit = false;
            _this.model.StudentLastName = _this.application.student.studentLastName;
            _this.model.StudentFirstName = _this.application.student.studentFirstName;
            _this.model.applicationId = _this.applicationWizard.applicationId;
            return _this;
        }
        StudentTaxRegistrationStepController.prototype.canLeave = function () {
            var self = this;
            return self.application.student != null && self.application.applicationStatus > Application.enApplicationStatus.StudentTax;
        };
        StudentTaxRegistrationStepController.prototype.canEnter = function () {
            return true;
        };
        StudentTaxRegistrationStepController.prototype.save = function () {
            var self = this;
            var data = {
                applicationId: self.applicationWizard.applicationId,
                studentAFM: self.model.StudentAFM,
                studentLastName: self.application.student.studentLastName,
                studentFirstName: self.application.student.studentFirstName
            };
            self.applicationWizard.saveStudentAFM(data)
                .then(function (result) {
                self.application = result;
                self.canSubmit = false;
                if (self.application.applicationStatus == Application.enApplicationStatus.StudentTax) {
                    self.application.applicationStatus = Application.enApplicationStatus.ParentTax;
                }
                self.navigation.goToNextStep();
            }, function (error) {
            });
        };
        StudentTaxRegistrationStepController.prototype.getStudentGsisData = function () {
            var self = this;
            self.applicationWizard.getStudentGsisData(self.model)
                .then(function (result) {
                self.application.student = result;
                self.canSubmit = true;
            }, function (error) {
            });
        };
        StudentTaxRegistrationStepController.prototype.startOver = function () {
            var self = this;
            self.application.student.studentAFM = null;
        };
        StudentTaxRegistrationStepController.prototype.showSubmitBtn = function () {
            var self = this;
            return self.application.applicationStatus == Application.enApplicationStatus.StudentTax || self.canSubmit;
        };
        StudentTaxRegistrationStepController.prototype.isEUCitizen = function () {
            if (this.application.student.isEUCitizen == true) {
                return "ΝΑΙ";
            }
            return "ΟΧΙ";
        };
        StudentTaxRegistrationStepController.prototype.getStepApplicationStatus = function () {
            return Application.enApplicationStatus.StudentTax;
        };
        return StudentTaxRegistrationStepController;
    }(Application.BaseStepController));
    // Dependencies on services
    StudentTaxRegistrationStepController.$inject = ['$scope', '$q', 'ApplicationWizardService'];
    Application.StudentTaxRegistrationStepController = StudentTaxRegistrationStepController;
    Application.ApplicationModule.controller('StudentTaxRegistrationStepController', StudentTaxRegistrationStepController);
})(Application || (Application = {}));
//# sourceMappingURL=studentTaxRegistrationStep.controller.js.map