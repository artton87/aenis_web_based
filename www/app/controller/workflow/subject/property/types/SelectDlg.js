Ext.define("Aenis.controller.workflow.subject.property.types.SelectDlg", {
    extend: 'Ext.app.Controller',
    requires: [
        'Aenis.view.workflow.subject.property.types.SelectDlg'
    ],

    mixins: [
        'Locale.hy_AM.Common',
        'BestSoft.mixin.Localized',
        'Locale.hy_AM.workflow.subject.property.types.SelectDlg'
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
        var partyStore = this.oDlg.params.model.partyStore;
        Ext.suspendLayouts();
        var item;
        var me =this;
        var partyInheritanceRelationPanel = me.getPartyInheritanceRelationPanel();
        var partyCmpCfg = Ext.clone(partyInheritanceRelationPanel.partyComponentConfig);
       // var partyCmpCfg =partyInheritanceRelationPanel.partyComponentConfig;
        partyStore.each(function(partyModel) {
            Ext.apply(partyCmpCfg, {
                title: partyModel.get('party_type_label'),
                partyTypeCode: partyModel.get('party_type_code')
            });
            item = Ext.ComponentManager.create(partyCmpCfg);
            partyInheritanceRelationPanel.add(item);
            partyInheritanceRelationPanel.down('[partyTypeCode='+partyModel.get('party_type_code')+']').loadFromSubjectsStore(partyModel.subjects());

        }, this);

        Ext.resumeLayouts(true);
    },


    onClickAddAction: function(){

        var panel = Ext.ComponentQuery.query('[partyTypeCode]',this.getPartyInheritanceRelationPanel());
        var data = [];

        for(var i = 0; i < panel.length; ++i)
        {
            var selection = panel[i].getSelectionModel().getSelection();
            data.push({
                data: selection[0]
            });
        }

        console.log(data);




        /*var selection = this.getSubjectRelations().getSelectionModel().getSelection();
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
        }*/
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

