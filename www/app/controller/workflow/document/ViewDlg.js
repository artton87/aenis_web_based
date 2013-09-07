Ext.define("Aenis.controller.workflow.document.ViewDlg", {
    extend: 'Ext.app.Controller',
    requires: [
        'Aenis.view.workflow.document.ViewDlg'
    ],

    /**
     * Shows dialog and returns created instance of
     * dialog so caller can listen to dialog events.
     * @param {Object} params    {Aenis.model.workflow.Document} model
     * @return {Aenis.view.workflow.document.ViewDlg}
     */
    showDialog: function(params) {
        this.oDlg = this.createMainView();

        this.addComponentRefs(this.oDlg);
        this.oDlg.params = params || {};
        this.oDlg.control({
            '[ref=filesGrid]':{
                selectionchange: this.onclickFilesSelection
            },
            '[action=download]':{
                click:this.onClickDownloadActionBtn
            },
            '[action=cancel]': {
                click:this.onclickCloseBtn
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

    afterRenderViewDocumentDialog: function(){
        var model = this.oDlg.params.docModel;
        var fileStore = model.files();
        this.getFilesGrid().reconfigure(fileStore);

        fileStore.on('load', this.loadDocument, this);
        fileStore.load();
    },

    loadDocument: function(store, records){
        if(records.length == 1)
        {
            this.getFilesGrid().getSelectionModel().select(0);
            this.getFilesViewPanel().hide();
        }
    },

    onclickFilesSelection: function(selModel, selected) {
        if(selected.length > 0)
        {
            var file_id = selected[0].get('id');
            var me = this;
            Ext.Ajax.request({
                url: 'main/file.php',
                method: 'POST',
                params: {
                    id: file_id
                },
                callback: function(options, success, response) {
                    if(Aenis.application.handleAjaxResponse(response))
                    {
                        response = Ext.JSON.decode(response.responseText);
                        if(response.success && response.key)
                        {
                            me.getContentIFrame().load(BestSoft.config.server+'main/file.php?key='+response.key);
                        }
                    }
                }
            });
        }

    },

    onClickDownloadActionBtn: function(){
        var selection = this.getFilesGrid().getSelectionModel().getSelection();
        if(selection)
        {
            var file_id = selection[0].get('id');
            Ext.Ajax.request({
                url: 'main/file.php',
                method: 'POST',
                params: {
                    id: file_id
                },
                callback: function(options, success, response) {
                    if(Aenis.application.handleAjaxResponse(response))
                    {
                        response = Ext.JSON.decode(response.responseText);
                        if(response.success && response.key)
                        {
                            window.location.href = BestSoft.config.server+'main/file.php?key='+response.key+'&force_download=1'
                        }
                    }
                }
            });
        }
    },

    onclickCloseBtn: function() {
        this.oDlg.close();
    }
});


