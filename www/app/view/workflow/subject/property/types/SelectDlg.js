Ext.require([
    'BestSoft.grid.Panel',
    'Ext.form.Label',
    'Aenis.view.main.contact.components.SelectionGrid'
]);

Ext.define('Aenis.view.workflow.subject.property.types.SelectDlg', {
    extend:'Ext.window.Window',

    alias: 'widget.workflowSubjectPropertyTypesSelectDlg',

    modal: true,
    closeAction: 'destroy',

    layout:{
        type: 'vbox',
        align: 'stretch'
    },

    mixins: [
        'Locale.hy_AM.Common',
        'Locale.hy_AM.workflow.subject.property.types.SelectDlg',
        'BestSoft.mixin.Localized'
    ],

    initComponent: function(){
        Ext.apply(this, {
            title: this.T("manage_form_title"),
            width: 800,
            height: 500,

            items: [
                {
                    xtype:'container',
                    flex: 1,
                    layout:{
                        type: 'hbox',
                        align: 'stretch'
                    },
                    ref: 'partyInheritanceRelationPanel',
                    partyComponentConfig: {
                        xtype: 'mainContactSelectionGrid',
                        margin: '1 2',
                        enableAttachments: false,
                        resizeHandles: 'w e',
                        flex:1//,
                        //selType: 'checkboxmodel',
                        /*selModel: {
                            mode: "MULTI"
                        }*/
                    },
                    items:[]
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