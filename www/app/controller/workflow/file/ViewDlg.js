Ext.define("Aenis.controller.workflow.file.ViewDlg", {
    extend: 'Ext.app.Controller',
    requires: [
        'Aenis.view.workflow.file.ViewDlg'
    ],

    /**
     * Shows dialog and returns created instance of
     * dialog so caller can listen to dialog events.
     * @param {Number} fileId    File id, as in database
     * @param {String} [fileName]    Optional. File name to be displayed in dialog title
     * @return {Aenis.view.workflow.document.ViewDlg}
     */
    showDialog: function(fileId, fileName) {
        this.oDlg = this.createMainView();

        this.addComponentRefs(this.oDlg);
        this.oDlg.params = {
            fileId: fileId,
            fileName: fileName
        };
        this.oDlg.control({
            '[action=download]':{
                click:this.onClickDownloadActionBtn
            },
            '[action=cancel]': {
                click: {fn: this.oDlg.close, scope: this.oDlg}
            },
            '.': {
                beforeclose: function() {
                    delete this.oDlg;
                    return true;
                },
                afterrender:{fn:this.afterRenderViewDocumentDialog,single:true}
            }
        }, null, this);
        this.oDlg.show();
        return this.oDlg;
    },

    afterRenderViewDocumentDialog: function() {
        var me = this;
        this.getFileById(
            this.oDlg.params.fileId,
            function(key) {
                me.getContentIFrame().load(BestSoft.config.server+'main/file.php?key='+key);
            }
        );
        if(this.oDlg.params.fileName != '')
        {
            this.oDlg.setTitle(this.oDlg.params.fileName);
        }
    },

    onClickDownloadActionBtn: function(){
        this.getFileById(
            this.oDlg.params.fileId,
            function(key) {
                window.location.href = BestSoft.config.server+'main/file.php?key='+key+'&force_download=1'
            }
        );
    },


    getFileById: function(fileId, fnCallback) {
        var me = this;
        Ext.Ajax.request({
            url: 'main/file.php',
            method: 'POST',
            params: {
                id: me.oDlg.params.fileId
            },
            callback: function(options, success, response) {
                if(Aenis.application.handleAjaxResponse(response))
                {
                    response = Ext.JSON.decode(response.responseText);
                    if(response.success && response.key)
                    {
                        fnCallback(response.key);
                    }
                }
            }
        });
    }
});


