Ext.require([
    'Ext.tab.Panel',
    'Ext.form.field.Hidden',
    'Ext.form.Label',
    'Ext.form.field.File'
]);

Ext.define('Aenis.view.workflow.warrant.ApproveDlg', {
    extend:'Ext.window.Window',

    alias: 'widget.workflowWarrantApproveDlg',

    modal: true,
    closeAction: 'destroy',

    layout:'fit',
    flex:1,

    mixins: [
        'Locale.hy_AM.Common',
        'Locale.hy_AM.workflow.warrant.ApproveDlg',
        'BestSoft.mixin.Localized'
    ],

    getTransactionType: function(value){
      value = '<b>'+value+'</b>';
        return value;
    },

    initComponent: function(){
        Ext.apply(this, {
            title: this.T("approve_warrant"),
            width: 600,
            height: 550,
            draggable: true,

            items: [
                {
                    xtype:'form',
                    ref: 'approveWarrantForm',
                    url: 'workflow/warrant/approve.php',
                    waitMsg: this.T("file_is_uploading"),
                    messages: {
                        warrant_approved: this.T("warrant_approved")
                    },
                    frame: true,
                    layout:{
                        type:'vbox',
                        align:'stretch'
                    },
                    autoScroll:true,
                    //title: '<b>'+this.T('transaction_payment')+'</b>',
                    items:[
                        {
                            xtype: 'container',
                            ref: 'dutyPaymentOptionsPanel',
                            layout:{
                                type:'vbox',
                                align: 'stretch'
                            },
                            items:[
                                {
                                    xtype: 'fieldcontainer',
                                    fieldLabel: this.T('transaction_type'),
                                    margin:'10 10',
                                    layout: {
                                        type: 'hbox',
                                        align: 'center',
                                        pack: 'center'
                                    },
                                    items: [
                                        {
                                            xtype: 'displayfield',
                                            ref: 'transactionTypeField',
                                            flex: 1,
                                            submitValue: false,
                                            readOnly: true,
                                            renderer: this.getTransactionType
                                        }
                                    ]
                                },
                                {
                                    xtype:'fieldset',
                                    title: this.T('discount'),
                                    frame: true,
                                    layout:{
                                        type:'hbox'
                                    },
                                    items:[
                                        {
                                            xtype: 'filefield',
                                            name: 'file_discount',
                                            ref: 'discountDocument',
                                            fieldLabel: this.T('attach_file'),
                                            labelWidth: 40,
                                            buttonText: this.T('select'),
                                            iconCls: 'icon-browse'
                                        },
                                        {
                                            xtype:'button',
                                            ref:'resetDiscount',
                                            iconCls:'icon-reset',
                                            tooltip: this.T('reset'),
                                            hidden: true
                                        }
                                    ]
                                },
                                {
                                    xtype:'fieldset',
                                    title: this.T('inheritor_types'),
                                    frame: true,
                                    ref: 'inheritorTypesPanel',
                                    layout:{
                                        type:'hbox'
                                    },
                                    items:[
                                        {
                                            xtype: 'combobox',
                                            margin:'10 10',
                                            ref: 'inheritorTypes',
                                            inputWidth: 180,
                                            store: Ext.create('Aenis.store.workflow.subject.inheritor.Types'),
                                            queryMode: 'local',
                                            emptyText: this.T("selects"),
                                            displayField: 'label',
                                            valueField: 'id',
                                            editable: false,
                                            forceSelection: true,
                                            submitValue: false,
                                            listeners: { 'expand': function(self) { self.clearValue(); } }
                                        },
                                        {
                                            xtype: 'filefield',
                                            name: 'file_inheritor_types',
                                            ref: 'objectRealtyTypesDocument',
                                            fieldLabel: this.T('attach_file'),
                                            labelWidth: 40,
                                            buttonText: this.T('select'),
                                            iconCls: 'icon-browse'
                                        }
                                    ]
                                },
                                {
                                    xtype:'fieldset',
                                    title: this.T('targeted_land'),
                                    frame: true,
                                    ref: 'objectRealtyParcelTypesPanel',
                                    layout:{
                                        type:'hbox'
                                    },
                                    items:[
                                        {
                                            xtype: 'combobox',
                                            margin:'10 10',
                                            ref: 'objectRealtyParcelTypes',
                                            store: Ext.create('Aenis.store.workflow.object.realty.parcel.Types'),
                                            queryMode: 'local',
                                            emptyText: this.T("selects"),
                                            displayField: 'label',
                                            valueField: 'id',
                                            editable: false,
                                            forceSelection: true,
                                            listeners: { 'expand': function(self) { self.clearValue(); } }
                                        },
                                        {
                                            xtype: 'filefield',
                                            name: 'file_object_realty_parcel',
                                            ref: 'objectRealtyTypesDocument',
                                            fieldLabel: this.T('attach_file'),
                                            labelWidth: 40,
                                            buttonText: this.T('select'),
                                            iconCls: 'icon-browse'
                                        }
                                    ]
                                },
                                {
                                    xtype:'fieldset',
                                    title: this.T('building_intended_use'),
                                    frame: true,
                                    ref: 'objectRealtyBuildingTypesPanel',
                                    layout:{
                                        type:'hbox'
                                    },
                                    items:[
                                        {
                                            xtype: 'combobox',
                                            margin:'10 10',
                                            ref: 'objectRealtyBuildingTypes',
                                            store: Ext.create('Aenis.store.workflow.object.realty.building.Types'),
                                            queryMode: 'local',
                                            emptyText: this.T("selects"),
                                            displayField: 'label',
                                            valueField: 'id',
                                            editable: false,
                                            forceSelection: true,
                                            listeners: { 'expand': function(self) { self.clearValue(); } }
                                        },
                                        {
                                            xtype: 'filefield',
                                            name: 'file_object_realty_building',
                                            ref: 'objectRealtyBuildingTypesDocument',
                                            fieldLabel: this.T('attach_file'),
                                            labelWidth: 100,
                                            labelAlign: 'right',
                                            margin: 10,
                                            anchor: '100%',
                                            buttonText: this.T('select'),
                                            iconCls: 'icon-browse'
                                        }
                                    ]
                                },
                                {
                                    xtype:'fieldcontainer',
                                    frame:true,
                                    border: false,
                                    layout:{
                                        type:'hbox',
                                        align:'center'
                                    },
                                    items:[
                                        {
                                            xtype:'numberfield',
                                            ref: 'dutyValue',
                                            fieldLabel:this.T('duty'),
                                            margin: 5,
                                            readOnly: true
                                        },
                                        {
                                            xtype:'numberfield',
                                            ref: 'paymentNotaryValue',
                                            fieldLabel:this.T('payment_notary'),
                                            margin: 5,
                                            step: 100
                                        }
                                    ]
                                }
                            ]
                        },

                        {
                            xtype:'fieldset',
                            title: this.T('completeDocument'),
                            ref:'completeDocForm',
                            hidden: true,
                            flex: 1,
                            items: [
                                {
                                    xtype: 'fieldcontainer',
                                    border: true,
                                    layout:{
                                        type: 'hbox',
                                        align: 'center',
                                        pack: 'center'
                                    },
                                    flex:1,
                                    margin:'15 0',
                                    items:[
                                        {
                                            xtype: 'displayfield',
                                            ref:'paidDutyValue',
                                            fieldLabel: this.T('duty'),
                                            style:'font-weight:bold',
                                            margin:'0 10'
                                        },
                                        {
                                            xtype: 'displayfield',
                                            ref:'paidPaymentNotaryValue',
                                            fieldLabel: this.T('payment_notary'),
                                            style:'font-weight:bold'
                                        },
                                        {
                                            xtype:'button',
                                            ref:'resetPayment',
                                            iconCls:'icon-reset',
                                            tooltip: this.T('reset')
                                        }
                                    ]
                                },
                                {
                                    xtype: 'filefield',
                                    name: 'file_warrant',
                                    ref: 'fileWarrant',
                                    fieldLabel: this.T('attach_file'),
                                    labelWidth: 100,
                                    labelAlign: 'right',
                                    margin: 5,
                                    msgTarget: 'side',
                                    allowBlank: false,
                                    anchor: '100%',
                                    buttonText: this.T('select'),
                                    iconCls: 'icon-browse'
                                }
                            ]
                        }
                    ]
                }

            ],
            buttons: [
                {
                    text: this.T('print'),
                    ref: 'printAction',
                    iconCls: 'icon-print'
                },
                '->',
                {
                    xtype:'button',
                    ref:'payAction',
                    iconCls:'icon-pay',
                    margin: 5,
                    text: this.T('pay')
                },
                {
                    text: this.T('approve'),
                    ref: 'approveAction',
                    iconCls: 'icon-ok',
                    hidden: true
                },
                {
                    text: this.T('close'),
                    action: 'cancel',
                    iconCls: 'icon-cancel'
                }
            ]
        });
        this.callParent(arguments);
    }
});