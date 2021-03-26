var Application;
(function (Application) {
    'use strict';
    Application.ApplicationModule = angular.module('app.application', [
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
})(Application || (Application = {}));
//# sourceMappingURL=application.module.js.map