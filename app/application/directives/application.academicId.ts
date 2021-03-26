module Application {
    export class academicId implements ng.IDirective {
        public restrict = 'A';
        public require = 'ngModel';

        constructor(private validationService: IValidationService, private $q: ng.IQService) { }
        link = (scope: ng.IScope, element: ng.IAugmentedJQuery, attrs: ng.IAttributes, ctrl: IAcademicIdValidation) => {
            var me = this;

            ctrl.$asyncValidators.academicId = function (modelValue, viewValue) {
                var def = me.$q.defer<any>();

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

        public static factory(): ng.IDirectiveFactory {
            var directive = (validationService: IValidationService, $q: ng.IQService) => new academicId(validationService, $q);
            directive.$inject = ['ApplicationValidationService', '$q'];
            return directive;
        }

    }
    ApplicationModule.directive('academicId', academicId.factory());

    interface IAcademicIdValidation extends ng.INgModelController {
        $asyncValidators: {
            academicId(modelValue: string, viewValue: string);
        }
    }
}