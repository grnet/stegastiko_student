var Application;
(function (Application) {
    var afm = (function () {
        function afm(validationService, $q) {
            var _this = this;
            this.validationService = validationService;
            this.$q = $q;
            this.restrict = 'A';
            this.require = 'ngModel';
            this.link = function (scope, element, attrs, ctrl) {
                var me = _this;
                ctrl.$asyncValidators.afm = function (modelValue, viewValue) {
                    var def = me.$q.defer();
                    if (me.validationService.checkIsAFM(viewValue)) {
                        // it is valid
                        ctrl.$setValidity('afm', true);
                        def.resolve(viewValue);
                    }
                    else {
                        ctrl.$setValidity('afm', false);
                        def.reject(viewValue);
                    }
                    return def.promise;
                };
                scope.$watch('afm', ctrl.$asyncValidators.afm);
            };
        }
        afm.factory = function () {
            var directive = function (validationService, $q) { return new afm(validationService, $q); };
            directive.$inject = ['ApplicationValidationService', '$q'];
            return directive;
        };
        return afm;
    }());
    Application.afm = afm;
    Application.ApplicationModule.directive('afm', afm.factory());
})(Application || (Application = {}));
//# sourceMappingURL=application.afm.js.map