module Application {
    'use strict';

    ApplicationModule.run(ModuleRunner);

    ModuleRunner.$inject = ['$rootScope', '$urlRouter', '$q', '$state', '$timeout', '$document','appState', 'appInit', 'ApplicationWizardService', 'toastr'];

    function ModuleRunner($rootScope: ng.IScope,
        $urlRouter: angular.ui.IUrlRouterService,
        $q: ng.IQService,
        $state: angular.ui.IState,
        $timeout: ng.ITimeoutService,
        $document: ng.IDocumentService,
        appState: any,
        appInit: any,
        applicationWizardService: IWizardService,
        toaster: any    ) {
        
        $document.find('body').addClass('processing');       
        appState.applicationId = appInit.applicationId;

       // We combine necessary promises to bootstrap the editor with the necessary data
        var initPromise = $q.all([applicationWizardService.init(appInit.applicationId, appInit.applicationType, appInit.applicationSpecialCategory, appInit.activeAcademicYearLabel, appInit.taxYear, appInit.mitrwoConsent)]);

        //var unbind = $rootScope.$on('$locationChangeSuccess', function (e, newUrl, oldUrl, newState, oldState) {

            if (appState.isInitialized)
                return;

            //// Prevent $urlRouter's default handler from firing
            //e.preventDefault();

            // We let the routing continue only after initializing of the editor is complete
            initPromise.then(function () {
//                unbind();
                appState.isInitialized = true;

                console.log('*** Initialized - navigate');
       
                $document.find('body').removeClass('processing');

                // Configure $urlRouter's listener after our custom listener
                $urlRouter.listen();
                $urlRouter.sync();
            });
        //});

    }
}