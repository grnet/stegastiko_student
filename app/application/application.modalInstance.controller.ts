module Application {
    'use strict';

    export class ApplicationModalInstanceController {

        static $inject = ['$scope', '$uibModalInstance'];

        constructor(private $scope: ng.IScope, private $uibModalInstance: any) {
        }

        public cancel()
        {
            this.$uibModalInstance.dismiss('cancel');
        }

        public print()
        {
            window.frames["ifUsageTerms"].focus();
            window.frames["ifUsageTerms"].print();
        }
    }

    ApplicationModule.controller('ApplicationModalInstanceController', ApplicationModalInstanceController);
}