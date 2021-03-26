module Application {
    'use strict';

    export interface IApiClientService {
        getApplications(): ng.IPromise<any[]>;
        getApplicationById(id: number): ng.IPromise<any>;
        getAcademicData(model: any): ng.IPromise<any>;
        getStudentGsisData(model: any): ng.IPromise<any>;
        getOtherParentGsisData(model: any): ng.IPromise<any>;
        getRentalContractData(model: any): ng.IPromise<any>;
        saveApplicationStudent(model: any): ng.IPromise<any>;
        createApplication(model: any): ng.IPromise<any>;
        saveStudentAFM(student: any): ng.IPromise<any>;
        saveOtherParentAFM(updateOtherParentRequest: any): ng.IPromise<any>;
        saveNoOtherParentAFM(updateOtherParentRequest: any): ng.IPromise<any>;
        saveRentalContractData(updateRentalContractDataRequest: any): ng.IPromise<any>;
        saveRentalContractDataNoContract(updateRentalContractDataRequest: any): ng.IPromise<any>;
        submitApplication(applicationId: number): ng.IPromise<any>;
        saveCheckedUsageTerms(applicationId: number)
    }

    class ApiClientService implements IApiClientService {

        static $inject = ['$http', '$q'];

        constructor(
            private $http: ng.IHttpService,
            private $q: ng.IQService
        ) { }

        public getApplications(): angular.IPromise<any[]> {
            return this.$http.get<Array<any>>('/api/Application')
                .then(result => result.data);
        }

        public getApplicationById(id: number): angular.IPromise<any> {
            return this.$http.get<any>('/api/Application/' + id).then(result => result.data);
        }

        public getAcademicData(model: any): ng.IPromise<any> {
            return this.$http.post<any>(
                '/api/getAcademicData',
                model,
                {
                    headers: {
                        'Content-Type': 'application/json'
                    }
                }
            ).then(result => result.data);
        }

        public getStudentGsisData(model: any): ng.IPromise<any> {
            return this.$http.post<any>(
                '/api/getStudentGsisData',
                model,
                {
                    headers: {
                        'Content-Type': 'application/json'
                    }
                }
            ).then(result => result.data);
        }

        public getOtherParentGsisData(model: any): ng.IPromise<any> {
            return this.$http.post<any>(
                '/api/getOtherParentGsisData',
                model,
                {
                    headers: {
                        'Content-Type': 'application/json'
                    }
                }
            ).then(result => result.data);
        }

        public getRentalContractData(model: any): ng.IPromise<any> {
            return this.$http.post<any>(
                '/api/getRentalContractData',
                model,
                {
                    headers: {
                        'Content-Type': 'application/json'
                    }
                }
            ).then(result => result.data);
        }

        public saveApplicationStudent(student: any): ng.IPromise<any> {
            return this.$http.post<any>(
                '/api/saveApplicationStudent',
                student,
                {
                    headers: {
                        'Content-Type': 'application/json'
                    }
                }
            ).then(result => result.data);
        }

        public createApplication(student: any): ng.IPromise<any> {
            return this.$http.post<any>(
                '/api/createApplication',
                student,
                {
                    headers: {
                        'Content-Type': 'application/json'
                    }
                }
            ).then(result => result.data);
        }

        public saveStudentAFM(student: any): ng.IPromise<any> {

            console.log(student);

            return this.$http.post<any>(
                '/api/saveStudentAFM',
                student,
                {
                    headers: {
                        'Content-Type': 'application/json'
                    }
                }
            ).then(result => result.data);
        }

        public saveOtherParentAFM(updateOtherParentRequest: any): ng.IPromise<any> {
            return this.$http.post<any>(
                '/api/saveOtherParentAFM',
                updateOtherParentRequest,
                {
                    headers: {
                        'Content-Type': 'application/json'
                    }
                }
            ).then(result => result.data);
        }

        public saveNoOtherParentAFM(updateOtherParentRequest: any): ng.IPromise<any> {
            return this.$http.post<any>(
                '/api/saveNoOtherParentAFM',
                updateOtherParentRequest,
                {
                    headers: {
                        'Content-Type': 'application/json'
                    }
                }
            ).then(result => result.data);
        }


        public saveRentalContractData(updateRentalContractDataRequest: any): ng.IPromise<any> {
            return this.$http.post<any>(
                '/api/saveRentalContractData',
                updateRentalContractDataRequest,
                {
                    headers: {
                        'Content-Type': 'application/json'
                    }
                }
            ).then(result => result.data);
        }

        public saveRentalContractDataNoContract(updateRentalContractDataRequest: any): ng.IPromise<any> {
            return this.$http.post<any>(
                '/api/saveRentalContractDataNoContract',
                updateRentalContractDataRequest,
                {
                    headers: {
                        'Content-Type': 'application/json'
                    }
                }
            ).then(result => result.data);
        }

        public saveCheckedUsageTerms(id: number): angular.IPromise<any> {
            return this.$http.post<any>('/api/Application/' + id + '/usageTerms', { applicationId: id, userId: null }).then(result => result.data);
        }
        public submitApplication(id: number): angular.IPromise<any> {
            return this.$http.post<any>('/api/Application/' + id + '/submit', { applicationId: id, userId: null }).then(result => result.data);
        }
    }

    ApplicationModule.service('ApplicationApiClientService', ApiClientService);
}