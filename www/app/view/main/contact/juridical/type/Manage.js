Ext.require([
    'BestSoft.grid.Panel',
    'Ext.form.Panel',
    'Ext.ux.grid.FiltersFeature',
    'Ext.layout.container.Border',
    'Aenis.store.main.contact.juridical.Types'
]);

Ext.define('Aenis.view.main.contact.juridical.type.Manage', {
	extend: 'Ext.container.Container',
	alias: 'widget.mainContactJuridicalTypeManage',
	
	layout: {
        type: 'border'
    },
    
	mixins: [
        'Locale.hy_AM.Common',
        'Locale.hy_AM.main.contact.juridical.type.Manage',
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
                            fieldLabel: this.T('name'),
                            name: 'name',
                            maxLength: 500,
                            afterLabelTextTpl: BestSoft.required,
                            allowBlank: false
                        },
                        {
                            fieldLabel: this.T('abbreviation'),
                            name: 'abbreviation',
                            maxLength: 50
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
                    store: Ext.create('Aenis.store.main.contact.juridical.Types'),
                    features: [
                        {
                            ftype: 'filters',
                            encode: false,
                            local: true
                        }
                    ],
                    columns: [
                        {
                            text: this.T('id'),
                            dataIndex: 'id',
                            hidden: true,
                            width: 70,
                            filterable: true
                        },
                        {
                            text: this.T('name'),
                            flex: 1,
                            dataIndex: 'name',
                            hideable: false,
                            filterable: true
                        },
                        {
                            text: this.T('abbreviation'),
                            width: 80,
                            dataIndex: 'abbreviation',
                            filterable: true
                        }
                    ],
                    bbar: [
                        {
                            xtype: 'bsbtnDelete',
                            ref: 'deleteAction',
                            disabled: true
                        },
                        '->'
                    ]
                }
            ]
        });
    	this.callParent(arguments);
    }
});
