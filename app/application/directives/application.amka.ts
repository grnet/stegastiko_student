module Application {
    export class amka implements ng.IDirective {
        public restrict = 'A';
        public require = 'ngModel';

        constructor(private validationService: IValidationService, private $q: ng.IQService) { }
        link = (scope: ng.IScope, element: ng.IAugmentedJQuery, attrs: ng.IAttributes, ctrl: IAmkaValidation) => {
            var me = this;

            ctrl.$asyncValidators.amka = function (modelValue, viewValue) {
                var def = me.$q.defer<any>();
                
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

        public static factory(): ng.IDirectiveFactory {
            var directive = (validationService: IValidationService, $q: ng.IQService) => new amka(validationService, $q);
            directive.$inject = ['ApplicationValidationService', '$q'];
            return directive;
        }

    }
    ApplicationModule.directive('amka', amka.factory());

    interface IAmkaValidation extends ng.INgModelController {
        $asyncValidators: {
            amka(modelValue: string, viewValue: string);
        }
    }
}