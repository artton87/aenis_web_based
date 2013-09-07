Ext.require([
    'BestSoft.grid.Panel',
    'Ext.selection.CellModel',
    'Ext.grid.plugin.CellEditing',
    'Aenis.store.main.YesNo',
    'Aenis.store.workflow.transaction.Properties',
    'Ext.form.field.Date'
]);

Ext.define('Aenis.view.workflow.transaction.components.PropertiesPanel', {
    extend: 'BestSoft.grid.Panel',
    alias: 'widget.workflowTransactionPropertiesPanel',

    mixins: [
        'Locale.hy_AM.Common',
        'Locale.hy_AM.workflow.transaction.components.PropertiesPanel',
        'BestSoft.mixin.Localized'
    ],


    /**
     * Binds the given store to the underlying property types combobox component
     * @param {Ext.data.Store} store
     */
    setPropertyTypesStore: function(store) {
        var oCombo = this.getPropertyTypesCombo();
        oCombo.bindStore(store);
        this.resetStore();
    },


    /**
     * Returns store bound to underlying property types combobox component
     * @return {Ext.data.Store}
     */
    getPropertyTypesStore: function() {
        return this.getPropertyTypesCombo().getStore();
    },

    /**
     * Resets property types store to its default state, i.e. without set values
     */
    resetStore: function() {
        var store = this.getPropertyTypesStore();
        if(store)
        {
            var oStore = this.getStore();
            oStore.removeAll();
            store.each(function(record) {
                if(record.get('is_required'))
                {
                    this.addPropertyByType(record);
                }
            }, this);
            oStore.commitChanges();
        }
    },

    /**
     * Returns first record, which value is required but not set by user.
     * Returns null, if there all records are valid.
     * @return {Aenis.model.workflow.transaction.Property}
     */
    getFirstFailedRecord: function() {
        var propertyTypesStore = this.getPropertyTypesStore();
        var oPropertiesStore = this.getStore();
        var failedModel = null;
        oPropertiesStore.each(function(record) {
            var propertyTypeModel = propertyTypesStore.getById(parseInt(record.getId()));
            if(propertyTypeModel.get('is_required') && Ext.isEmpty(record.get('value')))
            {
                failedModel = record;
                return false;
            }
            return true;
        });
        return failedModel;
    },


    /**
     * Returns an array of objects, where each object is constructed by picking field from the each record of store.
     * @return {Object[]}    An array of objects, where each object contains fields extracted from store model
     */
    getRecords: function() {
        var data = [];
        this.getStore().each(function(model) {
            var val = model.get('value');
            if(model.get('type') == 'date' && Ext.isDate(val))
            {
                val = Ext.Date.format(val, 'Y-m-d');
            }
            var recordData = {
                id: model.getId(),
                tr_id: model.get('tr_id'),
                value: val
            };
            data.push(recordData);
        });
        return data;
    },


    /**
     * Sets value of the property of given type
     * @param {Number} propertyTypeId    Property type id
     * @param {Object} value    A value to set
     */
    setPropertyValue: function(propertyTypeId, value) {
        var model = this.getStore().getById(propertyTypeId);
        if(!model)
        {
            var propertyTypesStore = this.getPropertyTypesStore();
            var propertyTypeModel = propertyTypesStore.getById(propertyTypeId);
            if(!propertyTypeModel) //value of that property cannot be set via properties panel component
            {
                return;
            }
            model = this.addPropertyByType(propertyTypeModel);
        }

        if(model.get('type') == 'enum') //we should load possible values first
        {
            var possibleValuesStore = model.typeValues();
            possibleValuesStore.on('load', function(store) {
                model.set('value', value);
                model.commit();
            }, this, {single:true});
            if(!possibleValuesStore.isLoading() && !possibleValuesStore.isLoaded())
            {
                possibleValuesStore.load();
            }
        }
        else
        {
            model.set('value', value);
            model.commit();
        }
    },



    initComponent: function() {
        var yesNoStore = Ext.create('Aenis.store.main.YesNo');

        var expandCombo = function(combo) {
            combo.expand();
        };

        var store = Ext.create('Aenis.store.workflow.transaction.Properties');
        store.mon(store, {
            add: {fn: this.filterPropertyTypesStore, scope: this},
            remove: {fn: this.filterPropertyTypesStore, scope: this},
            load: {fn: this.filterPropertyTypesStore, scope: this}
        });

        var propertyValueEditors = {
            'string': Ext.create('Ext.grid.CellEditor', {
                field: Ext.ComponentManager.create({
                xtype: 'textfield',
                    lazyRender: true
                })
             }),

            'date': Ext.create('Ext.grid.CellEditor', {
                field: Ext.ComponentManager.create({
                    xtype: 'datefield',
                    format: Ext.util.Format.dateFormat,
                    lazyRender: true
                })
            }),

            'number': Ext.create('Ext.grid.CellEditor', {
                field: Ext.ComponentManager.create({
                    xtype: 'numberfield',
                    lazyRender: true
                })
            }),

            'enum': Ext.create('Ext.grid.CellEditor', {
                field: Ext.ComponentManager.create({
                    xtype: 'combobox',
                    selectOnTab: true,
                    queryMode: 'local',
                    editable: false,
                    valueField: 'id',
                    displayField: 'label',
                    lazyInit: false,
                    lazyRender: true,
                    forceSelection: true,
                    listeners: {
                        focus: expandCombo
                    },
                    listClass: 'x-combo-list-small'
                })
            }),

            'boolean': Ext.create('Ext.grid.CellEditor', {
                field: Ext.ComponentManager.create({
                    xtype: 'combobox',
                    selectOnTab: true,
                    queryMode: 'local',
                    editable: false,
                    store: yesNoStore,
                    valueField: 'id',
                    displayField: 'title',
                    lazyInit: false,
                    lazyRender: true,
                    forceSelection: true,
                    listeners: {
                        focus: expandCombo
                    },
                    listClass: 'x-combo-list-small'
                })
            })
        };

        this.elCache = {}; //element cache to speed-up getChildItemBySelector()
        Ext.applyIf(this, {
            title: this.T("properties"),
            plugins: [
                Ext.create('Ext.grid.plugin.CellEditing', {
                    pluginId: 'propertiesCellEditing',
                    clicksToEdit: 1
                })
            ],
            tools: [],
            dockedItems: [
                {
                    xtype: 'toolbar',
                    dock: 'top',
                    items: [
                        {
                            xtype: 'combobox',
                            labelWidth: 0,
                            itemId: 'propertyTypesCombo',
                            formExcluded: true,
                            width: 200,
                            queryMode: 'local',
                            editable: false,
                            valueField: 'property_type_id',
                            displayField: 'property_type_label',
                            disabled: true,
                            forceSelection: true
                        },
                        {
                            xtype: 'bsbtnAdd',
                            itemId: 'addPropertyByTypeAction',
                            disabled: true,
                            listeners: {
                                click: {fn: this.onAddPropertyByTypeAction, scope: this}
                            }
                        },
                        '->',
                        {
                            xtype: 'bsbtnDelete',
                            itemId: 'deletePropertyTypeAction',
                            listeners: {
                                click: {fn: this.onDeletePropertyType, scope: this}
                            },
                            disabled: true
                        }
                    ]
                }
            ],
            enableColumnHide: false,
            enableColumnMove: false,
            sortableColumns: false,
            store: store,
            columns: [
                {
                    header: this.T('property_name'),
                    dataIndex: 'label',
                    flex: 3
                },
                {
                    header: this.T('property_value'),
                    dataIndex: 'value',
                    flex: 2,
                    getEditor: function(record, defaultField) {
                        var type = record.get('type');
                        var editor = propertyValueEditors[type];
                        if(type == 'enum')
                        {
                            var possibleValuesStore = record.typeValues();
                            if(editor.field.getStore() != possibleValuesStore) //bind only if store should be changed
                            {
                                editor.field.bindStore(possibleValuesStore);
                            }
                            if(!possibleValuesStore.isLoading() && !possibleValuesStore.isLoaded())
                            {
                                //load only once, thanks to conditions above
                                possibleValuesStore.load();
                            }
                        }
                        return editor || defaultField;
                    },
                    renderer: function(v, metaData, record/*, rowIndex, colIndex, store, view*/) {
                        var type = record.get('type');
                        if(type == 'number')
                        {
                            return Ext.util.Format.number(v);
                        }
                        else if(type == 'boolean')
                        {
                            return yesNoStore.getById(v ? true : false).data.title;
                        }
                        else if(type == 'enum')
                        {
                            if(record.typeValues().isLoaded())
                            {
                                var model = record.typeValues().getById(parseInt(v));
                                if(model)
                                    return model.data.label;
                            }
                            return v;
                        }
                        else if(type == 'date')
                        {
                            return Ext.util.Format.date(v, Ext.util.Format.dateFormat);
                        }
                        return v;
                    }
                }
            ],
            selModel: {
                selType: 'cellmodel'
            }
        });
        this.mon(this, 'selectionchange', this.onSelectionChangeGrid, this);
        this.callParent(arguments);
    },


    getPropertyTypesCombo: function() {
        return this.getChildItemBySelector('#propertyTypesCombo');
    },

    getAddPropertyByTypeAction: function() {
        return this.getChildItemBySelector('#addPropertyByTypeAction');
    },

    getDeletePropertyTypeAction: function() {
        return this.getChildItemBySelector('#deletePropertyTypeAction');
    },

    getChildItemBySelector: function(selector) {
        if(!this.elCache[selector])
            this.elCache[selector] = this.down(selector);
        return this.elCache[selector];
    },


    filterPropertyTypesStore: function() {
        var propertyTypesStore = this.getPropertyTypesStore();
        propertyTypesStore.filterBy(
            function(record) {
                return (null == this.getById(record.getId()));
            },
            this.getStore()
        );

        var firstItem = propertyTypesStore.first();
        if(firstItem) //if after filtering there are items remaining, select the first one
        {
            this.getPropertyTypesCombo().select(firstItem);
            this.getPropertyTypesCombo().enable();
            this.getAddPropertyByTypeAction().enable();
        }
        else //if all items are filtered out, completely disable top bar with combobox
        {
            this.getPropertyTypesCombo().disable();
            this.getAddPropertyByTypeAction().disable();
        }
    },


    onSelectionChangeGrid: function(selection) {
        this.getDeletePropertyTypeAction().disable();
        if(selection.hasSelection())
        {
            var oCombo = this.getPropertyTypesCombo();
            var record = oCombo.getStore().getById(selection.getLastSelected().getId());
            if(!record.get('is_required'))
                this.getDeletePropertyTypeAction().enable();
        }
    },


    onAddPropertyByTypeAction: function() {
        var oCombo = this.getPropertyTypesCombo();
        var record = oCombo.getStore().getById(parseInt(oCombo.getValue()));
        if(record)
        {
            this.addPropertyByType(record);
        }
    },


    /**
     * Adds a new property type value setting row into properties panel store
     * @param {Aenis.model.workflow.transaction.type.property.Type} record    A property type record
     * @return {Aenis.model.workflow.transaction.Property}    An added record
     */
    addPropertyByType: function(record) {
        var added = this.getStore().add({
            id: record.getId(),
            label: record.get('property_type_label'),
            type: record.get('property_type')
        });
        return added[0];
    },


    onDeletePropertyType: function() {
        var selectionModel = this.getSelectionModel();
        if(selectionModel.hasSelection())
        {
            this.getStore().remove(selectionModel.getLastSelected());
        }
    }
});
