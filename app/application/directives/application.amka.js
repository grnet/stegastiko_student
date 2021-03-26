var Application;
(function (Application) {
    var amka = (function () {
        function amka(validationService, $q) {
            var _this = this;
            this.validationService = validationService;
            this.$q = $q;
            this.restrict = 'A';
            this.require = 'ngModel';
            this.link = function (scope, element, attrs, ctrl) {
                var me = _this;
                ctrl.$asyncValidators.amka = function (modelValue, viewValue) {
                    var def = me.$q.defer();
                    if (me.validationService.checkIsAMKA(viewValue)) {
                        // it is valid
                        ctrl.$setValidity('amka', true);
                        def.resolve(viewValue);
                    }
                    else {
                        ctrl.$setValidity('amka', false);
                        def.reject(viewValue);
                    }
                    return def.promise;
                };
                scope.$watch('amka', ctrl.$asyncValidators.amka);
            };
        }
        amka.factory = function () {
            var directive = function (validationService, $q) { return new amka(validationService, $q); };
            directive.$inject = ['ApplicationValidationService', '$q'];
            return directive;
        };
        return amka;
    }());
    Application.amka = amka;
    Application.ApplicationModule.directive('amka', amka.factory());
})(Application || (Application = {}));
//# sourceMappingURL=application.amka.js.map