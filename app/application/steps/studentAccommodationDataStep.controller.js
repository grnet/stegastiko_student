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
    var StudentAccommodationDataStepController = (function (_super) {
        __extends(StudentAccommodationDataStepController, _super);
        // Controller constructor, dependency instances will be passed in the order of $inject
        function StudentAccommodationDataStepController($scope, $q, applicationWizard) {
            var _this = _super.call(this, $scope, $q, applicationWizard) || this;
            _this.application = applicationWizard.application || null;
            _this.student = applicationWizard.application.student || null;
            _this.activeAcademicYearLabel = applicationWizard.getActiveAcademicYearLabel();
            var splitted = _this.activeAcademicYearLabel.split('-', 2);
            _this.rentAcademicIntervalLabel = '01/09/' + splitted[0] + ' μέχρι την 31/08/' + splitted[1];
            _this.rentAcademicIntervalLabel2 = '01/09/' + splitted[0] + ' μέχρι την 31/08/' + splitted[1];
            _this.saveBtnVisible = false;
            _this.model = { renterAFM: null, rentalContractCode: null, otherSelection: null };
            _this.fillAfms();
            return _this;
        }
        StudentAccommodationDataStepController.prototype.fillAfms = function () {
            var self = this;
            self.afms = [];
            self.afms.push(self.application.user.afm);
            if (self.application.student.studentAFM != null &&
                self.application.student.studentAFM != "" && self.application.student.studentAFM != self.application.user.afm) {
                self.afms.push(self.application.student.studentAFM);
            }
            if (self.application.otherParentOrSpouseAFM != null &&
                self.application.otherParentOrSpouseAFM != "") {
                self.afms.push(self.application.otherParentOrSpouseAFM);
            }
        };
        StudentAccommodationDataStepController.prototype.canLeave = function () {
            var self = this;
            return !self.showSearch() && self.application.applicationStatus > Application.enApplicationStatus.RentalData;
        };
        StudentAccommodationDataStepController.prototype.canEnter = function () {
            return true;
        };
        StudentAccommodationDataStepController.prototype.save = function () {
            var self = this;
            var data = {
                givenAFMIsRenter: self.application.givenAFMIsRenter,
                rentalContractStartDate: self.application.rentalContractStartDate,
                rentalContractLength: self.application.rentalContractLength,
                applicationId: self.applicationWizard.applicationId,
                renterAFM: self.model.renterAFM,
                rentalContractCode: self.model.rentalContractCode,
                hasATAK: self.application.hasATAK,
                cityId: self.application.rentalKapCityId,
                cityName: self.application.rentalKapCityName,
                prefectureName: self.application.rentalPrefecture,
                isHotelOrPension: self.model.otherSelection == 3,
                aADEMissingContractData: self.model.otherSelection == 1,
                contractNotRegisteredWithAADE: self.model.otherSelection == 2,
                rentalAddress: self.application.rentalAddress,
                rentalStreet: self.application.rentalStreet,
                rentalStreetNo: self.application.rentalStreetNo,
                rentalContractEndDate: self.application.rentalContractEndDate
            };
            self.applicationWizard.saveRentalContractData(data)
                .then(function (result) {
                self.application = result;
                self.application.rentalContractStartDate = result.rentStartDate;
                self.application.rentalContractEndDate = result.rentEndDate;
                self.application.rentalContractLength = result.rentContractLength;
                if (self.application.applicationStatus == Application.enApplicationStatus.RentalData) {
                    self.application.applicationStatus = Application.enApplicationStatus.Preview;
                }
                self.saveBtnVisible = false;
                self.navigation.goToNextStep();
            }, function (error) { });
        };
        StudentAccommodationDataStepController.prototype.getRentalContractGsisData = function () {
            var self = this;
            var data = {
                renterAFM: self.model.renterAFM,
                rentalContractCode: self.model.rentalContractCode,
                isHotelOrPension: self.model.otherSelection == 3,
                aADEMissingContractData: self.model.otherSelection == 1,
                contractNotRegisteredWithAADE: self.model.otherSelection == 2,
                applicationId: self.applicationWizard.applicationId
            };
            //TODO: Check the condition below for safety            
            if (data.rentalContractCode != null && data.rentalContractCode > 0) {
                self.applicationWizard.getRentalContractData(data)
                    .then(function (result) {
                    self.application.renterAFM = result.renterAFM;
                    self.application.rentalContractCode = self.model.rentalContractCode;
                    self.application.givenAFMIsRenter = result.givenAFMIsRenter;
                    self.application.rentalContractStartDate = result.rentStartDate;
                    self.application.rentalContractEndDate = result.rentEndDate;
                    self.application.rentalContractLength = result.rentalContractLength;
                    self.application.hasATAK = result.hasATAK;
                    if (result.hasATAK) {
                        self.application.rentalKapCityId = result.rentalKapCityId;
                    }
                    self.application.rentalKapCityName = result.rentalKapCityName;
                    self.application.rentalPrefecture = result.rentalPrefectureName;
                    self.application.rentalAddress = self.application.rentalKapCityName + ", " + self.application.rentalPrefecture;
                    self.showRentalDurationRejectedMsg = result.showRentalDurationRejectedMsg;
                    self.saveBtnVisible = true;
                }, function (error) {
                });
            }
            else {
                self.applicationWizard.saveRentalContractDataNoContract(data)
                    .then(function (result) {
                    self.application = result;
                    if (self.application.applicationStatus == Application.enApplicationStatus.RentalData) {
                        self.application.applicationStatus = Application.enApplicationStatus.Preview;
                    }
                    self.navigation.goToNextStep();
                }, function (error) {
                });
            }
        };
        StudentAccommodationDataStepController.prototype.startOver = function () {
            var self = this;
            var appl = self.application;
            appl.renterAFM = null;
            appl.rentalContractCode = null;
            appl.rentalAddress = null;
            appl.aadeMissingContractData = null;
            appl.isHotelOrPension = null;
            appl.contractNotRegisteredWithAADE = null;
            self.model.rentalContractCode = null;
            self.model.otherSelection = null;
        };
        StudentAccommodationDataStepController.prototype.showSearch = function () {
            var self = this;
            var appl = self.application;
            return appl.renterAFM == null
                && appl.rentalContractCode == null
                && appl.aadeMissingContractData == null
                && appl.isHotelOrPension == null
                && appl.contractNotRegisteredWithAADE == null;
        };
        StudentAccommodationDataStepController.prototype.isRequired = function () {
            var self = this;
            var myModel = self.model;
            if (typeof myModel != 'undefined') {
                {
                    var cond1 = myModel.rentalContractCode === null ||
                        myModel.rentalContractCode.length === 0 ||
                        myModel.renterAFM === null ||
                        myModel.renterAFM.length === 0;
                    var cond2 = myModel.otherSelection === null;
                    return cond1 && cond2;
                }
            }
            else
                return true;
        };
        StudentAccommodationDataStepController.prototype.getStepApplicationStatus = function () {
            return Application.enApplicationStatus.RentalData;
        };
        StudentAccommodationDataStepController.prototype.clearOthers = function () {
            var self = this;
            self.model.otherSelection = null;
        };
        StudentAccommodationDataStepController.prototype.clearContract = function () {
            var self = this;
            self.model.rentalContractCode = null;
        };
        StudentAccommodationDataStepController.prototype.showSaveBtn = function () {
            var self = this;
            return self.saveBtnVisible;
        };
        return StudentAccommodationDataStepController;
    }(Application.BaseStepController));
    // Dependencies on services
    StudentAccommodationDataStepController.$inject = ['$scope', '$q', 'ApplicationWizardService'];
    Application.StudentAccommodationDataStepController = StudentAccommodationDataStepController;
    Application.ApplicationModule.controller('StudentAccommodationDataStepController', StudentAccommodationDataStepController);
})(Application || (Application = {}));
//# sourceMappingURL=studentAccommodationDataStep.controller.js.map