module Reports {
    'use strict';

    export var ReportsModule = angular.module('app.reports', [
        // Angular modules 
        'toastr',
        // 3rd Party Modules
        'ui.bootstrap',
        'ui.router',
        'ui.grid',

        // Custom modules 
        'app.common'
    ]);
}