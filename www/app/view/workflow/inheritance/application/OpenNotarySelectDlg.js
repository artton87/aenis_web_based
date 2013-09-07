Ext.require([
    'Ext.tab.Panel',
    'Ext.form.field.Hidden',
    'Ext.form.Label',
    'Ext.form.field.File'
]);

Ext.define('Aenis.view.workflow.inheritance.application.OpenNotarySelectDlg', {
    extend:'Ext.window.Window',

    alias: 'widget.workflowInheritanceApplicationOpenNotarySelectDlg',

    modal: true,
    closeAction: 'destroy',

    layout:{
        type: 'vbox',
        align: 'stretch'
    },

    mixins: [
        'Locale.hy_AM.Common',
        'Locale.hy_AM.workflow.inheritance.application.OpenNotarySelectDlg',
        'BestSoft.mixin.Localized'
    ],

    initComponent: function(){
        Ext.apply(this, {
            title: this.T("select_notary"),
            width: 600,
            height: 350,
            items: [
                {
                    xtype:'container',
                    layout:{
                        type:'vbox',
                        align:'stretch'
                    },
                    items:[

                        {
                            xtype: 'fieldset',
                            title: this.T('region'),
                            bodyStyle: 'padding:4px',
                            margin: '0 10px 10px 0',
                            flex: 1,
                            layout: {
                                type: 'hbox',
                                align: 'center'
                            },
                            items: [
                                {
                                    xtype: 'textfield',
                                    ref: 'regionField',
                                    flex: 1,
                                    submitValue: false,
                                    readOnly: true
                                },
                                {
                                    xtype: 'button',
                                    text: this.T("select"),
                                    iconCls: 'icon-browse',
                                    ref: 'regionSelectAction',
                                    margin: '0 0 0 2px'
                                }
                            ]
                        },
                        {
                            title: this.T('community'),
                            bodyStyle: 'padding:4px',
                            margin: '0 0 10px 0',
                            xtype: 'fieldset',
                            layout: {
                                type: 'hbox',
                                align: 'center'
                            },
                            items: [
                                {
                                    xtype: 'textfield',
                                    ref: 'communityField',
                                    flex: 1,
                                    submitValue: false,
                                    readOnly: true
                                },
                                {
                                    xtype: 'button',
                                    text: this.T("select"),
                                    iconCls: 'icon-browse',
                                    ref: 'communitySelectAction',
                                    margin: '0 0 0 2px',
                                    disabled: true
                                }
                            ]
                        },
                        {
                            xtype: 'textarea',
                            name: 'address_textfield',
                            margin: '5 5 5 10',
                            ref: 'testatorAddressField'
                        },
                        {
                            xtype: 'combobox',
                            ref: 'selectFiniteNotaryCombo',
                            hidden: true,
                            name: 'notary_user_id',
                            margin: '5 5',
                            fieldLabel: this.T('notary'),
                            labelAlign: 'right',
                            labelWidth: 65,
                            width: 300,
                            store: Ext.create('Aenis.store.main.user.Grid'),
                            queryMode: 'local',
                            editable: false,
                            valueField: 'id',
                            displayField: 'user_full_name',
                            forceSelection: true
                        }
                    ]


                }

            ],
            buttons: [
                {
                    text: this.T('select'),
                    ref: 'selectAction',
                    iconCls: 'icon-select'
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


