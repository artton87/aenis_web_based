Ext.define("Aenis.controller.workflow.subject.relation.AgentSelectDlg", {
    extend: 'Ext.app.Controller',
    requires: [
        'Aenis.view.workflow.subject.relation.AgentSelectDlg'
    ],

    mixins: [
        'Locale.hy_AM.Common',
        'BestSoft.mixin.Localized',
        'Locale.hy_AM.workflow.subject.relation.AgentSelectDlg'
    ],

    /**
     * Shows dialog and returns created instance of
     * dialog so caller can listen to dialog events.
     * @param {Object} params    {Aenis.model.main.contact.Selection} model
     * @return {Aenis.view.workflow.subject.relation.AgentSelectDlg}
     */
    showDialog: function(params) {
        this.oDlg = this.createMainView();
        this.addComponentRefs(this.oDlg);
        this.oDlg.addEvents(
            /**
             * @event approved
             * Fired when user selects contact
             * Return FALSE from event handler to prevent dialog from closing.
             */
            'itemSelected',

            /**
             * @event cancelled
             * Fired when user closes the dialog without any action
             */
            'cancelled'
        );
        this.oDlg.returnValue = null;
        this.oDlg.params = params || {};
        this.oDlg.control({

            '[ref=subjectRelationTypes]':{
                'beforerender':this.onBeforeRenderSubjectRelationTypes
            },
            '[ref=addAction]':{
              click: this.onClickAddAction

            },
            '[action=cancel]': {
                click:this.onclickCloseBtn
            },
            '.': {
                beforeclose: function(oDlg) {
                    if(oDlg.returnValue)
                    {
                        if(!oDlg.fireEvent('itemSelected', oDlg.returnValue))
                        {
                            oDlg.returnValue = null;
                            return false;
                        }
                    }
                    else
                    {
                        oDlg.fireEvent('cancelled');
                    }
                    delete this.oDlg;
                    return true;
                },
                afterrender:this.afterRenderDialogView
            }
        }, null, this);
        this.oDlg.show();
        return this.oDlg;
    },

    afterRenderDialogView: function(){
        console.log(this.oDlg.params.model);
        this.getSubjectRelations().getStore().loadData(this.oDlg.params.model);
        this.getSubjectRelations().down('toolbar').hide();
    },


    onClickAddAction: function(){

        var selection = this.getSubjectRelations().getSelectionModel().getSelection();
        if(selection.length > 0)
        {
            var combo = this.getSubjectRelationTypes();
            var relationTypeId = parseInt(combo.getValue());
            var relationType = combo.getRawValue();

            var data = {
                data: selection,
                rel_type_id: relationTypeId,
                rel_type: relationType
            };

            this.oDlg.returnValue = data;
            this.oDlg.close();
        }
    },

    // subject relations types before render
    onBeforeRenderSubjectRelationTypes: function(oList){
        var oStore = oList.getStore();
        oStore.load({
                scope:this,
                callback: function(records) {
                    this.getSubjectRelationTypes().setValue(records[0]);
                }
            }
        );
    },

    onclickCloseBtn: function() {
        this.oDlg.close();
    }
});

