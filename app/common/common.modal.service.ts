module Common {
    'use strict';

    export interface IModalService {
        open(title: string, message: string, options?: angular.ui.bootstrap.IModalSettings): angular.ui.bootstrap.IModalInstanceService;
        error(title: string, message: string): angular.ui.bootstrap.IModalInstanceService;
        info(title: string, message: string): angular.ui.bootstrap.IModalInstanceService;
        confirm(title: string, message: string): angular.ui.bootstrap.IModalInstanceService;
    }

    enum ModalType {
        info,
        error,
        dialog
    }

    interface IModalData {
        title: string;
        message: string;
        type: ModalType
    }

    class ModalService implements IModalService {
        static $inject = ["$rootScope", "$q", "$uibModal"];

        private cacheBuster: string;

        constructor(
            private $rootScope: angular.IScope,
            private $q: angular.IQService,
            private $uibModal: angular.ui.bootstrap.IModalService) {
            this.cacheBuster = '?_cb=' + Math.random().toString();
        }

        open(title: string, message: string, options?: angular.ui.bootstrap.IModalSettings): angular.ui.bootstrap.IModalServiceInstance  {
            options = options || {};
            var o = $.extend({}, this.getOptions({ title: title, message: message, type: ModalType.info }), options);
            return this.doOpen(o);
        }

        error(title: string, message: string) {
            return this.doOpen(this.getOptions({ title: title, message: message, type: ModalType.error }));
        }

        confirm(title: string, message: string) {
            return this.doOpen(this.getOptions({ title: title, message: message, type: ModalType.dialog }));
        }

        info(title: string, message: string) {
            return this.doOpen(this.getOptions({ title: title, message: message, type: ModalType.info }));
        }

        private getOptions(modalData: IModalData) : angular.ui.bootstrap.IModalSettings {
            // set the window class to customize the look of the modal
            var windowClass = modalData.type == ModalType.error
                ? 'error-modal'
                : modalData.type == ModalType.info ? 'info-modal' : 'dialog-modal';

            // Prevent backdrop click to close the modal for dialogs ('static' does that)
            var backdrop = modalData.type == ModalType.dialog ? 'static' : true;

            return {
                controller: 'ModalController as vm',
                windowClass: windowClass,
                size: 'md',
                templateUrl: '/app/common/templates/modal.html' + this.cacheBuster,
                resolve: { modalData: modalData },
                backdrop: backdrop
            };
        }

        private doOpen(options: angular.ui.bootstrap.IModalSettings): angular.ui.bootstrap.IModalServiceInstance {
            return this.$uibModal.open(options);
        }
    }

    class ModalController {
        static $inject = ["$uibModalInstance", "modalData"];

        title: string;
        message: string;
        type: ModalType;
        modal: ng.ui.bootstrap.IModalServiceInstance;
        
        constructor($uibModalInstance: ng.ui.bootstrap.IModalServiceInstance, modalData: IModalData) {
            this.modal = $uibModalInstance;
            this.title = modalData.title;
            this.message = modalData.message;
            this.type = modalData.type || ModalType.info;       
        }

        public iconClass() {
            return this.type == ModalType.error
                ? 'glyphicon-alert'
                : this.type == ModalType.dialog
                    ? 'glyphicon-question-sign'
                    : 'glyphicon-info-sign';
        }

        public showCancel() {
            return this.type == ModalType.dialog;
        }

        public ok() {
            this.modal.close();
        }

        public cancel() {
            this.modal.dismiss();
        }
    }

    CommonModule.controller("ModalController", ModalController);
    CommonModule.service("ModalService", ModalService);
}