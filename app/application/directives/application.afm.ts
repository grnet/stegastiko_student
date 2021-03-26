module Application {
    export class afm implements ng.IDirective {
        public restrict = 'A';
        public require = 'ngModel';

        constructor(private validationService: IValidationService, private $q: ng.IQService) { }
        link = (scope: ng.IScope, element: ng.IAugmentedJQuery, attrs: ng.IAttributes, ctrl: IafmValidation) => {
            var me = this;

            ctrl.$asyncValidators.afm = function (modelValue, viewValue) {
                var def = me.$q.defer<any>();

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

        public static factory(): ng.IDirectiveFactory {
            var directive = (validationService: IValidationService, $q: ng.IQService) => new afm(validationService, $q);
            directive.$inject = ['ApplicationValidationService', '$q'];
            return directive;
        }

    }
    ApplicationModule.directive('afm', afm.factory());

    interface IafmValidation extends ng.INgModelController {
        $asyncValidators: {
            afm(modelValue: string, viewValue: string);
        }
    }
}