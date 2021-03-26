var Services;
(function (Services) {
    function ModalServiceInitializer() {
        var serviceInstance = null;
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
        function open(title, description, options) {
            return getServiceInstance().open(title, description, options);
        }
        function error(title, description) {
            return getServiceInstance().error(title, description);
        }
        function info(title, description) {
            return getServiceInstance().info(title, description);
        }
        function confirm(title, description) {
            return getServiceInstance().confirm(title, description);
        }
        return {
            open: open,
            error: error,
            info: info,
            confirm: confirm
        };
    }
    Services.ModalService = ModalServiceInitializer();
})(Services || (Services = {}));
//# sourceMappingURL=Services.js.map