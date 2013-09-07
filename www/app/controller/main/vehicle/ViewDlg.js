Ext.define("Aenis.controller.main.vehicle.ViewDlg", {
    extend: 'Ext.app.Controller',
    requires: [
        'Aenis.view.main.vehicle.ViewDlg'
    ],

    mixins: [
        'Locale.hy_AM.Common',
        'Locale.hy_AM.main.vehicle.ViewDlg',
        'BestSoft.mixin.Localized'
    ],

    /**
     * Shows dialog and returns created instance of
     * dialog so caller can listen to dialog events.
     * @param {Object} params    {Aenis.model.main.contact.Natural} model
     * @return {Aenis.view.main.contact.Natural}
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
                afterrender:{fn:this.afterRenderVehicleViewDialog,single:true}
            }
        }, null, this);
        this.oDlg.show();
        return this.oDlg;
    },

    afterRenderVehicleViewDialog: function(){

        var objectModel = this.oDlg.params.objectModel;

        var documentsPanel = this.getDocumentsPanel();
        var item;
        var me = this;

        var docStore = objectModel.documents();
        docStore.load();

        var oForm = this.getVehicleDataContent();
        var modelName = 'Aenis.model.main.Vehicle';
        var model = Ext.create(modelName, {id: objectModel.getId()});

        model.reload({},
            function(record, operation/*, success*/) {
                if(operation.wasSuccessful())
                {
                    var fields = [
                        'vin',
                        'number',
                        'body_type',
                        'body_number',
                        'chassis_number',
                        'color',
                        'engine_number',
                        'engine_power',
                        'model',
                        'model_year',
                        'type',
                        'owner'
                    ];
                    for(var i=0; i < fields.length; ++i)
                    {
                        oForm.down('[name='+fields[i]+']').setValue(record.get(fields[i]));
                    }

                    Ext.suspendLayouts();
                    docStore.each(function(record){
                        var cfg = {
                            xtype:'fieldcontainer',
                            layout:{
                                type:'hbox'
                            },
                            defaultType: 'displayfield',
                            defaults:{
                                margin:'0px 10px 0px 0px'
                            },
                            items:[
                                {
                                    xtype:'button',
                                    tooltip: me.T('view'),
                                    iconCls: 'icon-view',
                                    type:'document',
                                    model: record,
                                    listeners:{
                                        click: {fn:me.onclickViewContent, scope: me}
                                    },
                                    ui: 'default-toolbar-small'
                                },
                                {
                                    value: record.get('doc_type_label'),
                                    flex: 1
                                }
                            ]
                        };
                        item = Ext.ComponentManager.create(cfg);
                        documentsPanel.add(item);
                    });
                  Ext.resumeLayouts(true);
                }
            }
        );
    },

    onclickCloseBtn: function() {
        this.oDlg.close();
    },

    onclickViewContent: function(oBtn){
        console.log(oBtn);
        var oController = this.application.loadController('Aenis.controller.workflow.document.ViewDlg');
        oController.showDialog({docModel:oBtn.model});
    }
});



