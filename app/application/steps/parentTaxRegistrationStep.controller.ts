module Application {
    'use strict';

    export class ParentTaxRegistrationStepController extends BaseStepController {

        // Dependencies on services
        static $inject = ['$scope', '$q', 'ApplicationWizardService'];
        private showSave: boolean;
        public model: any;
        public application: IApplicationDto;     
        public isModalOpened:boolean


        // Controller constructor, dependency instances will be passed in the order of $inject
        constructor($scope: ng.IScope, $q: ng.IQService, applicationWizard: IWizardService) {
            super($scope, $q, applicationWizard)
            this.model = {};
            this.application = applicationWizard.application || null;            
            this.showSave = false; 
            this.isModalOpened = false;

            this.model = { otherParentOrSpouseAFM: null, otherParentOrSpouseFirstName: null, otherParentOrSpouseLastName: null, notMarried: null, otherSelection: null, mitrwoConsent: null };
        }

        public canLeave() {
            var self = this;

            return (self.application.otherParentOrSpouseAFM != null
                || self.application.parentsAreDivorced === true
                || self.application.otherParentHasDied === true
                || self.application.notMarried === true) && self.application.applicationStatus >= enApplicationStatus.RentalData;
        }

        public canEnter() {
            return true;
        }

        public save() {
            var self = this;
            var data = {
                applicationId: self.applicationWizard.applicationId,
                otherParentOrSpouseAFM: self.model.otherParentOrSpouseAFM,
                otherParentOrSpouseFirstName: self.model.otherParentOrSpouseFirstName,
                otherParentOrSpouseLastName: self.model.otherParentOrSpouseLastName,  
            };
            self.applicationWizard.saveOtherParentAFM(data)
                .then(function(result) {
                    self.application = result;

                    //TODO: Put Spouse on client side Application model
                    /*
                    if (self.applicationWizard.applicationType == enApplicationType.Self) {
                        self.application.otherParentAFM = self.model.OtherParentAFM;
                        self.application.otherParentFirstName = self.model.OtherParentFirstName;
                        self.application.otherParentLastName = self.model.OtherParentLastName;
                    }
                    */

                    if (self.application.applicationStatus == enApplicationStatus.ParentTax) {
                        self.application.applicationStatus = enApplicationStatus.RentalData;
                    }
                    self.navigation.goToNextStep();
                }, function (error) {  });
        }

        public getOtherParentGsisData() {
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
            else
            {
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
                        if (self.application.applicationStatus == enApplicationStatus.ParentTax) {
                            self.application.applicationStatus = enApplicationStatus.RentalData;
                        }

                        self.navigation.goToNextStep();
                    }, function (error) {  });
            }

        }

        public startOver() {
            var self = this;
            self.application.otherParentOrSpouseAFM = null;
            self.application.otherParentOrSpouseFirstName = null;
            self.application.otherParentOrSpouseLastName = null;
            self.application.parentsAreDivorced = null;
            self.application.otherParentHasDied = null;
            self.application.notMarried = null;
        }

        public isRequired()
        {
            var self = this;
            var myModel = self.model;

            if (typeof myModel != 'undefined') {
                {
                    var cond1 = (typeof myModel.otherParentOrSpouseAFM === 'undefined' || myModel.otherParentOrSpouseAFM === null || myModel.otherParentOrSpouseAFM.length === 0)
                        || (typeof myModel.otherParentOrSpouseLastName === 'undefined' || myModel.otherParentOrSpouseLastName === null || myModel.otherParentOrSpouseLastName.length === 0)
                        || (typeof myModel.otherParentOrSpouseFirstName === 'undefined' || myModel.otherParentOrSpouseFirstName === null || myModel.otherParentOrSpouseFirstName.length === 0);
                    var cond2 = myModel.otherSelection === null &&  myModel.notMarried === null;

                    return cond1 && cond2;
                }
            }
            else
                return true;

        }

        public showSearch()
        {
            var self = this;
            var appl = self.application;
            return !(appl.otherParentOrSpouseAFM != null || appl.otherParentHasDied != null || appl.parentsAreDivorced != null || appl.notMarried != null);
        }

        public showSaveBtn()
        {
            var self = this;
            return self.showSave;
        }

        public clearOthers() {
            var self = this;
            self.model.otherSelection = null;
            self.model.notMarried = null;
            self.model.mitrwoPolitwnConsent = null;
        }

        public clearOtherParentData() {
            var self = this;
            self.model.otherParentOrSpouseAFM = null;
            self.model.otherParentOrSpouseFirstName = null;
            self.model.otherParentOrSpouseLastName = null;
        }
      
        public doNotContinue() {
            var self = this;
            var first = self.model.otherParentOrSpouseFirstName;
            var last = self.model.otherParentOrSpouseLastName;
            var afm = self.model.otherParentOrSpouseAFM;
           
            return (!self.isGuardian() && (
                !self.model.notMarried && 
                    (
                     first == null || first.trim().length < 2
                    || last == null || last.trim().length < 2
                    || afm == null || afm.trim().length == 0
                )
            ));
        }

        public getStepApplicationStatus()
        {
            return enApplicationStatus.ParentTax;
        }
       
        public openConsentModal() {
            var self = this;
          
            if (!self.isModalOpened) {
                self.isModalOpened = true;
                
                let elem = document.getElementById('openModalButton');

                let evt = new MouseEvent('click', {
                    bubbles: true,
                    cancelable: true,
                    view: window
                });

                elem.dispatchEvent(evt);
            }
        }
        public closeModal() {
            var self = this;
            if (self.isModalOpened) {
                self.isModalOpened = false;
                let elem = document.getElementById('closeModalButton');

                let evt = new MouseEvent('click', {
                    bubbles: true,
                    cancelable: true,
                    view: window
                });

                elem.dispatchEvent(evt);
            }
        }
    
  
    }

    ApplicationModule.controller('ParentTaxRegistrationStepController', ParentTaxRegistrationStepController);
}