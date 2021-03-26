var Common;
(function (Common) {
    'use strict';
    var ModalType;
    (function (ModalType) {
        ModalType[ModalType["info"] = 0] = "info";
        ModalType[ModalType["error"] = 1] = "error";
        ModalType[ModalType["dialog"] = 2] = "dialog";
    })(ModalType || (ModalType = {}));
    var ModalService = (function () {
        function ModalService($rootScope, $q, $uibModal) {
            this.$rootScope = $rootScope;
            this.$q = $q;
            this.$uibModal = $uibModal;
            this.cacheBuster = '?_cb=' + Math.random().toString();
        }
        ModalService.prototype.open = function (title, message, options) {
            options = options || {};
            var o = $.extend({}, this.getOptions({ title: title, message: message, type: ModalType.info }), options);
            return this.doOpen(o);
        };
        ModalService.prototype.error = function (title, message) {
            return this.doOpen(this.getOptions({ title: title, message: message, type: ModalType.error }));
        };
        ModalService.prototype.confirm = function (title, message) {
            return this.doOpen(this.getOptions({ title: title, message: message, type: ModalType.dialog }));
        };
        ModalService.prototype.info = function (title, message) {
            return this.doOpen(this.getOptions({ title: title, message: message, type: ModalType.info }));
        };
        ModalService.prototype.getOptions = function (modalData) {
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
        };
        ModalService.prototype.doOpen = function (options) {
            return this.$uibModal.open(options);
        };
        return ModalService;
    }());
    ModalService.$inject = ["$rootScope", "$q", "$uibModal"];
    var ModalController = (function () {
        function ModalController($uibModalInstance, modalData) {
            this.modal = $uibModalInstance;
            this.title = modalData.title;
            this.message = modalData.message;
            this.type = modalData.type || ModalType.info;
        }
        ModalController.prototype.iconClass = function () {
            return this.type == ModalType.error
                ? 'glyphicon-alert'
                : this.type == ModalType.dialog
                    ? 'glyphicon-question-sign'
                    : 'glyphicon-info-sign';
        };
        ModalController.prototype.showCancel = function () {
            return this.type == ModalType.dialog;
        };
        ModalController.prototype.ok = function () {
            this.modal.close();
        };
        ModalController.prototype.cancel = function () {
            this.modal.dismiss();
        };
        return ModalController;
    }());
    ModalController.$inject = ["$uibModalInstance", "modalData"];
    Common.CommonModule.controller("ModalController", ModalController);
    Common.CommonModule.service("ModalService", ModalService);
})(Common || (Common = {}));
//# sourceMappingURL=common.modal.service.js.map