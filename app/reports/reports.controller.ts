module Reports {
    'use strict';

    export interface IReportsIndexController {
    }

    interface IApplicationInfo {
        applicationType: string;
        applicationStatus: string;
        specialCategory: string;
        institutionName: string;
        academicName: string;
        academicId: number;
        studentAcademicIdentityNumber: number;
        userFirstName: string;
        userLastName: string;
        submittedAt: string;
        decision: string;
    }

    export class ReportsIndexController implements IReportsIndexController {

        // Dependencies on services
        static $inject = ['$location', '$window', '$q', '$http'];

        title: string;
        statistics: any;
        applicationCount: number;
        gridOptions: uiGrid.IGridOptionsOf<IApplicationInfo>;

        // Controller constructor, dependency instances will be passed in the order of $inject
        constructor(
            private $location: ng.ILocationService,
            private $window: ng.IWindowService,
            private $q: ng.IQService,
            private $http: ng.IHttpService) {

            this.title = "The reports title";
            this.statistics = { totalCount: 200 };
            this.gridOptions = {                
                columnDefs: [{
                    displayName: "Id",
                    name: "applicationId"
                }, {
                    displayName: "Τύπος",
                    name: "applicationType"
                }, {
                    displayName: "Όνομα Δικ.",
                    name: "userFirstName"
                }, {
                    displayName: "Επώνυμο Δικ.",
                    name: "userLastName"
                }, {
                    displayName: "Κατάσταση",
                    name: "applicationStatus"
                }, {
                    displayName: "Ίδρυμα",
                    name: "institutionName"
                }],
                data: []
            };

            // Suppress init loading of applications for now
            // this.refreshApplications();
        }

        refreshApplications() {
            this.getApplications().then((applications) => {
                this.applicationCount = applications.totalCount;
                this.gridOptions.data = applications.items;
            });
        }

        getApplications() {
            return this.$http.get<any>('/api/Application/Query?pageIndex=0')
                .then((result) => result.data);
        }
    }

    ReportsModule.controller('ReportsIndexController', ReportsIndexController);
}