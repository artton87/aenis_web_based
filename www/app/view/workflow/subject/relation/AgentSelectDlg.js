Ext.require([
    'BestSoft.grid.Panel',
    'Ext.form.Label',
    'Aenis.view.main.contact.components.SelectionGrid'
]);

Ext.define('Aenis.view.workflow.subject.relation.AgentSelectDlg', {
    extend:'Ext.window.Window',

    alias: 'widget.workflowSubjectRelationAgentSelectDlg',

    modal: true,
    closeAction: 'destroy',

    layout:{
        type: 'vbox',
        align: 'stretch'
    },

    mixins: [
        'Locale.hy_AM.Common',
        'Locale.hy_AM.workflow.subject.relation.AgentSelectDlg',
        'BestSoft.mixin.Localized'
    ],

    initComponent: function(){
        Ext.apply(this, {
            title: this.T("manage_form_title"),
            width: 600,
            height: 500,

            items: [
                {
                    xtype:'container',
                    flex: 1,
                    layout:'fit',
                    items:[
                        {
                            xtype: 'mainContactSelectionGrid',
                            margin: '1 2',
                            resizeHandles: 'w e',
                            ref: 'subjectRelations',
                            enableAttachments: false,
                            flex:1,
                            selType: 'checkboxmodel',
                            selModel: {
                                mode: "MULTI"
                            }
                        }
                    ]
                }
            ],
            dockedItems:[
                {
                    xtype: 'toolbar',
                    dock: 'top',
                    ref: 'partiesTopBar',

                    border: false,
                    items: [
                        '->',
                        {
                            xtype: 'combobox',
                            ref: 'subjectRelationTypes',
                            inputWidth: 180,
                            store: Ext.create('Aenis.store.workflow.subject.relation.Types'),
                            queryMode: 'local',
                            emptyText: this.T("relationship_types"),
                            displayField: 'label',
                            valueField: 'id',
                            editable: false,
                            forceSelection: true,
                            submitValue: false
                        },
                        '->'
                    ]
                }
            ],
            buttons: [
                {
                    xtype: 'bsbtnAdd',
                    ref:'addAction'
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