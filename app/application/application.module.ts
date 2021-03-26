module Application {
    'use strict';

    export var ApplicationModule = angular.module('app.application', [
        // Angular modules 
        'toastr',
        // 3rd Party Modules
        'ui.bootstrap',
        'ui.router',

        // Custom modules 
        'app.common'
    ]).constant('appState', {
        isInitialized: false,
        applicationId: 0
    });
}