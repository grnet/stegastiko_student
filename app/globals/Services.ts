module Services {

    function ModalServiceInitializer() {

        var serviceInstance: Common.IModalService = null;

        function getServiceInstance() {
            if (!serviceInstance) {
                /// TODO:NIKOS: Could the dependencies be loaded dynamically (eg using require.js library)?
                angular.module('app.bridge', ['app.common'])
                    .run(['ModalService', function (modalService) {
                        serviceInstance = modalService;
                    }]);

                angular.bootstrap($('<div id="ang-vsbridge"></div>').get(0), ['app.bridge']);
            }            

            return serviceInstance;
        }

        function open(title: string, description: string, options?: angular.ui.bootstrap.IModalSettings) {
            return getServiceInstance().open(title, description, options);            
        }

        function error(title: string, description: string) {
            return getServiceInstance().error(title, description);
        }

        function info(title: string, description: string) {
            return getServiceInstance().info(title, description);
        }

        function confirm(title: string, description: string) {
            return getServiceInstance().confirm(title, description);
        }

        return {
            open: open,
            error: error,
            info: info,
            confirm: confirm
        };
    }

    export var ModalService = ModalServiceInitializer();
}