Ext.require([
    'Ext.form.Panel',
    'Ext.layout.container.Border',
    'Ext.form.FieldContainer',
    'Ext.form.field.Hidden',
    'Ext.form.field.Checkbox',
    'Aenis.view.workflow.template.components.Grid',
    'Aenis.view.workflow.template.components.Editor'
]);

Ext.define('Aenis.view.workflow.template.Manage', {
	extend: 'Ext.container.Container',
	alias: 'widget.workflowTemplateManage',
	
	layout: {
        type: 'border'
    },
    
	mixins: [
        'Locale.hy_AM.Common',
        'Locale.hy_AM.workflow.template.Manage',
        'BestSoft.mixin.Localized',
        'BestSoft.mixin.ShowConditionalElements'
    ],

    initComponent: function() {
        Ext.apply(this, {
            tabConfig: {
                title: this.T("tabTitle")
            },
            items: [
                {
                    split: true,
                    collapsible: true,
                    region: 'west',
                    width: '60%',
                    minWidth: 400,
                    autoScroll: true,
                    xtype: 'container',
                    layout: {
                        type: 'vbox',
                        align: 'stretch'
                    },
                    items: [
                        {
                            title: this.T('doc_type'),
                            bodyStyle: 'padding:4px',
                            margin: '0 0 10px 0',
                            xtype: 'panel',
                            layout: {
                                type: 'hbox',
                                align: 'center'
                            },
                            items: [
                                {
                                    xtype: 'textfield',
                                    ref: 'docTypeField',
                                    flex: 1,
                                    submitValue: false,
                                    readOnly: true
                                },
                                {
                                    xtype: 'button',
                                    text: this.T("select"),
                                    iconCls: 'icon-browse',
                                    ref: 'docTypeSelectAction',
                                    margin: '0 0 0 2px'
                                }
                            ]
                        },
                        {
                            title: this.T('manage_form_title'),
                            xtype: 'form',
                            ref: 'detailsForm',
                            disabled: true,
                            flex: 1,
                            bodyStyle: 'padding:10px 30px',
                            fieldDefaults: {
                                labelAlign: 'top',
                                anchor: '100%',
                                margin: '8px 0'
                            },
                            layout: {
                                type: 'vbox',
                                align: 'stretch'
                            },

                            defaultType: 'textfield',

                            messages: {
                                createSuccess: this.T("msg_create_success"),
                                updateSuccess: this.T("msg_update_success")
                            },

                            items: [
                                {
                                    xtype: 'fieldcontainer',
                                    layout: {
                                        type: 'hbox',
                                        align: 'stretch'
                                    },
                                    items: [
                                        {
                                            xtype: 'textfield',
                                            labelAlign: 'right',
                                            fieldLabel: this.T('title'),
                                            name: 'title',
                                            flex: 1,
                                            margin: '0 0 8px 0',
                                            allowBlank: false
                                        },
                                        {
                                            xtype: 'checkbox',
                                            boxLabel: this.T('is_common_template'),
                                            name: 'is_common_template',
                                            margin: '0 9px 8px 20px',
                                            inputValue: true,
                                            resourceRequiredToShow: {
                                                resource: 'template.add_common_template'
                                            },
                                            checked: false
                                        }
                                    ]
                                },
                                {
                                    xtype: 'workflow.template.Editor',
                                    ref: 'templateContentEditor',
                                    editorName: 'content',
                                    previewMode: true,
                                    flex: 1,
                                    fieldLabel: this.T('content')
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
                        }
                    ]
                },
                {
                    xtype: 'workflowTemplatesGrid',
                    ref: 'templatesGrid',
                    disabled: true,
                    region: 'center',
                    collapsible: false,
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
