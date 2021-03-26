module Application {
    'use strict';

    export class ApplicationDemoController {

        // Dependencies on services
        static $inject = ['$location', '$http', 'ApplicationValidationService', 'ModalService'];

        // Properties / state of the controller
        title: string;
        loadedAt: string;
        hitCount: number;
        isBusy: boolean;
        applications: Array<any>;

        // Controller constructor, dependency instances will be passed in the order of $inject
        constructor(private $location: ng.ILocationService,
            private $http: ng.IHttpService,
            private validationService: IValidationService,
            private modalService: Common.IModalService) {
            this.title = 'this is the home page for authenticated user';
            this.isBusy = false;
            this.hitCount = 0;
            this.loadedAt = new Date().toString();
            this.applications = [];
        }

        public increment() {
            this.hitCount++;
        }

        public showModal(type) {
            console.log('SHOWMODAL');
            type = type || 'info';
            this.modalService[type]('Title!!', 'And the description goes here...');
        }

        public refreshLoadedAt() {
            this.loadedAt = new Date().toString();

            var isAFM = this.validationService.checkIsAFM('106868386');
            var isAMKA1 = this.validationService.checkIsAMKA('08108700561');
            var isAMKA3 = this.validationService.checkIsAMKA('08108700564');
            var isAMKA4 = this.validationService.checkIsAMKA('26079101254');
            var isAMKA2 = this.validationService.checkIsAMKA('27037904632');
            var isAcademicId = this.validationService.checkIsAcademicId('166127033115');
        }

        public getApplications() {
            this.isBusy = true;
            this.$http.get<Array<any>>('/api/Application').then(result => {
                console.log(result);
                this.applications = result.data;
            }).then(() => {
                this.isBusy = false;
                });

        }
    }

    ApplicationModule.controller('ApplicationDemoController', ApplicationDemoController);
}