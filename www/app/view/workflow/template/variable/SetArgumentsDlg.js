Ext.require([
    'BestSoft.grid.Panel',
    'Ext.selection.CellModel',
    'Ext.grid.plugin.CellEditing'
]);

Ext.define('Aenis.view.workflow.template.variable.SetArgumentsDlg', {
	extend: 'Ext.window.Window',
	alias: 'widget.workflowTemplateVariableSetArgumentsDlg',

    closeAction: 'destroy',
    modal: true,
    layout: {
        type: 'fit'
    },
    minButtonWidth: 30,
    width: 480,
    height: 200,
    maximizable: true,

	mixins: [
        'Locale.hy_AM.Common',
        'Locale.hy_AM.workflow.template.variable.SetArgumentsDlg',
        'BestSoft.mixin.Localized'
    ],


    initComponent: function() {
        var me = this,
            valueEditor = Ext.create('Ext.grid.CellEditor', {
                field: Ext.ComponentManager.create({
                    xtype: 'combobox',
                    selectOnTab: true,
                    queryMode: 'local',
                    editable: false,
                    valueField: 'value',
                    displayField: 'display_name',
                    lazyInit: false,
                    lazyRender: true,
                    forceSelection: true,
                    listeners: {
                        focus: function(combo){
                            combo.expand();
                        }
                    },
                    listClass: 'x-combo-list-small'
                })
            });
        Ext.apply(me, {
            title: me.T('windowTitle'),
            items: [
                {
                    xtype: 'bsgrid',
                    ref: 'argumentsGrid',
                    autoFreeStore: false,
                    autoLoadStore: false,
                    plugins: [
                        Ext.create('Ext.grid.plugin.CellEditing', {
                            pluginId: 'argumentCellEditing',
                            clicksToEdit: 1
                        })
                    ],
                    flex: 1,
                    tools: [],
                    border: false,
                    enableColumnHide: false,
                    sortableColumns: false,
                    columns: [
                        {
                            header: this.T('parameter_name'),
                            dataIndex: 'display_name',
                            flex: 1
                        },
                        {
                            header: this.T('parameter_value'),
                            dataIndex: 'value',
                            flex: 2,
                            getEditor: function(record, defaultField) {
                                var acceptableValuesStore = record.acceptableValues();
                                if(valueEditor.field.getStore() != acceptableValuesStore) //bind only if store should be changed
                                {
                                    valueEditor.field.bindStore(acceptableValuesStore);
                                }
                                return valueEditor || defaultField;
                            },
                            renderer: function(v, metaData, record/*, rowIndex, colIndex, store, view*/) {
                                var model = record.acceptableValues().getById(v);
                                if(model)
                                    return model.get('display_name');
                                return v;
                            }
                        }
                    ],
                    selModel: {
                        selType: 'cellmodel'
                    }
                }
            ],
            buttons: [
                {
                    text: me.T('select'),
                    ref: 'acceptAction',
                    iconCls: 'icon-ok',
                    disabled: true
                },
                {
                    text: me.T('close'),
                    action: 'cancel',
                    iconCls: 'icon-cancel'
                }
            ]
        });
    	this.callParent(arguments);
    }
});
