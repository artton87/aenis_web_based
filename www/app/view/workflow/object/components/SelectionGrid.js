Ext.define('Aenis.view.workflow.object.components.SelectionGrid', {
    extend: 'BestSoft.grid.Panel',
    alias: 'widget.workflowObjectSelectionGrid',

    requires: [
        'Ext.grid.feature.Grouping',
        'Ext.selection.CellModel',
        'Ext.form.field.File',
        'Aenis.store.workflow.object.Selection'
    ],

    mixins: [
        'Locale.hy_AM.Common',
        'Locale.hy_AM.workflow.object.components.SelectionGrid',
        'BestSoft.mixin.Localized'
    ],


    /**
     * @cfg {Object} params
     * Will be passed to all dialog controllers during showDialog() calls
     */
    params: {},


    /**
     * @cfg {Object} enableAttachments
     * If true, will enable file attach functionality, set to false to hide that functionality from user.
     */
    enableAttachments: true,


    /**
     * Returns true, if object selection grid contains no objects, false - otherwise
     * @return {Boolean}
     */
    isEmpty: function() {
        return (null == this.getStore().first());
    },


    /**
     * Returns true, if object selection grid contains invalid records, false - otherwise.
     * For example, record with selected document type, but without attached file is invalid.
     * @return {Boolean}
     */
    isValid: function() {
        var valid = true;
        this.getStore().each(function(record) {
            if(record.get('doc_type_id')>0 && record.get('file_name')=='')
            {
                valid = false;
                return false;
            }
            return true;
        });
        return valid;
    },

    /**
     * Collects all objects from this grid.
     * @return {Aenis.model.workflow.transaction.relationship.Object[]}
     */
    getObjectRecords: function() {
        if(this.enableAttachments)
        {
            var records = [];
            var groups = this.getStore().getGroups();
            for(var i=0; i<groups.length; ++i)
            {
                var fileData = {
                    existing_files: []
                };
                var group = groups[i];
                var record = group.children[0];
                for(var j=0; j<group.children.length; ++j)
                {
                    if(group.children[j].get('file_id') > 0)
                    {
                        fileData.existing_files.push({
                            doc_type_id: group.children[j].get('doc_type_id'),
                            file_id: group.children[j].get('file_id')
                        });
                    }
                }
                record.set('fileData', fileData);
                records.push(record.getData());
            }
            return records;
        }
        return this.getStore().getRecords(); //don't care about collecting file information
    },


    /**
     * Cleans content of all hidden file inputs.
     * Should be called, when form submission fails on order to clean displayed
     * file names, which are not backed by real file input element.
     */
    resetFileFields: function() {
        this.getStore().each(function(record) {
            if(0 == record.get('file_id') && '' != record.get('file_name'))
            {
                record.set('file_name', '');
                record.destroyHiddenFileField();
            }
        });
    },


    /**
     * Loads grid using data from given objects store
     * @param {Ext.data.Store} store    A store of Aenis.model.workflow.transaction.relationship.Object models
     */
    loadFromObjectsStore: function(store) {
        var gridStore = this.getStore();
        store.each(function(objectModel) {
            var documentStore = objectModel.documents();

            var model, models = new Array(documentStore.getCount());
            for(var i=0; i<models.length; ++i)
            {
                model = Ext.create('Aenis.model.workflow.transaction.relationship.Object');
                model.fromObject(objectModel);

                var docModel = documentStore.getAt(i);
                model.set({
                    doc_type_id: docModel.get('doc_type_id'),
                    doc_type_label: docModel.get('doc_type_label')
                });

                var fileModel = docModel.files().first();
                if(fileModel)
                {
                    model.set({
                        file_id: fileModel.getId(),
                        file_name: fileModel.get('file_name')
                    });
                }

                models[i] = model;
            }

            if(0 === models.length)
            {
                model = Ext.create('Aenis.model.workflow.transaction.relationship.Object');
                model.fromObject(objectModel);
                models.push(model);
            }

            gridStore.add(models);
        }, this);
    },


    /**
     * Checks, whenever the given model is already present in the grid
     * @param {Aenis.model.workflow.transaction.relationship.Object} model
     * @return {boolean}
     */
    objectExists: function(model) {
        return (this.getStore().findBy(model.compareWith, model) >= 0);
    },


    initComponent: function() {
        var me = this;

        me.addEvents(
            /**
             * @event beforeRemoveSelection
             * Fires before any selection is removed from grid. A handler can return false to cancel the remove.
             * @param {Aenis.view.workflow.object.components.SelectionGrid} grid    A grid element
             * @param {Aenis.model.workflow.object.Selection[]} records    A records which are going to be removed.
             */
            'beforeRemoveSelection',

            /**
             * @event beforeVehicleObjectRequested
             * Fires before a vehicle is added/updated in the grid.
             * A handler can provide custom vehicle selection behaviour by
             *     - creating a new instance of Aenis.model.workflow.transaction.relationship.Object model,
             *     - adding it to grid store if mode='add',
             *     - editing selected item if mode='edit'
             *     - returning FALSE from handler
             * @param {Aenis.view.workflow.object.components.SelectionGrid} grid    A grid element
             * @param {String} mode    A string 'add' or 'edit.
             * @param {String} [record]    Valid only for 'edit' mode. A record which needs to be edited.
             */
            'beforeVehicleObjectRequested',

            /**
             * @event beforeRealtyObjectRequested
             * Fires before a realty is added/updated in the grid.
             * A handler can provide custom realty selection behaviour by
             *     - creating a new instance of Aenis.model.workflow.transaction.relationship.Object model,
             *     - adding it to grid store if mode='add',
             *     - editing selected item if mode='edit'
             *     - returning FALSE from handler
             * @param {Aenis.view.workflow.object.components.SelectionGrid} grid    A grid element
             * @param {String} mode    A string 'add' or 'edit.
             * @param {String} [record]    Valid only for 'edit' mode. A record which needs to be edited.
             */
            'beforeRealtyObjectRequested',

            /**
             * @event beforeStockObjectRequested
             * Fires before a stock is added/updated in the grid.
             * A handler can provide custom stock selection behaviour by
             *     - creating a new instance of Aenis.model.workflow.transaction.relationship.Object model,
             *     - adding it to grid store if mode='add',
             *     - editing selected item if mode='edit'
             *     - returning FALSE from handler
             * @param {Aenis.view.workflow.object.components.SelectionGrid} grid    A grid element
             * @param {String} mode    A string 'add' or 'edit.
             * @param {String} [record]    Valid only for 'edit' mode. A record which needs to be edited.
             */
            'beforeStockObjectRequested',

            /**
             * @event beforeShareObjectRequested
             * Fires before a share is added/updated in the grid.
             * A handler can provide custom share selection behaviour by
             *     - creating a new instance of Aenis.model.workflow.transaction.relationship.Object model,
             *     - adding it to grid store if mode='add',
             *     - editing selected item if mode='edit'
             *     - returning FALSE from handler
             * @param {Aenis.view.workflow.object.components.SelectionGrid} grid    A grid element
             * @param {String} mode    A string 'add' or 'edit.
             * @param {String} [record]    Valid only for 'edit' mode. A record which needs to be edited.
             */
            'beforeShareObjectRequested',

            /**
             * @event beforeOtherObjectRequested
             * Fires before a 'other' object is added/updated in the grid.
             * A handler can provide custom 'other' object selection behaviour by
             *     - creating a new instance of Aenis.model.workflow.transaction.relationship.Object model,
             *     - adding it to grid store if mode='add',
             *     - editing selected item if mode='edit'
             *     - returning FALSE from handler
             * @param {Aenis.view.workflow.object.components.SelectionGrid} grid    A grid element
             * @param {String} mode    A string 'add' or 'edit.
             * @param {String} [record]    Valid only for 'edit' mode. A record which needs to be edited.
             */
            'beforeOtherObjectRequested',

            /**
             * @event validateSelection
             * Fires after object is selected, but just before is added/updated in the grid.
             * A handler can stop adding/editing by returning FALSE.
             * Note. This event is not called if object selection behaviour
             * is overridden via listening to beforeXXXRequested events
             * @param {Aenis.view.workflow.object.components.SelectionGrid} grid    A grid element
             * @param {String} mode    A string 'add' or 'edit.
             * @param {String} newRecord    A record which needs to be validated.
             * @param {String} [oldRecord]    Valid only for 'edit' mode. A record which has been edited.
             */
            'validateSelection'
        );

        me._refs = {};

        me._refs['delete'] = Ext.ComponentManager.create({
            xtype: 'button',
            text: me.T("delete"),
            iconCls: 'icon-delete',
            listeners: {
                click: {fn: this.onDeleteObject, scope: me}
            },
            disabled: true
        });

        var editBtn;
        if(me.enableAttachments)
        {
            me._refs['edit'] = Ext.ComponentManager.create({
                xtype: 'menuitem',
                disabled: true,
                text: this.T("edit_object"),
                iconCls: 'icon-edit',
                listeners: {
                    click: {fn: this.onEditObject, scope: me}
                }
            });
            me._refs['edit_document_type'] = Ext.ComponentManager.create({
                xtype: 'menuitem',
                disabled: true,
                text: this.T("edit_document_type"),
                listeners: {
                    click: {fn: this.onEditDocumentType, scope: me}
                }
            });
            me._refs['edit_attachment'] = Ext.ComponentManager.create({
                xtype: 'menuitem',
                disabled: true,
                text: this.T("edit_attachment"),
                iconCls: 'icon-attach',
                listeners: {
                    click: {fn: this.onEditAttachment, scope: me}
                }
            });
            editBtn = Ext.ComponentManager.create({
                xtype: 'bsbtnEdit',
                menu: {
                    items: [
                        me._refs['edit'],
                        me._refs['edit_document_type'],
                        me._refs['edit_attachment']
                    ]
                }
            });
        }
        else
        {
            editBtn = me._refs['edit'] = Ext.ComponentManager.create({
                xtype: 'bsbtnEdit',
                listeners: {
                    click: {fn: this.onEditObject, scope: me}
                },
                disabled: true
            });
        }

        me._refs['select'] = Ext.ComponentManager.create({
            xtype: 'button',
            text: this.T("select"),
            iconCls: 'icon-browse',
            menu: {
                items: [
                    {
                        text: this.T("vehicle"),
                        object_type: 'vehicle',
                        iconCls:'icon-vehicle',
                        listeners: {
                            click: {fn: this.onObjectRequested, scope: me}
                        }
                    },
                    {
                        text: this.T("realty"),
                        object_type: 'realty',
                        iconCls: 'icon-realty',
                        listeners: {
                            click: {fn: this.onObjectRequested, scope: me}
                        }
                    },
                    {
                        text: this.T("share"),
                        object_type: 'share',
                        iconCls: 'icon-share',
                        listeners: {
                            click: {fn: this.onObjectRequested, scope: me}
                        }
                    },
                    {
                        text: this.T("stock"),
                        object_type: 'stock',
                        iconCls: 'icon-stock',
                        listeners: {
                            click: {fn: this.onObjectRequested, scope: me}
                        }
                    },
                    {
                        text: this.T("other"),
                        object_type: 'other',
                        listeners: {
                            click: {fn: this.onObjectRequested, scope: me}
                        }
                    }
                ]
            }
        });

        if(me.enableAttachments) //create attach button
        {
            me._refs['attach'] = Ext.ComponentManager.create({
                xtype: 'button',
                action: 'attach',
                text: me.T('attach_files'),
                iconCls: 'icon-attach',
                listeners: {
                    click: {fn: this.onChooseObjectAttachment, scope: me}
                },
                disabled:true
            });
        }


        var cfg = {
            collapsible: true,
            hideHeaders: false,
            //width: 500,
            //minHeight: 300,
            autoLoadStore: false,
            enableColumnMove: false,
            resizable: true,
            resizeHandles: 's e se',
            tools:[],
            selModel: {
                selType: me.enableAttachments ? 'cellmodel' : 'rowmodel'
            },
            features: (function() {
                return me.enableAttachments ? [
                    {
                        ftype: 'grouping',
                        enableGroupingMenu: false,
                        groupHeaderTpl: Ext.create('Ext.XTemplate', [
                            "{[values.children[0].getSelectionName()]}"
                        ])
                    }
                ] : []
            })(),
            columns: (function() {
                var columns = [
                    {
                        text: me.T("objectName"),
                        tooltip: me.T("objectName"),
                        flex: 1,
                        groupable: false,
                        hideable: !me.enableAttachments,
                        hidden: me.enableAttachments,
                        dataIndex: 'objectName'
                    }
                ];
                if(me.enableAttachments)
                {
                    columns.push(
                        {
                            text: me.T('doc_type_label'),
                            tooltip: me.T('doc_type_label'),
                            flex: 2,
                            groupable: false,
                            hideable: false,
                            dataIndex: 'doc_type_label',
                            renderer: function(value, metaData, record) {
                                if(record.get('doc_type_id') <= 0)
                                {
                                    return me.T("press_here_to_attach_files");
                                }
                                return value;
                            }
                        },
                        {
                            text: me.T('file_name'),
                            tooltip: me.T('file_name'),
                            flex: 1,
                            groupable: false,
                            hideable: false,
                            dataIndex: 'file_name',
                            renderer: function(value, metaData, record) {
                                if(record.get('file_name') == "")
                                {
                                    return "...";
                                }
                                return value;
                            }
                        }
                    );
                }
                return columns;
            })(),
            bbar: (function() {
                var buttons = [];
                if(me.enableAttachments)
                {
                    buttons.push(me._refs['attach']);
                }
                buttons.push(
                    '->',
                    me._refs['delete'],
                    ' ',
                    editBtn,
                    ' ',
                    me._refs['select']
                );
                return buttons;
            })()
        };
        if(!this.store)
        {
            cfg.store = Ext.create('Aenis.store.workflow.object.Selection');
        }
        Ext.applyIf(this, cfg);
        this.callParent(arguments);
        this.mon(this, 'selectionchange', this.onSelectionChange, this);
        this.mon(this, 'celldblclick', this.onDoubleClickCell, this);
    },


    onDoubleClickCell: function(oView, td, cellIndex, record) {
        var fileId = record.get('file_id');
        if(fileId>0)
        {
            var oController = Aenis.application.loadController('workflow.file.ViewDlg');
            oController.showDialog(fileId, record.get('file_name'));
        }
    },

    onSelectionChange: function(model, selected) {
        if(selected.length > 0)
        {
            this._refs['edit'].enable();
            this._refs['delete'].enable();
            if(this.enableAttachments)
            {
                this._refs['attach'].enable();
                this._refs['edit_document_type'].enable();
                this._refs['edit_attachment'].enable();
            }
        }
        else
        {
            this._refs['edit'].disable();
            this._refs['delete'].disable();
            if(this.enableAttachments)
            {
                this._refs['attach'].disable();
                this._refs['edit_document_type'].disable();
                this._refs['edit_attachment'].disable();
            }
        }
    },


    onChooseObjectAttachment: function() {
        var selection = this.getSelectionModel();
        if(selection.hasSelection())
        {
            var selectedModel = selection.getLastSelected();
            var bAddNewModel = (selectedModel.get('file_name') != "");

            var oController = Aenis.application.loadController('workflow.document.type.SelectDlg');
            oController.showDialog().on({
                itemSelected: function(docTypeModel) {
                    var newDocTypeId = docTypeModel.getId(),
                        //newDocTypeLabel = docTypeModel.get('label');
                        newDocTypeLabel = docTypeModel.getTitle();
                    var groupRecords = this.getRecordsWithSameHash(selectedModel);
                    for(var i=groupRecords.length-1; i>=0; --i)
                    {
                        var id = groupRecords[i].get('doc_type_id');
                        if(id == newDocTypeId && (bAddNewModel || id != selectedModel.get('doc_type_id')))
                        {
                            Ext.Msg.alert(
                                Aenis.application.title,
                                Ext.String.format(
                                    this.T("document_type_already_exists"),
                                    newDocTypeLabel
                                )
                            );
                            return false;
                        }
                    }

                    var model = selectedModel;
                    if(bAddNewModel)
                    {
                        model = Ext.create('Aenis.model.workflow.transaction.relationship.Object', selectedModel.getData());
                    }

                    model.set({
                        doc_type_label: newDocTypeLabel,
                        doc_type_id: newDocTypeId,
                        file_id: 0,
                        file_name: ''
                    });

                    model.createHiddenFileField(this);
                    if(bAddNewModel)
                    {
                        this.getStore().add(model);
                    }

                    model.pickFile();
                    return true;
                },
                scope: this
            });
        }
    },


    /**
     * Returns all records, which have the hash same as the hash of the given record
     * @param {Aenis.model.workflow.transaction.relationship.Object} record
     * @return {Aenis.model.workflow.transaction.relationship.Object[]}
     */
    getRecordsWithSameHash: function(record) {
        var hash = record.get('hash');
        return this.getStore().getGroups(hash).children;
    },


    onDeleteObject: function() {
        var selection = this.getSelectionModel().getSelection();
        if(selection.length>0)
        {
            if(this.fireEvent('beforeRemoveSelection', this, selection))
            {
                var oStore = this.getStore();
                if(this.enableAttachments)
                {
                    //check if the last item in group is about to be removed
                    var hash = selection[0].get('hash');
                    var isLastRecordInGroup = (1 == oStore.getGroups(hash).children.length);
                    if(isLastRecordInGroup && (selection[0].get('doc_type_id') > 0 || selection[0].get('file_name') != ''))
                    {
                        selection[0].resetDocTypeSelection();
                        selection[0].resetFileSelection();
                    }
                    else
                    {
                        oStore.remove(selection[0]);

                    }
                }
                else
                {
                    oStore.remove(selection);
                }
            }
        }
    },


    onEditDocumentType: function() {
        var selection = this.getSelectionModel();
        if(selection.hasSelection())
        {
            var me = this,
                record = selection.getLastSelected(),
                oController = Aenis.application.loadController('workflow.document.type.SelectDlg');
            oController.showDialog().on({
                itemSelected: function(docTypeModel) {
                    var newDocTypeId = docTypeModel.getId(),
                        //newDocTypeLabel = docTypeModel.get('label');
                        newDocTypeLabel = docTypeModel.getTitle();
                    var groupRecords = me.getRecordsWithSameHash(record);
                    for(var i=groupRecords.length-1; i>=0; --i)
                    {
                        var id = groupRecords[i].get('doc_type_id');
                        if(id == newDocTypeId && id != record.get('doc_type_id'))
                        {
                            Ext.Msg.alert(
                                Aenis.application.title,
                                Ext.String.format(
                                    me.T("document_type_already_exists"),
                                    newDocTypeLabel
                                )
                            );
                            return false;
                        }
                    }
                    record.set({
                        doc_type_label: newDocTypeLabel,
                        doc_type_id: newDocTypeId
                    });
                    record.updateHiddenFileFieldName();
                    return true;
                },
                scope: this
            });
        }
    },

    onEditAttachment: function() {
        var selection = this.getSelectionModel();
        if(selection.hasSelection())
        {
            var record = selection.getLastSelected();
            if(record.get('doc_type_id') > 0)
            {
                record.createHiddenFileField(this);
                record.pickFile();
            }
            else
            {
                this.onChooseObjectAttachment();
            }
        }
    },


    onEditObject: function() {
        var selection = this.getSelectionModel();
        if(selection.hasSelection())
        {
            var record = selection.getLastSelected();
            if(this.fireEvent(
                'before' + Ext.String.capitalize(record.get('objectType')) + 'ObjectRequested',
                this, 'edit', record
            )) {
                this.selectObject(record.get('objectType'), 'edit', record);
            }
        }
    },


    onObjectRequested: function(oBtn) {
        if(this.fireEvent(
            'before' + Ext.String.capitalize(oBtn.object_type) + 'ObjectRequested',
            this, 'add'
        )) {
            this.selectObject(oBtn.object_type, 'add', null);
        }
    },


    selectObject: function(type, mode, record) {
        var fromFn, controllerName, me = this;
        if('vehicle' == type)
        {
            fromFn = 'fromVehicle';
            controllerName = 'main.vehicle.SelectDlg';
        }
        else if('realty' == type)
        {
            fromFn = 'fromRealty';
            controllerName = 'main.realty.SelectDlg';
        }
        else if('share' == type)
        {
            fromFn = 'fromShare';
            controllerName = 'main.share.SelectDlg';
        }
        else if('stock' == type)
        {
            fromFn = 'fromStock';
            controllerName = 'main.stock.SelectDlg';
        }
        else if('other' == type)
        {
            fromFn = 'fromData';
            controllerName = 'main.other.SelectDlg';
        }

        var oController = Aenis.application.loadController(controllerName);
        oController.showDialog(this.params).on({
            itemSelected: function(from) {
                var tmp = Ext.create('Aenis.model.workflow.transaction.relationship.Object');
                tmp[fromFn](from);

                if(!this.fireEvent('validateSelection', me, mode, tmp, record))
                {
                    return false;
                }

                if('edit' == mode)
                {
                    if(me.enableAttachments) //we have to change objects for each record in group
                    {
                        var hash = record.get('hash');
                        this.getStore().each(function(item) {
                            if(item.get('hash') === hash)
                            {
                                item[fromFn](from);
                            }
                        });
                        this.getStore().group('hash'); //regroup store
                    }
                    else //without attachments, record hash values are distinct, so just set the value
                    {
                        record[fromFn](from);
                    }
                }
                else if('add' == mode)
                {
                    this.getStore().add(tmp);
                }
                return true;
            },
            scope: this
        });
    }
});
