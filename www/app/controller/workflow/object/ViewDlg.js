Ext.define("Aenis.controller.workflow.object.ViewDlg", {
    extend: 'Ext.app.Controller',
    requires: [
        'Aenis.view.workflow.object.ViewDlg'
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

            '[action=cancel]': {
                click:this.onclickCloseBtn
            },
            '.': {
                beforeclose: function() {
                    delete this.oDlg;
                    return true;
                },
                afterrender:{fn:this.afterRenderViewObjectDialog,single:true}
            }
        }, null, this);
        this.oDlg.show();
        return this.oDlg;
    },

    afterRenderViewObjectDialog: function(){

        console.log(this.oDlg.params.params);return;
        var objectId = this.oDlg.params.params.objectId;

        var modelName = 'Aenis.model.workflow.transaction.relationship.Object';
        var model = Ext.create(modelName, {object_id: objectId});

        var me = this;

        model.reload({
                params:{

                    init:1
                }
            },
            function(record, operation/*, success*/) {
                if(operation.wasSuccessful())
                {

                }
            });
    },

    onclickCloseBtn: function() {
        this.oDlg.close();
    }
});


