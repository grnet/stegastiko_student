var Application;
(function (Application) {
    var academicId = (function () {
        function academicId(validationService, $q) {
            var _this = this;
            this.validationService = validationService;
            this.$q = $q;
            this.restrict = 'A';
            this.require = 'ngModel';
            this.link = function (scope, element, attrs, ctrl) {
                var me = _this;
                ctrl.$asyncValidators.academicId = function (modelValue, viewValue) {
                    var def = me.$q.defer();
                    if (me.validationService.checkIsAcademicId(viewValue)) {
                        // it is valid
                        ctrl.$setValidity('academicId', true);
                        def.resolve(viewValue);
                    }
                    else {
                        ctrl.$setValidity('academicId', false);
                        def.reject(viewValue);
                    }
                    return def.promise;
                };
                scope.$watch('academicId', ctrl.$asyncValidators.academicId);
            };
        }
        academicId.factory = function () {
            var directive = function (validationService, $q) { return new academicId(validationService, $q); };
            directive.$inject = ['ApplicationValidationService', '$q'];
            return directive;
        };
        return academicId;
    }());
    Application.academicId = academicId;
    Application.ApplicationModule.directive('academicId', academicId.factory());
})(Application || (Application = {}));
//# sourceMappingURL=application.academicId.js.map