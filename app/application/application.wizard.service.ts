module Application {
    'use strict';

    export interface IApplicationDto {
        student: IStudentDto;
        user: IGuardianDto;
        applicationType: enApplicationType;
        applicationStatus: number;
        applicationSpecialCategory: enSpecialCategory;
        academicYear: number;

        //other parent data
        otherParentHasDied: boolean;
        parentsAreDivorced: boolean;
        notMarried: boolean;
        otherParentOrSpouseAFM: string;
        otherParentOrSpouseFirstName: string;
        otherParentOrSpouseLastName: string;

        //student accommodation data
        rentalAddress: string;
        rentalKapCityId: number;
        rentalKapCityName: string;
        rentalPrefecture: string;
        renterAFM: string;
        rentalContractCode: string;
        contractNotRegisteredWithAADE: boolean;
        isHotelOrPension: boolean;
        aadeMissingContractData: boolean;
        rentalContractStartDate: Date;
        rentalContractEndDate: Date;
        rentalContractLength: number;
        hasATAK: boolean;
        givenAFMIsRenter: boolean;
        rentalStreet: string;
        rentalStreetNo: number;

        hasAcceptedTerms: boolean;

        rentStartDate: Date;
        rentEndDate: Date;
        rentContractLength: number;
        mitrwoPolitwnConsent: boolean
    }

    export interface IStudentDto {
        academicIDNumber: string;
        studentAMKA: string;
        isAmkaNumber: boolean;
        studentFirstName: string;
        studentLastName: string;
        studentAFM: string;
        department: string;
        institution: string;
        institutionAddress: string;
        entryYear: Date;        
        hasOtherDegree: boolean;
        isEUCitizen: boolean;
        schoolAddressCity: string;
        schoolAddressPrefecture: string;

        studentBirthYear: number;
        birthYearCheckMessage: string;
        isProtectedMember: boolean;
        protectedMemberIncomeFulfilled: boolean;

        academicIdCancellationReason: number;
        academicIdCanceledAt: Date;

        studentFirstNameGsis: string;
        studentLastNameGsis: string;
    }

    export interface IGuardianDto
    {
        address: string;
        afm: string;
        firstName: string;
        lastName: string;
        isEUCitizen: number;
        zipCode: string;
        cityName: string;
        prefectureName: string;
        birthYear: number;
        birthDate: Date;
        fathersName: string;
        mothersName: string;
    }

    export interface IRentalDto {
        renterAFM: string;
        givenAFMIsRenter: boolean;
        rentStartDate: Date;
        rentEndDate: Date;
        rentalContractLength: number;
        hasATAK: boolean;
        rentalKapCityId: number;
        rentalKapCityName: string;
        rentalPrefectureName: string;

        showRentalDurationRejectedMsg: boolean;
    }

    export interface IWizardStep {
        name: string;
        title: string;
        applicationId: number;
        enabled?: boolean;
        isFirst?: boolean;
        isLast?: boolean;
    }

    export interface IWizardService {
        steps: Array<IWizardStep>;
        init(applicationId: number, applicationType: enApplicationType, applicationSpecialCategory: enSpecialCategory, activeAcademicYearLabel : string, taxYear:number, mitrwoConsent: boolean): ng.IPromise<void>;
        getApplicationById(applicationId: number): ng.IPromise<void>;
        getCurrentStep(): IWizardStep;
        setCurrentStep(stepController: any): void;
        getApplicationType(): enApplicationType;
        getApplicationSpecialCategory(): enSpecialCategory;
        getActiveAcademicYearLabel(): string;
        getTaxYear(): number;
        getMitrwoConsent(): boolean;
        getAcademicIDData(model: any): ng.IPromise<IStudentDto>;
        getStudentGsisData(model: any): ng.IPromise<IStudentDto>;
        getOtherParentGsisData(model: any): ng.IPromise<IGuardianDto>
        getRentalContractData(model: any): ng.IPromise<IRentalDto>
        saveApplicationStudent(student: any): ng.IPromise<IApplicationDto>;
        //student: IStudentDto;
        applicationId: number;
        application: IApplicationDto;
        saveStudentAFM(student: any): ng.IPromise<IApplicationDto>;
        saveOtherParentAFM(updateOtherParentRequest: any): ng.IPromise<IApplicationDto>;
        saveNoOtherParentAFM(updateOtherParentRequest: any): ng.IPromise<IApplicationDto>;
        saveRentalContractData(model: any): ng.IPromise<IApplicationDto>;
        saveRentalContractDataNoContract(model: any): ng.IPromise<IApplicationDto>;
        submitApplication(applicationId: number): ng.IPromise<IApplicationDto>;
        saveCheckedUsageTerms(applicationId: number): ng.IPromise<IApplicationDto>;
    }
    export enum enApplicationType {
        Self = 0,
        Guardian = 1
    }

    export enum enApplicationStatus
    {
        New = 0,
        StudentTax = 10,
        ParentTax = 20,
        RentalData = 30,
        Preview = 40,
        Finalized = 41,
        Submit = 50
    }

    export enum enSpecialCategory
    {
        Orphan = 1,
        ParentsAbroad = 2,
        Over25 = 3,
        NotProtectedMember = 4
    }

    
    class WizardService implements IWizardService {
        static $inject = ['$rootScope', '$q', '$state', '$timeout', '$transitions', 'ApplicationApiClientService', 'toastr', 'ModalService'];

        steps: Array<IWizardStep> = null;
        currentStep: IWizardStep = null;
        currentStepController: BaseStepController = null;
        isInitialized: boolean = false;
        applicationId: number = 0;
        applicationType: enApplicationType = 1;
        applicationSpecialCategory: enSpecialCategory = null;
        application: IApplicationDto = null;
        activeAcademicYearLabel: string = null;
        taxYear: number = null;
        mitrwoPolitwnConsent: boolean = null;
        //student: IStudentDto = null;

        constructor(
            private $rootScope: ng.IScope,
            private $q: ng.IQService,
            private $state: angular.ui.IStateService,
            private $timeout: ng.ITimeoutService,
            private $transitions: any,
            private apiClient: IApiClientService,
            private toaster: any,
            private modalService: Common.IModalService
        ) {
            

            $transitions.onStart({}, this.onTransitionStart.bind(this));
            $transitions.onSuccess({}, this.onTransitionSuccess.bind(this));
        }

        init(applicationId: number, applicationType: enApplicationType, applicationSpecialCategory: enSpecialCategory, activeAcademicYearLabel: string, taxYear: number, mitrwoPolitwnConsent: boolean): ng.IPromise<void> {
         
  var self = this;
            var deferred = this.$q.defer<void>();

            this.applicationId = applicationId;
            this.applicationType = applicationType;
            if (applicationSpecialCategory >= 1) {
                this.applicationSpecialCategory = applicationSpecialCategory;
            }
            this.fixSteps();
            this.isInitialized = true;
            this.steps.forEach(step => step.applicationId = applicationId);

            this.getApplicationById(applicationId)
                .then(function (response) {
                    console.log(response);
                    deferred.resolve(response);
                },
                    function (errors) { deferred.reject(errors); }
                );

            this.activeAcademicYearLabel = activeAcademicYearLabel;
            this.taxYear = taxYear;
            this.mitrwoPolitwnConsent = mitrwoPolitwnConsent;
            return deferred.promise;
        }

        private fixSteps()
        {
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
        }

        getApplicationById(applicationId: number): ng.IPromise<void> {
            var self = this;
            var deferred = this.$q.defer<void>();

            if (applicationId > 0) {
                this.apiClient.getApplicationById(applicationId).then(
                    function (response) {
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
                    },
                    function (errors) {
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
        }

        getCurrentStep() {           
            return this.currentStep;
        }

        getApplicationType() {
            return this.applicationType;
        }

        getApplicationSpecialCategory()
        {
            return this.applicationSpecialCategory;
        }

        setCurrentStep(stepController: any): void {
            this.currentStepController = stepController;
        }
        getActiveAcademicYearLabel() {
            return this.activeAcademicYearLabel;
        }
        getTaxYear() {
            return this.taxYear;
        }

        getMitrwoConsent()
        {
            return this.mitrwoPolitwnConsent;
        }

        getAcademicIDData(model: any): ng.IPromise<IStudentDto> {
            var self = this;
            var deferred = this.$q.defer<IStudentDto>();            

            this.apiClient.getAcademicData(model)
                .then(
                function (response) {
                    self.application.student = response;
                    if (self.application.student.birthYearCheckMessage != null) {
                        self.modalService.info("ΕΙΔΟΠΟΙΗΣΗ", self.application.student.birthYearCheckMessage);
                    }
                    deferred.resolve(response);
                },
                function (errors) {

                    self.modalService.error("Σφάλμα", errors.data);
                    //self.toaster.error(errors.data, 'Σφάλμα');
                    deferred.reject();
                });

            return deferred.promise;
        }

        getStudentGsisData(model: any): ng.IPromise<IStudentDto> {
            var self = this;
            var deferred = this.$q.defer<IStudentDto>();

            this.apiClient.getStudentGsisData(model)
                .then(
                function (response) {
                    self.application.student = response;
                    deferred.resolve(response);
                },
                function (errors) {
                    self.modalService.error("Σφάλμα", errors.data);
//                    self.toaster.error(errors.data, 'Σφάλμα');
                    deferred.reject();
                });

            return deferred.promise;
        }

        getOtherParentGsisData(model: any): ng.IPromise<IGuardianDto> {
            var self = this;
            var deferred = this.$q.defer<IGuardianDto>();

            this.apiClient.getOtherParentGsisData(model)
                .then(
                function (response) {
                    self.application.otherParentOrSpouseAFM = response.AFM;
                    self.application.otherParentOrSpouseFirstName = response.firstName;
                    self.application.otherParentOrSpouseLastName = response.lastName;
                    deferred.resolve(response);
                },
                function (errors) {
                    self.modalService.error("Σφάλμα", errors.data);
//                    self.toaster.error(errors.data, 'Σφάλμα');
                    deferred.reject();
                });

            return deferred.promise;
        }

        getRentalContractData(model: any): ng.IPromise<IRentalDto> {
            var self = this;
            var deferred = this.$q.defer<IRentalDto>();

            this.apiClient.getRentalContractData(model)
                .then(
                function (response) {
                    self.application.rentalKapCityId = response.rentalKapCityId;
                    deferred.resolve(response);
                },
                function (errors) {
                    self.modalService.error("Σφάλμα", errors.data);
                    deferred.reject();
                });

            return deferred.promise;
        }

        saveApplicationStudent(student: any): ng.IPromise<IApplicationDto> {
            var self = this;
            var deferred = this.$q.defer<IApplicationDto>();

            if (self.applicationId > 0) {
                this.apiClient.saveApplicationStudent(student)
                    .then(
                    function (response) {
                        if (self.applicationId == 0) {
                            self.applicationId = response;
                        }
                        deferred.resolve(response);
                    },
                    function (errors) {
                        self.modalService.error("Σφάλμα", errors.data);
//                        self.toaster.error(errors.data, 'Σφάλμα');
                        deferred.reject();
                    });
            }
            else
            {
                this.apiClient.createApplication(student)
                    .then(
                    function (response) {
                        if (self.applicationId == 0) {
                            self.applicationId = response;
                            self.steps.forEach(step => step.applicationId = self.applicationId);
                        }
                        deferred.resolve(response);
                    },
                    function (errors) {
                        self.modalService.error("Σφάλμα", errors.data);
//                        self.toaster.error(errors.data, 'Σφάλμα');
                        deferred.reject();
                    });
            }

            return deferred.promise;
        }

        saveStudentAFM(student: any): ng.IPromise<IApplicationDto> {
            var self = this;
            var deferred = this.$q.defer<IApplicationDto>();

            this.apiClient.saveStudentAFM(student)
                .then(
                function (response) {
                    self.application = response;
                    deferred.resolve(response);
                },
                function (errors) {
                    self.modalService.error("Σφάλμα", errors.data);
//                    self.toaster.error(errors.data, 'Σφάλμα');
                    deferred.reject();
                });

            return deferred.promise;
        }

        saveOtherParentAFM(updateOtherParentRequest: any): ng.IPromise<IApplicationDto> {
            var self = this;
            var deferred = this.$q.defer<IApplicationDto>();

            this.apiClient.saveOtherParentAFM(updateOtherParentRequest)
                .then(
                function (response) {
                    self.application = response;
                    deferred.resolve(response);
                },
                function (errors) {
                    deferred.reject(errors.data);
                });

            return deferred.promise;
        }

        saveNoOtherParentAFM(updateOtherParentRequest: any): ng.IPromise<IApplicationDto> {
            var self = this;
            var deferred = this.$q.defer<IApplicationDto>();

            this.apiClient.saveNoOtherParentAFM(updateOtherParentRequest)
                .then(
                function (response) {
                    self.application = response;
                    deferred.resolve(response);
                },
                function (errors) {
                    deferred.reject(errors.data);
                });

            return deferred.promise;
        }

        saveRentalContractData(updateRentalContractData: any): ng.IPromise<IApplicationDto> {
            var self = this;
            var deferred = this.$q.defer<IApplicationDto>();

            this.apiClient.saveRentalContractData(updateRentalContractData)
                .then(
                function (response) {
                    self.application = response;
                    deferred.resolve(response);
                },
                function (errors) {
                    self.modalService.error("Σφάλμα", errors.data);
                    deferred.reject();
                });

            return deferred.promise;
        }

        saveRentalContractDataNoContract(updateRentalContractData: any): ng.IPromise<IApplicationDto> {
            var self = this;
            var deferred = this.$q.defer<IApplicationDto>();

            this.apiClient.saveRentalContractDataNoContract(updateRentalContractData)
                .then(
                function (response) {
                    self.application = response;
                    deferred.resolve(response);
                },
                function (errors) {
                    self.modalService.error("Σφάλμα", errors.data);
                    deferred.reject();
                });

            return deferred.promise;
        }

        saveCheckedUsageTerms(applicationId): ng.IPromise<IApplicationDto>
        {
            var self = this;
            var deferred = this.$q.defer<IApplicationDto>();

            this.apiClient.saveCheckedUsageTerms(applicationId)
                .then(
                function (response) {
                    self.application = response;
                    deferred.resolve(response);
                },
                function (errors) {
                    self.modalService.error("Σφάλμα", errors.data);
//                    self.toaster.error(errors.data, 'Σφάλμα');
                    deferred.reject();
                });

            return deferred.promise;
        }
      
        
        submitApplication(applicationId: number): ng.IPromise<IApplicationDto> {
            var self = this;
            var deferred = this.$q.defer<IApplicationDto>();

            this.apiClient.submitApplication(applicationId)
                .then(
                function (response) {
                    self.application = response;
                    deferred.resolve(response);
                },
                function (errors) {
                    self.modalService.error("Σφάλμα", errors.data);
//                    self.toaster.error(errors.data, 'Σφάλμα');
                    deferred.reject();
                });

            return deferred.promise;
        }

        private getStep(name) {
            return this.steps.filter(function (step) { return step.name == name; })[0];
        }

        // Transition service of new ui-router service not in typings currently :(
        private onTransitionStart(transitionService: any) {
            let toState = transitionService.to();          

            if (!this.isInitialized) {
                return this.init(toState.applicationId, this.applicationType, this.applicationSpecialCategory,"",0, null);
            }
            else {
                toState.applicationId = this.applicationId;
            }
            

            if (this.currentStepController) {               
                var currentStepIndex = this.steps.indexOf(this.currentStep);
                var nextStepIndex = this.steps.indexOf(this.getStep(transitionService.to().name));
                                
                return (this.currentStepController.canLeave() && this.application.applicationStatus >= toState.data.stepStatus) || currentStepIndex > nextStepIndex;                
            }
        }

        // Transition service of new ui-router service not in typings currently :(
        private onTransitionSuccess(transitionService) {
            this.currentStep = this.getStep(transitionService.to().name);
        }
    }

    ApplicationModule.service('ApplicationWizardService', WizardService);
}