Ext.require([
    'Ext.form.field.Date',
    'Ext.form.field.Radio',
    'Ext.form.field.Hidden',
    'Ext.form.Label'
]);

Ext.define('Aenis.view.main.vehicle.ViewDlg', {
    extend:'Ext.window.Window',

    alias: 'widget.mainVehicleViewDlg',

    modal: true,
    width:500,
    height:400,

    closeAction: 'destroy',

    layout:{
        type:'vbox',
        align:'stretch'
    },
    border:false,

    mixins: [
        'Locale.hy_AM.Common',
        'Locale.hy_AM.main.vehicle.ViewDlg',
        'BestSoft.mixin.Localized'
    ],

    initComponent: function(){

        Ext.apply(this, {
            title: this.T('data'),
            xtype:'container',
            ref:'dataView',
            autoScroll:true,

            items: [
                {
                    xtype:'form',
                    ref:'vehicleDataContent',
                    defaultType: 'displayfield',
                    defaults:{
                        labelWidth:170
                    },

                    items:[
                        {
                            fieldLabel:this.T("vin"),
                            name:'vin'
                        },
                        {
                            fieldLabel:this.T("number"),
                            name:'number'
                        },
                        {
                            fieldLabel:this.T("body_type"),
                            name:'body_type'
                        },
                        {
                            fieldLabel:this.T("body_number"),
                            name:'body_number'
                        },
                        {
                            fieldLabel:this.T("chassis_number"),
                            name:'chassis_number'
                        },
                        {
                            fieldLabel:this.T("color"),
                            name:'color'
                        },
                        {
                            fieldLabel:this.T("engine_number"),
                            name:'engine_number'
                        },
                        {
                            fieldLabel:this.T("engine_power"),
                            name:'engine_power'
                        },
                        {
                            fieldLabel:this.T("model"),
                            name:'model'
                        },
                        {
                            fieldLabel:this.T("model_year"),
                            name:'model_year'
                        },
                        {
                            fieldLabel:this.T("type"),
                            name:'type'
                        },
                        {
                            fieldLabel:this.T("owner"),
                            name:'owner'
                        },
                        {
                            xtype:'fieldset',
                            title:this.T("documents"),
                            ref:'documentsPanel',
                            flex:1,
                            border: false,
                            items:[]
                        }
                    ]
                }
            ],

            buttons: [
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