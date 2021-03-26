var Application;
(function (Application) {
    'use strict';
    var ApiClientService = (function () {
        function ApiClientService($http, $q) {
            this.$http = $http;
            this.$q = $q;
        }
        ApiClientService.prototype.getApplications = function () {
            return this.$http.get('/api/Application')
                .then(function (result) { return result.data; });
        };
        ApiClientService.prototype.getApplicationById = function (id) {
            return this.$http.get('/api/Application/' + id).then(function (result) { return result.data; });
        };
        ApiClientService.prototype.getAcademicData = function (model) {
            return this.$http.post('/api/getAcademicData', model, {
                headers: {
                    'Content-Type': 'application/json'
                }
            }).then(function (result) { return result.data; });
        };
        ApiClientService.prototype.getStudentGsisData = function (model) {
            return this.$http.post('/api/getStudentGsisData', model, {
                headers: {
                    'Content-Type': 'application/json'
                }
            }).then(function (result) { return result.data; });
        };
        ApiClientService.prototype.getOtherParentGsisData = function (model) {
            return this.$http.post('/api/getOtherParentGsisData', model, {
                headers: {
                    'Content-Type': 'application/json'
                }
            }).then(function (result) { return result.data; });
        };
        ApiClientService.prototype.getRentalContractData = function (model) {
            return this.$http.post('/api/getRentalContractData', model, {
                headers: {
                    'Content-Type': 'application/json'
                }
            }).then(function (result) { return result.data; });
        };
        ApiClientService.prototype.saveApplicationStudent = function (student) {
            return this.$http.post('/api/saveApplicationStudent', student, {
                headers: {
                    'Content-Type': 'application/json'
                }
            }).then(function (result) { return result.data; });
        };
        ApiClientService.prototype.createApplication = function (student) {
            return this.$http.post('/api/createApplication', student, {
                headers: {
                    'Content-Type': 'application/json'
                }
            }).then(function (result) { return result.data; });
        };
        ApiClientService.prototype.saveStudentAFM = function (student) {
            console.log(student);
            return this.$http.post('/api/saveStudentAFM', student, {
                headers: {
                    'Content-Type': 'application/json'
                }
            }).then(function (result) { return result.data; });
        };
        ApiClientService.prototype.saveOtherParentAFM = function (updateOtherParentRequest) {
            return this.$http.post('/api/saveOtherParentAFM', updateOtherParentRequest, {
                headers: {
                    'Content-Type': 'application/json'
                }
            }).then(function (result) { return result.data; });
        };
        ApiClientService.prototype.saveNoOtherParentAFM = function (updateOtherParentRequest) {
            return this.$http.post('/api/saveNoOtherParentAFM', updateOtherParentRequest, {
                headers: {
                    'Content-Type': 'application/json'
                }
            }).then(function (result) { return result.data; });
        };
        ApiClientService.prototype.saveRentalContractData = function (updateRentalContractDataRequest) {
            return this.$http.post('/api/saveRentalContractData', updateRentalContractDataRequest, {
                headers: {
                    'Content-Type': 'application/json'
                }
            }).then(function (result) { return result.data; });
        };
        ApiClientService.prototype.saveRentalContractDataNoContract = function (updateRentalContractDataRequest) {
            return this.$http.post('/api/saveRentalContractDataNoContract', updateRentalContractDataRequest, {
                headers: {
                    'Content-Type': 'application/json'
                }
            }).then(function (result) { return result.data; });
        };
        ApiClientService.prototype.saveCheckedUsageTerms = function (id) {
            return this.$http.post('/api/Application/' + id + '/usageTerms', { applicationId: id, userId: null }).then(function (result) { return result.data; });
        };
        ApiClientService.prototype.submitApplication = function (id) {
            return this.$http.post('/api/Application/' + id + '/submit', { applicationId: id, userId: null }).then(function (result) { return result.data; });
        };
        return ApiClientService;
    }());
    ApiClientService.$inject = ['$http', '$q'];
    Application.ApplicationModule.service('ApplicationApiClientService', ApiClientService);
})(Application || (Application = {}));
//# sourceMappingURL=application.apiClient.service.js.map