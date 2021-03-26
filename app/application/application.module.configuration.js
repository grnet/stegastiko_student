var Application;
(function (Application) {
    'use strict';
    Application.ApplicationModule.config(ModuleConfiguration);
    ModuleConfiguration.$inject = ['$compileProvider', '$stateProvider', '$urlRouterProvider', '$locationProvider', 'appInit', 'toastrConfig'];
    function ModuleConfiguration($compileProvider, $stateProvider, $urlRouterProvider, $locationProvider, appInit, toastrConfig) {
        configure();
        function configure() {
            // disable debug info
            //$compileProvider.debugInfoEnabled(false);
            // Enables urls without the hash (#) character
            $locationProvider.html5Mode(true);
            // For any unmatched url, redirect to /Summary
            $urlRouterProvider.otherwise("/" + (appInit ? appInit.applicationId || 0 : 0) + "/AcademicIdentity");
            // To first handle initialization before handling the route change
            $urlRouterProvider.deferIntercept();
            // Configure router states
            configureStates();
            angular.extend(toastrConfig, {
                autoDismiss: false,
                containerId: 'toast-container',
                maxOpened: 0,
                newestOnTop: true,
                positionClass: 'toast-top-full-width',
                preventDuplicates: false,
                preventOpenDuplicates: false,
                target: 'body',
                timeOut: 5000,
                extendedTimeOut: 1000
            });
        }
        function configureStates() {
            // Cachebuster parameter for dev only
            var cb = "?_cb=" + Math.random();
            $stateProvider
                .state('academicIdentity', {
                url: '/:applicationId/AcademicIdentity',
                templateUrl: '/app/application/steps/academicIdentityStep.html' + cb,
                controller: 'AcademicIdentityStepController as vm',
                data: {
                    stepStatus: Application.enApplicationStatus.New
                }
            })
                .state('taxRegistration', {
                url: '/:applicationId/StudentTaxRegistration',
                templateUrl: '/app/application/steps/studentTaxRegistrationStep.html' + cb,
                controller: 'StudentTaxRegistrationStepController as vm',
                data: {
                    stepStatus: Application.enApplicationStatus.StudentTax
                }
            })
                .state('parentTaxRegistration', {
                url: '/:applicationId/ParentTaxRegistration',
                templateUrl: '/app/application/steps/parentTaxRegistrationStep.html' + cb,
                controller: 'ParentTaxRegistrationStepController as vm',
                data: {
                    stepStatus: Application.enApplicationStatus.ParentTax
                }
            })
                .state('studentAccommodationData', {
                url: '/:applicationId/StudentAccommodationData',
                templateUrl: '/app/application/steps/studentAccommodationDataStep.html' + cb,
                controller: 'StudentAccommodationDataStepController as vm',
                data: {
                    stepStatus: Application.enApplicationStatus.RentalData
                }
            })
                .state('preview', {
                url: '/:applicationId/Preview',
                templateUrl: '/app/application/steps/previewStep.html' + cb,
                controller: 'PreviewStepController as vm',
                data: {
                    stepStatus: Application.enApplicationStatus.Preview
                }
            })
                .state('submit', {
                url: '/:applicationId/Submit',
                templateUrl: '/app/application/steps/submitStep.html' + cb,
                controller: 'SubmitStepController as submitStep'
            });
        }
    }
})(Application || (Application = {}));
//# sourceMappingURL=application.module.configuration.js.map