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
    var ParentTaxRegistrationStepController = (function (_super) {
        __extends(ParentTaxRegistrationStepController, _super);
        // Controller constructor, dependency instances will be passed in the order of $inject
        function ParentTaxRegistrationStepController($scope, $q, applicationWizard) {
            var _this = _super.call(this, $scope, $q, applicationWizard) || this;
            _this.model = {};
            _this.application = applicationWizard.application || null;
            _this.showSave = false;
            _this.isModalOpened = false;
            _this.model = { otherParentOrSpouseAFM: null, otherParentOrSpouseFirstName: null, otherParentOrSpouseLastName: null, notMarried: null, otherSelection: null, mitrwoConsent: null };
            return _this;
        }
        ParentTaxRegistrationStepController.prototype.canLeave = function () {
            var self = this;
            return (self.application.otherParentOrSpouseAFM != null
                || self.application.parentsAreDivorced === true
                || self.application.otherParentHasDied === true
                || self.application.notMarried === true) && self.application.applicationStatus >= Application.enApplicationStatus.RentalData;
        };
        ParentTaxRegistrationStepController.prototype.canEnter = function () {
            return true;
        };
        ParentTaxRegistrationStepController.prototype.save = function () {
            var self = this;
            var data = {
                applicationId: self.applicationWizard.applicationId,
                otherParentOrSpouseAFM: self.model.otherParentOrSpouseAFM,
                otherParentOrSpouseFirstName: self.model.otherParentOrSpouseFirstName,
                otherParentOrSpouseLastName: self.model.otherParentOrSpouseLastName,
            };
            self.applicationWizard.saveOtherParentAFM(data)
                .then(function (result) {
                self.application = result;
                //TODO: Put Spouse on client side Application model
                /*
                if (self.applicationWizard.applicationType == enApplicationType.Self) {
                    self.application.otherParentAFM = self.model.OtherParentAFM;
                    self.application.otherParentFirstName = self.model.OtherParentFirstName;
                    self.application.otherParentLastName = self.model.OtherParentLastName;
                }
                */
                if (self.application.applicationStatus == Application.enApplicationStatus.ParentTax) {
                    self.application.applicationStatus = Application.enApplicationStatus.RentalData;
                }
                self.navigation.goToNextStep();
            }, function (error) { });
        };
        ParentTaxRegistrationStepController.prototype.getOtherParentGsisData = function () {
            var self = this;
            if (self.model.otherParentOrSpouseAFM != null && self.model.otherParentOrSpouseAFM.length > 0) {
                var data1 = {
                    applicationId: self.applicationWizard.applicationId,
                    otherParentOrSpouseAFM: self.model.otherParentOrSpouseAFM,
                    otherParentOrSpouseFirstName: self.model.otherParentOrSpouseFirstName,
                    otherParentOrSpouseLastName: self.model.otherParentOrSpouseLastName,
                };
                self.applicationWizard.getOtherParentGsisData(data1)
                    .then(function (result) {
                    var appl = self.application;
                    appl.otherParentOrSpouseAFM = result.afm;
                    appl.otherParentOrSpouseFirstName = result.firstName;
                    appl.otherParentOrSpouseLastName = result.lastName;
                    self.showSave = true;
                }, function (error) {
                });
            }
            else {
                var data = {
                    applicationId: self.applicationWizard.applicationId,
                    divorced: self.model.otherSelection == 1,
                    otherParentHasDied: self.model.otherSelection == 2,
                    notMarried: self.model.notMarried,
                    mitrwoPolitwnConsent: self.model.mitrwoPolitwnConsent
                };
                self.applicationWizard.saveNoOtherParentAFM(data)
                    .then(function (result) {
                    self.application = result;
                    if (self.application.applicationStatus == Application.enApplicationStatus.ParentTax) {
                        self.application.applicationStatus = Application.enApplicationStatus.RentalData;
                    }
                    self.navigation.goToNextStep();
                }, function (error) { });
            }
        };
        ParentTaxRegistrationStepController.prototype.startOver = function () {
            var self = this;
            self.application.otherParentOrSpouseAFM = null;
            self.application.otherParentOrSpouseFirstName = null;
            self.application.otherParentOrSpouseLastName = null;
            self.application.parentsAreDivorced = null;
            self.application.otherParentHasDied = null;
            self.application.notMarried = null;
        };
        ParentTaxRegistrationStepController.prototype.isRequired = function () {
            var self = this;
            var myModel = self.model;
            if (typeof myModel != 'undefined') {
                {
                    var cond1 = (typeof myModel.otherParentOrSpouseAFM === 'undefined' || myModel.otherParentOrSpouseAFM === null || myModel.otherParentOrSpouseAFM.length === 0)
                        || (typeof myModel.otherParentOrSpouseLastName === 'undefined' || myModel.otherParentOrSpouseLastName === null || myModel.otherParentOrSpouseLastName.length === 0)
                        || (typeof myModel.otherParentOrSpouseFirstName === 'undefined' || myModel.otherParentOrSpouseFirstName === null || myModel.otherParentOrSpouseFirstName.length === 0);
                    var cond2 = myModel.otherSelection === null && myModel.notMarried === null;
                    return cond1 && cond2;
                }
            }
            else
                return true;
        };
        ParentTaxRegistrationStepController.prototype.showSearch = function () {
            var self = this;
            var appl = self.application;
            return !(appl.otherParentOrSpouseAFM != null || appl.otherParentHasDied != null || appl.parentsAreDivorced != null || appl.notMarried != null);
        };
        ParentTaxRegistrationStepController.prototype.showSaveBtn = function () {
            var self = this;
            return self.showSave;
        };
        ParentTaxRegistrationStepController.prototype.clearOthers = function () {
            var self = this;
            self.model.otherSelection = null;
            self.model.notMarried = null;
            self.model.mitrwoPolitwnConsent = null;
        };
        ParentTaxRegistrationStepController.prototype.clearOtherParentData = function () {
            var self = this;
            self.model.otherParentOrSpouseAFM = null;
            self.model.otherParentOrSpouseFirstName = null;
            self.model.otherParentOrSpouseLastName = null;
        };
        ParentTaxRegistrationStepController.prototype.doNotContinue = function () {
            var self = this;
            var first = self.model.otherParentOrSpouseFirstName;
            var last = self.model.otherParentOrSpouseLastName;
            var afm = self.model.otherParentOrSpouseAFM;
            return (!self.isGuardian() && (!self.model.notMarried &&
                (first == null || first.trim().length < 2
                    || last == null || last.trim().length < 2
                    || afm == null || afm.trim().length == 0)));
        };
        ParentTaxRegistrationStepController.prototype.getStepApplicationStatus = function () {
            return Application.enApplicationStatus.ParentTax;
        };
        ParentTaxRegistrationStepController.prototype.openConsentModal = function () {
            var self = this;
            if (!self.isModalOpened) {
                self.isModalOpened = true;
                var elem = document.getElementById('openModalButton');
                var evt = new MouseEvent('click', {
                    bubbles: true,
                    cancelable: true,
                    view: window
                });
                elem.dispatchEvent(evt);
            }
        };
        ParentTaxRegistrationStepController.prototype.closeModal = function () {
            var self = this;
            if (self.isModalOpened) {
                self.isModalOpened = false;
                var elem = document.getElementById('closeModalButton');
                var evt = new MouseEvent('click', {
                    bubbles: true,
                    cancelable: true,
                    view: window
                });
                elem.dispatchEvent(evt);
            }
        };
        return ParentTaxRegistrationStepController;
    }(Application.BaseStepController));
    // Dependencies on services
    ParentTaxRegistrationStepController.$inject = ['$scope', '$q', 'ApplicationWizardService'];
    Application.ParentTaxRegistrationStepController = ParentTaxRegistrationStepController;
    Application.ApplicationModule.controller('ParentTaxRegistrationStepController', ParentTaxRegistrationStepController);
})(Application || (Application = {}));
//# sourceMappingURL=parentTaxRegistrationStep.controller.js.map