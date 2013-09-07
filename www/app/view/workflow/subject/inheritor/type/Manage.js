Ext.require([
    'BestSoft.grid.Panel',
    'Ext.form.Panel',
    'Ext.ux.grid.FiltersFeature',
    'Ext.layout.container.Border',
    'Aenis.store.workflow.subject.inheritor.Types'
]);

Ext.define('Aenis.view.workflow.subject.inheritor.type.Manage', {
    extend: 'Ext.container.Container',
    alias: 'widget.workflowSubjectInheritorTypeManage',

    layout: {
        type: 'border'
    },

    mixins: [
        'Locale.hy_AM.Common',
        'Locale.hy_AM.workflow.subject.inheritor.type.Manage',
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
                            afterLabelTextTpl: BestSoft.required,
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
                    store: Ext.create('Aenis.store.workflow.subject.inheritor.Types'),
                    bbar: [
                        {
                            xtype: 'bsbtnDelete',
                            ref: 'deleteAction',
                            disabled: true
                        },
                        '->'
                    ],
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
                            text: this.T('label'),
                            flex: 1,
                            dataIndex: 'label',
                            hideable: false,
                            filterable: true
                        }
                    ]
                }
            ]
        });
        this.callParent(arguments);
    }
});
