Ext.require([
    'BestSoft.grid.Panel',
    'Ext.form.Panel',
    'Ext.ux.grid.FiltersFeature',
    'Ext.layout.container.Border',
    'Aenis.store.main.nao.Types'
]);

Ext.define('Aenis.view.main.nao.type.Manage', {
	extend: 'Ext.container.Container',
	alias: 'widget.mainNaoTypeManage',
	
	layout: {
        type: 'border'
    },
    
	mixins: [
        'Locale.hy_AM.Common',
        'Locale.hy_AM.main.nao.type.Manage',
        'BestSoft.mixin.Localized'
    ],

    initComponent: function() {
        Ext.apply(this, {
            tabConfig: {
                title: this.T("types")
            },
            items: [
                {
                    split: true,
                    collapsible: true,
                    title: this.T('manage_form_title'),
                    xtype: 'form',
                    ref: 'detailsForm',
                    region: 'west',
                    width: '25%',
                    minWidth: 270,
                    autoScroll: true,
                    bodyStyle: 'padding:10px 30px',
                    fieldDefaults: {
                        labelAlign: 'top',
                        anchor: '100%',
                        margin: '10px 0'
                    },

                    defaultType: 'textfield',

                    messages: {
                        createSuccess: this.T("msg_create_success"),
                        updateSuccess: this.T("msg_update_success")
                    },

                    items: [
                        {
                            fieldLabel: this.T('label'),
                            name: 'label',
                            allowBlank: false
                        }
                    ],

                    bbar: [
                        '->',
                        {
                            xtype: 'bsbtnReset'
                        },
                        ' ',
                        {
                            xtype: 'bsbtnAdd',
                            ref: 'addAction',
                            formBind: true
                        },
                        ' ',
                        {
                            xtype: 'bsbtnSave',
                            ref: 'editAction',
                            disabled: true
                        },
                        '->'
                    ]
                },
                {
                    xtype: 'bsgrid',
                    ref: 'typesGrid',
                    title: this.T('types'),
                    region: 'center',
                    collapsible: false,
                    features: [
                        {
                            ftype: 'filters',
                            encode: false,
                            local: true
                        }
                    ],
                    store: Ext.create('Aenis.store.main.nao.Types'),

                    bbar: [
                        {
                            xtype: 'bsbtnDelete',
                            ref: 'deleteAction',
                            disabled: true
                        },
                        '->'
                    ],

                    columns: [
                        {
                            text: this.T('id'),
                            dataIndex: 'id',
                            filterable: true
                        },
                        {
                            text: this.T('label'),
                            flex: 1,
                            dataIndex: 'label',
                            filterable: true
                        }
                    ]
                }
            ]
        });
    	this.callParent(arguments);
    }
});
