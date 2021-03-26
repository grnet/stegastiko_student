var Application;
(function (Application) {
    'use strict';
    var enApplicationType;
    (function (enApplicationType) {
        enApplicationType[enApplicationType["Self"] = 0] = "Self";
        enApplicationType[enApplicationType["Guardian"] = 1] = "Guardian";
    })(enApplicationType = Application.enApplicationType || (Application.enApplicationType = {}));
    var enApplicationStatus;
    (function (enApplicationStatus) {
        enApplicationStatus[enApplicationStatus["New"] = 0] = "New";
        enApplicationStatus[enApplicationStatus["StudentTax"] = 10] = "StudentTax";
        enApplicationStatus[enApplicationStatus["ParentTax"] = 20] = "ParentTax";
        enApplicationStatus[enApplicationStatus["RentalData"] = 30] = "RentalData";
        enApplicationStatus[enApplicationStatus["Preview"] = 40] = "Preview";
        enApplicationStatus[enApplicationStatus["Finalized"] = 41] = "Finalized";
        enApplicationStatus[enApplicationStatus["Submit"] = 50] = "Submit";
    })(enApplicationStatus = Application.enApplicationStatus || (Application.enApplicationStatus = {}));
    var enSpecialCategory;
    (function (enSpecialCategory) {
        enSpecialCategory[enSpecialCategory["Orphan"] = 1] = "Orphan";
        enSpecialCategory[enSpecialCategory["ParentsAbroad"] = 2] = "ParentsAbroad";
        enSpecialCategory[enSpecialCategory["Over25"] = 3] = "Over25";
        enSpecialCategory[enSpecialCategory["NotProtectedMember"] = 4] = "NotProtectedMember";
    })(enSpecialCategory = Application.enSpecialCategory || (Application.enSpecialCategory = {}));
    var WizardService = (function () {
        //student: IStudentDto = null;
        function WizardService($rootScope, $q, $state, $timeout, $transitions, apiClient, toaster, modalService) {
            this.$rootScope = $rootScope;
            this.$q = $q;
            this.$state = $state;
            this.$timeout = $timeout;
            this.$transitions = $transitions;
            this.apiClient = apiClient;
            this.toaster = toaster;
            this.modalService = modalService;
            this.steps = null;
            this.currentStep = null;
            this.currentStepController = null;
            this.isInitialized = false;
            this.applicationId = 0;
            this.applicationType = 1;
            this.applicationSpecialCategory = null;
            this.application = null;
            this.activeAcademicYearLabel = null;
            this.taxYear = null;
            this.mitrwoPolitwnConsent = null;
            $transitions.onStart({}, this.onTransitionStart.bind(this));
            $transitions.onSuccess({}, this.onTransitionSuccess.bind(this));
        }
        WizardService.prototype.init = function (applicationId, applicationType, applicationSpecialCategory, activeAcademicYearLabel, taxYear, mitrwoPolitwnConsent) {
            var self = this;
            var deferred = this.$q.defer();
            this.applicationId = applicationId;
            this.applicationType = applicationType;
            if (applicationSpecialCategory >= 1) {
                this.applicationSpecialCategory = applicationSpecialCategory;
            }
            this.fixSteps();
            this.isInitialized = true;
            this.steps.forEach(function (step) { return step.applicationId = applicationId; });
            this.getApplicationById(applicationId)
                .then(function (response) {
                console.log(response);
                deferred.resolve(response);
            }, function (errors) { deferred.reject(errors); });
            this.activeAcademicYearLabel = activeAcademicYearLabel;
            this.taxYear = taxYear;
            this.mitrwoPolitwnConsent = mitrwoPolitwnConsent;
            return deferred.promise;
        };
        WizardService.prototype.fixSteps = function () {
            if (this.applicationType == enApplicationType.Guardian) {
                this.steps = [{
                        name: 'academicIdentity',
                        title: 'Ακαδημαϊκή Ταυτότητα',
                        applicationId: this.applicationId,
                        isFirst: true
                    }, {
                        name: 'taxRegistration',
                        title: 'ΑΦΜ φοιτητή',
                        applicationId: this.applicationId,
                    }, {
                        name: 'parentTaxRegistration',
                        title: 'ΑΦΜ έτερου γονέα',
                        applicationId: this.applicationId,
                    }, {
                        name: 'studentAccommodationData',
                        title: 'Μισθωμένη κατοικία',
                        applicationId: this.applicationId,
                    }, {
                        name: 'preview',
                        title: 'Προεπισκόπηση',
                        applicationId: this.applicationId,
                        isLast: true
                    }
                    //    , {
                    //    name: 'submit',
                    //    title: 'Υποβολή αίτησης',
                    //    applicationId: this.applicationId,
                    //    isLast: true
                    //}
                ];
            }
            else {
                this.steps = [{
                        name: 'academicIdentity',
                        title: 'Ακαδημαϊκή Ταυτότητα',
                        applicationId: this.applicationId,
                        isFirst: true
                    }, {
                        name: 'parentTaxRegistration',
                        title: 'ΑΦΜ Συζύγου',
                        applicationId: this.applicationId,
                    }, {
                        name: 'studentAccommodationData',
                        title: 'Μισθωμένη κατοικία',
                        applicationId: this.applicationId,
                    }, {
                        name: 'preview',
                        title: 'Προεπισκόπηση',
                        applicationId: this.applicationId,
                        isLast: true
                    }
                ];
            }
        };
        WizardService.prototype.getApplicationById = function (applicationId) {
            var self = this;
            var deferred = this.$q.defer();
            if (applicationId > 0) {
                this.apiClient.getApplicationById(applicationId).then(function (response) {
                    self.application = {
                        applicationType: null,
                        applicationStatus: null,
                        applicationSpecialCategory: null,
                        student: null,
                        user: null,
                        otherParentHasDied: null,
                        notMarried: null,
                        otherParentOrSpouseAFM: null,
                        parentsAreDivorced: null,
                        otherParentOrSpouseFirstName: null,
                        otherParentOrSpouseLastName: null,
                        rentalAddress: null,
                        rentalKapCityId: null,
                        rentalKapCityName: null,
                        rentalPrefecture: null,
                        renterAFM: null,
                        rentalContractCode: null,
                        aadeMissingContractData: null,
                        contractNotRegisteredWithAADE: null,
                        isHotelOrPension: null,
                        hasAcceptedTerms: null,
                        academicYear: null,
                        rentalContractStartDate: null,
                        rentalContractEndDate: null,
                        rentalContractLength: null,
                        hasATAK: null,
                        givenAFMIsRenter: null,
                        rentalStreet: null,
                        rentalStreetNo: null,
                        rentStartDate: null,
                        rentEndDate: null,
                        rentContractLength: null,
                        mitrwoPolitwnConsent: null
                    };
                    var appl = self.application;
                    appl.student = response.student;
                    appl.user = response.user;
                    appl.applicationType = response.applicationType;
                    appl.applicationStatus = response.applicationStatus;
                    appl.applicationSpecialCategory = response.specialCategory;
                    appl.otherParentOrSpouseAFM = response.otherParentOrSpouseAFM;
                    appl.otherParentOrSpouseFirstName = response.otherParentOrSpouseFirstName;
                    appl.otherParentOrSpouseLastName = response.otherParentOrSpouseLastName;
                    appl.parentsAreDivorced = response.parentsAreDivorced;
                    appl.otherParentHasDied = response.otherParentHasDied;
                    appl.notMarried = response.notMarried;
                    appl.rentalAddress = response.rentalAddress;
                    appl.renterAFM = response.renterAFM;
                    appl.rentalContractCode = response.rentalContractCode;
                    appl.rentalKapCityName = response.rentalKapCityName;
                    appl.rentalPrefecture = response.rentalPrefecture;
                    appl.aadeMissingContractData = response.aadeMissingContractData;
                    appl.contractNotRegisteredWithAADE = response.contractNotRegisteredWithAADE;
                    appl.isHotelOrPension = response.isHotelOrPension;
                    appl.hasAcceptedTerms = response.hasAcceptedTerms;
                    appl.academicYear = response.academicYear;
                    appl.rentalContractStartDate = response.rentStartDate;
                    appl.rentalContractEndDate = response.rentEndDate;
                    appl.rentalContractLength = response.rentalContractLength;
                    appl.hasATAK = response.hasATAK;
                    appl.givenAFMIsRenter = response.givenAFMIsRenter;
                    appl.rentalStreet = response.rentalStreet;
                    appl.rentalStreetNo = response.rentalStreetNo;
                    appl.mitrwoPolitwnConsent = response.mitrwoPolitwnConsent;
                    self.applicationType = response.applicationType;
                    self.applicationSpecialCategory = response.specialCategory;
                    deferred.resolve(response);
                }, function (errors) {
                    deferred.reject(errors.data);
                });
            }
            else {
                self.application = {
                    applicationType: null,
                    applicationStatus: 0,
                    applicationSpecialCategory: null,
                    student: null,
                    user: null,
                    otherParentHasDied: null,
                    notMarried: null,
                    otherParentOrSpouseAFM: null,
                    parentsAreDivorced: null,
                    otherParentOrSpouseFirstName: null,
                    otherParentOrSpouseLastName: null,
                    rentalAddress: null,
                    rentalKapCityId: null,
                    rentalKapCityName: null,
                    rentalPrefecture: null,
                    renterAFM: null,
                    rentalContractCode: null,
                    aadeMissingContractData: null,
                    contractNotRegisteredWithAADE: null,
                    isHotelOrPension: null,
                    hasAcceptedTerms: null,
                    academicYear: null,
                    rentalContractStartDate: null,
                    rentalContractEndDate: null,
                    rentalContractLength: null,
                    rentStartDate: null,
                    rentEndDate: null,
                    rentContractLength: null,
                    hasATAK: null,
                    givenAFMIsRenter: null,
                    rentalStreet: null,
                    rentalStreetNo: null,
                    mitrwoPolitwnConsent: null
                };
                deferred.resolve();
            }
            return deferred.promise;
        };
        WizardService.prototype.getCurrentStep = function () {
            return this.currentStep;
        };
        WizardService.prototype.getApplicationType = function () {
            return this.applicationType;
        };
        WizardService.prototype.getApplicationSpecialCategory = function () {
            return this.applicationSpecialCategory;
        };
        WizardService.prototype.setCurrentStep = function (stepController) {
            this.currentStepController = stepController;
        };
        WizardService.prototype.getActiveAcademicYearLabel = function () {
            return this.activeAcademicYearLabel;
        };
        WizardService.prototype.getTaxYear = function () {
            return this.taxYear;
        };
        WizardService.prototype.getMitrwoConsent = function () {
            return this.mitrwoPolitwnConsent;
        };
        WizardService.prototype.getAcademicIDData = function (model) {
            var self = this;
            var deferred = this.$q.defer();
            this.apiClient.getAcademicData(model)
                .then(function (response) {
                self.application.student = response;
                if (self.application.student.birthYearCheckMessage != null) {
                    self.modalService.info("ΕΙΔΟΠΟΙΗΣΗ", self.application.student.birthYearCheckMessage);
                }
                deferred.resolve(response);
            }, function (errors) {
                self.modalService.error("Σφάλμα", errors.data);
                //self.toaster.error(errors.data, 'Σφάλμα');
                deferred.reject();
            });
            return deferred.promise;
        };
        WizardService.prototype.getStudentGsisData = function (model) {
            var self = this;
            var deferred = this.$q.defer();
            this.apiClient.getStudentGsisData(model)
                .then(function (response) {
                self.application.student = response;
                deferred.resolve(response);
            }, function (errors) {
                self.modalService.error("Σφάλμα", errors.data);
                //                    self.toaster.error(errors.data, 'Σφάλμα');
                deferred.reject();
            });
            return deferred.promise;
        };
        WizardService.prototype.getOtherParentGsisData = function (model) {
            var self = this;
            var deferred = this.$q.defer();
            this.apiClient.getOtherParentGsisData(model)
                .then(function (response) {
                self.application.otherParentOrSpouseAFM = response.AFM;
                self.application.otherParentOrSpouseFirstName = response.firstName;
                self.application.otherParentOrSpouseLastName = response.lastName;
                deferred.resolve(response);
            }, function (errors) {
                self.modalService.error("Σφάλμα", errors.data);
                //                    self.toaster.error(errors.data, 'Σφάλμα');
                deferred.reject();
            });
            return deferred.promise;
        };
        WizardService.prototype.getRentalContractData = function (model) {
            var self = this;
            var deferred = this.$q.defer();
            this.apiClient.getRentalContractData(model)
                .then(function (response) {
                self.application.rentalKapCityId = response.rentalKapCityId;
                deferred.resolve(response);
            }, function (errors) {
                self.modalService.error("Σφάλμα", errors.data);
                deferred.reject();
            });
            return deferred.promise;
        };
        WizardService.prototype.saveApplicationStudent = function (student) {
            var self = this;
            var deferred = this.$q.defer();
            if (self.applicationId > 0) {
                this.apiClient.saveApplicationStudent(student)
                    .then(function (response) {
                    if (self.applicationId == 0) {
                        self.applicationId = response;
                    }
                    deferred.resolve(response);
                }, function (errors) {
                    self.modalService.error("Σφάλμα", errors.data);
                    //                        self.toaster.error(errors.data, 'Σφάλμα');
                    deferred.reject();
                });
            }
            else {
                this.apiClient.createApplication(student)
                    .then(function (response) {
                    if (self.applicationId == 0) {
                        self.applicationId = response;
                        self.steps.forEach(function (step) { return step.applicationId = self.applicationId; });
                    }
                    deferred.resolve(response);
                }, function (errors) {
                    self.modalService.error("Σφάλμα", errors.data);
                    //                        self.toaster.error(errors.data, 'Σφάλμα');
                    deferred.reject();
                });
            }
            return deferred.promise;
        };
        WizardService.prototype.saveStudentAFM = function (student) {
            var self = this;
            var deferred = this.$q.defer();
            this.apiClient.saveStudentAFM(student)
                .then(function (response) {
                self.application = response;
                deferred.resolve(response);
            }, function (errors) {
                self.modalService.error("Σφάλμα", errors.data);
                //                    self.toaster.error(errors.data, 'Σφάλμα');
                deferred.reject();
            });
            return deferred.promise;
        };
        WizardService.prototype.saveOtherParentAFM = function (updateOtherParentRequest) {
            var self = this;
            var deferred = this.$q.defer();
            this.apiClient.saveOtherParentAFM(updateOtherParentRequest)
                .then(function (response) {
                self.application = response;
                deferred.resolve(response);
            }, function (errors) {
                deferred.reject(errors.data);
            });
            return deferred.promise;
        };
        WizardService.prototype.saveNoOtherParentAFM = function (updateOtherParentRequest) {
            var self = this;
            var deferred = this.$q.defer();
            this.apiClient.saveNoOtherParentAFM(updateOtherParentRequest)
                .then(function (response) {
                self.application = response;
                deferred.resolve(response);
            }, function (errors) {
                deferred.reject(errors.data);
            });
            return deferred.promise;
        };
        WizardService.prototype.saveRentalContractData = function (updateRentalContractData) {
            var self = this;
            var deferred = this.$q.defer();
            this.apiClient.saveRentalContractData(updateRentalContractData)
                .then(function (response) {
                self.application = response;
                deferred.resolve(response);
            }, function (errors) {
                self.modalService.error("Σφάλμα", errors.data);
                deferred.reject();
            });
            return deferred.promise;
        };
        WizardService.prototype.saveRentalContractDataNoContract = function (updateRentalContractData) {
            var self = this;
            var deferred = this.$q.defer();
            this.apiClient.saveRentalContractDataNoContract(updateRentalContractData)
                .then(function (response) {
                self.application = response;
                deferred.resolve(response);
            }, function (errors) {
                self.modalService.error("Σφάλμα", errors.data);
                deferred.reject();
            });
            return deferred.promise;
        };
        WizardService.prototype.saveCheckedUsageTerms = function (applicationId) {
            var self = this;
            var deferred = this.$q.defer();
            this.apiClient.saveCheckedUsageTerms(applicationId)
                .then(function (response) {
                self.application = response;
                deferred.resolve(response);
            }, function (errors) {
                self.modalService.error("Σφάλμα", errors.data);
                //                    self.toaster.error(errors.data, 'Σφάλμα');
                deferred.reject();
            });
            return deferred.promise;
        };
        WizardService.prototype.submitApplication = function (applicationId) {
            var self = this;
            var deferred = this.$q.defer();
            this.apiClient.submitApplication(applicationId)
                .then(function (response) {
                self.application = response;
                deferred.resolve(response);
            }, function (errors) {
                self.modalService.error("Σφάλμα", errors.data);
                //                    self.toaster.error(errors.data, 'Σφάλμα');
                deferred.reject();
            });
            return deferred.promise;
        };
        WizardService.prototype.getStep = function (name) {
            return this.steps.filter(function (step) { return step.name == name; })[0];
        };
        // Transition service of new ui-router service not in typings currently :(
        WizardService.prototype.onTransitionStart = function (transitionService) {
            var toState = transitionService.to();
            if (!this.isInitialized) {
                return this.init(toState.applicationId, this.applicationType, this.applicationSpecialCategory, "", 0, null);
            }
            else {
                toState.applicationId = this.applicationId;
            }
            if (this.currentStepController) {
                var currentStepIndex = this.steps.indexOf(this.currentStep);
                var nextStepIndex = this.steps.indexOf(this.getStep(transitionService.to().name));
                return (this.currentStepController.canLeave() && this.application.applicationStatus >= toState.data.stepStatus) || currentStepIndex > nextStepIndex;
            }
        };
        // Transition service of new ui-router service not in typings currently :(
        WizardService.prototype.onTransitionSuccess = function (transitionService) {
            this.currentStep = this.getStep(transitionService.to().name);
        };
        return WizardService;
    }());
    WizardService.$inject = ['$rootScope', '$q', '$state', '$timeout', '$transitions', 'ApplicationApiClientService', 'toastr', 'ModalService'];
    Application.ApplicationModule.service('ApplicationWizardService', WizardService);
})(Application || (Application = {}));
//# sourceMappingURL=application.wizard.service.js.map