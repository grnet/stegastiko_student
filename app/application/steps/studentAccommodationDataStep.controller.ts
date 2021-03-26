module Application {
    'use strict';

    export class StudentAccommodationDataStepController extends BaseStepController {
        
        // Dependencies on services
        static $inject = ['$scope', '$q', 'ApplicationWizardService'];
        private saveBtnVisible: boolean;
        public model: any;
        public student: IStudentDto;
        public application: IApplicationDto;
        public afms: string[];
        public showRentalDurationRejectedMsg: boolean;
        public activeAcademicYearLabel:string;
        public rentAcademicIntervalLabel:string;
        public rentAcademicIntervalLabel2:string;

        // Controller constructor, dependency instances will be passed in the order of $inject
        constructor($scope: ng.IScope, $q: ng.IQService, applicationWizard: IWizardService) {
            super($scope, $q, applicationWizard)            
            this.application = applicationWizard.application || null;
            this.student = applicationWizard.application.student || null;

            this.activeAcademicYearLabel = applicationWizard.getActiveAcademicYearLabel();
            var splitted = this.activeAcademicYearLabel.split('-', 2);             
            this.rentAcademicIntervalLabel = '01/09/' + splitted[0] + ' μέχρι την 31/08/' + splitted[1];
            this.rentAcademicIntervalLabel2 = '01/09/' + splitted[0] + ' μέχρι την 31/08/' + splitted[1];

            this.saveBtnVisible = false;
            this.model = { renterAFM: null, rentalContractCode: null, otherSelection: null };
            this.fillAfms();
        }

        fillAfms() {
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
        }

        public canLeave() {
            var self = this;
            return !self.showSearch() && self.application.applicationStatus > enApplicationStatus.RentalData;
        }

        public canEnter() {
            return true;
        }

        private save() {
            var self = this;            

            var data = {
                givenAFMIsRenter : self.application.givenAFMIsRenter,
                rentalContractStartDate : self.application.rentalContractStartDate,
                rentalContractLength : self.application.rentalContractLength,

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

                    if (self.application.applicationStatus == enApplicationStatus.RentalData) {
                        self.application.applicationStatus = enApplicationStatus.Preview;
                    }
                    self.saveBtnVisible = false;
                    self.navigation.goToNextStep();
                }, function (error) {  });
        }

        public getRentalContractGsisData() {
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
                        self.application.rentalAddress = self.application.rentalKapCityName + ", " + self.application.rentalPrefecture  ;

                        self.showRentalDurationRejectedMsg = result.showRentalDurationRejectedMsg;
                        self.saveBtnVisible = true;
                    }, function (error) {                        
                    });
            }
            else {
                self.applicationWizard.saveRentalContractDataNoContract(data)
                    .then(function (result) {
                        self.application = result;
                        if (self.application.applicationStatus == enApplicationStatus.RentalData) {
                            self.application.applicationStatus = enApplicationStatus.Preview;
                        }
                        self.navigation.goToNextStep();
                    }, function(error) {                        
                    });
            }
        }
        
        public startOver() {
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
        }

        public showSearch() {
            var self = this;
            var appl = self.application;
            return appl.renterAFM == null
                && appl.rentalContractCode == null 
                && appl.aadeMissingContractData == null
                && appl.isHotelOrPension == null
                && appl.contractNotRegisteredWithAADE == null;
        }

        public isRequired() {
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

        }

        public getStepApplicationStatus()
        {
            return enApplicationStatus.RentalData;
        }

        public clearOthers() {
            var self = this;
            self.model.otherSelection = null;
        }

        public clearContract() {
            var self = this;
            self.model.rentalContractCode = null;
        }

        public showSaveBtn() {
            var self = this;
            return self.saveBtnVisible;
        }
    }

    ApplicationModule.controller('StudentAccommodationDataStepController', StudentAccommodationDataStepController);
}