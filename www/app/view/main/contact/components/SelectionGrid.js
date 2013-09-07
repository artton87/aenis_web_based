Ext.define('Aenis.view.main.contact.components.SelectionGrid', {
    extend: 'BestSoft.grid.Panel',
    alias: 'widget.mainContactSelectionGrid',

    requires: [
        'Ext.grid.feature.Grouping',
        'Ext.selection.CellModel',
        'Ext.form.field.File',
        'Aenis.store.main.contact.Selection'
    ],

    mixins: [
        'Locale.hy_AM.Common',
        'Locale.hy_AM.main.contact.components.SelectionGrid',
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
     * @cfg {Object} enableAgentSelection
     * If true, will enable functionality for selecting multiple agents for each selected contact.
     * Set to false to hide that functionality from user.
     */
    enableAgentSelection: true,


    /**
     * @cfg {Object} selectSingleRow
     * If true, will enable select contact only one time
     */
    selectSingleRow: false,

    /**
     * Returns true, if contact selection grid contains no contacts, false - otherwise
     * @return {Boolean}
     */
    isEmpty: function() {
        return (null == this.getStore().first());
    },

    /**
     * Returns true, if contact selection grid contains invalid records, false - otherwise.
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
     * Collects all subjects from this grid.
     * @return {Aenis.model.main.contact.Selection[]}
     */
    getSubjectRecords: function() {
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
     * Loads grid using data from given subjects store
     * @param {Ext.data.Store} store    A store of Aenis.model.workflow.transaction.relationship.party.Subject models
     */
    loadFromSubjectsStore: function(store) {
        var gridStore = this.getStore();
        store.each(function(subjectModel) {
            var documentStore = subjectModel.documents();

            var model, models = new Array(documentStore.getCount());
            for(var i=0; i<models.length; ++i)
            {
                model = Ext.create('Aenis.model.main.contact.Selection');
                model.fromSubject(subjectModel);

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
                model = Ext.create('Aenis.model.main.contact.Selection');
                model.fromSubject(subjectModel);
                models.push(model);
            }

            gridStore.add(models);
        }, this);

        if(true === this.selectSingleRow)
        {
            this._refs['select'].disable();
        }
        else
        {
            this._refs['select'].enable();
        }
    },


    /**
     * Checks, whenever the given model is already present in the grid
     * @param {Aenis.model.main.contact.Selection} model
     * @return {boolean}
     */
    contactExists: function(model) {
        return (this.getStore().findBy(model.compareWith, model) >= 0);
    },


    initComponent: function() {
        var me = this;

        me.addEvents(
            /**
             * @event beforeRemoveSelection
             * Fires before any selection is removed from grid. A handler can return false to cancel the remove.
             * @param {Aenis.view.main.contact.components.SelectionGrid} grid    A grid element
             * @param {Aenis.model.main.contact.Selection[]} records    A records which are going to be removed.
             */
            'beforeRemoveSelection',


            /**
             * @event afterRemoveSelection
             * Fires before any selection is removed from grid. A handler can return false to cancel the remove.
             * @param {Aenis.view.main.contact.components.SelectionGrid} grid    A grid element
             * @param {Aenis.model.main.contact.Selection[]} records    A records which are going to be removed.
             */
            'afterRemoveSelection',

            /**
             * @event beforeNaturalContactRequested
             * Fires before a natural contact is added/updated in the grid.
             * A handler can provide custom contact selection behaviour by
             *     - creating a new instance of Aenis.model.main.contact.Selection model,
             *     - adding it to grid store if mode='add',
             *     - editing selected item if mode='edit'
             *     - returning FALSE from handler
             * @param {Aenis.view.main.contact.components.SelectionGrid} grid    A grid element
             * @param {String} mode    A string 'add' or 'edit.
             * @param {Aenis.model.main.contact.Selection} [record]    Valid only for 'edit' mode. A record which needs to be edited.
             */
            'beforeNaturalContactRequested',

            /**
             * @event beforeJuridicalContactRequested
             * Fires before a juridical contact is added/updated in the grid.
             * A handler can provide custom contact selection behaviour by
             *     - creating a new instance of Aenis.model.main.contact.Selection model,
             *     - adding it to grid store if mode='add',
             *     - editing selected item if mode='edit'
             *     - returning FALSE from handler
             * @param {Aenis.view.main.contact.components.SelectionGrid} grid    A grid element
             * @param {String} mode    A string 'add' or 'edit.
             * @param {Aenis.model.main.contact.Selection} [record]    Valid only for 'edit' mode. A record which needs to be edited.
             */
            'beforeJuridicalContactRequested',


            /**
             * @event afterContactRequested
             * Fires after a  contact is added/updated in the grid.
             * A handler can provide custom contact selection behaviour by
             *     - creating a new instance of Aenis.model.main.contact.Selection model,
             *     - adding it to grid store if mode='add',
             *     - editing selected item if mode='edit'
             *     - returning FALSE from handler
             * @param {Aenis.view.main.contact.components.SelectionGrid} grid    A grid element
             * @param {String} mode    A string 'add' or 'edit.
             * @param {Aenis.model.main.contact.Selection} [record]    Valid only for 'edit' mode. A record which needs to be edited.
             */
            'afterContactRequested',

            /**
             * @event validateSelection
             * Fires after contact is selected, but just before is added/updated in the grid.
             * A handler can stop adding/editing by returning FALSE.
             * Note. This event is not called if contact selection behaviour
             * is overridden via listening to beforeXXXRequested events
             * @param {Aenis.view.main.contact.components.SelectionGrid} grid    A grid element
             * @param {String} mode    A string 'add' or 'edit.
             * @param {Aenis.model.main.contact.Selection} newRecord    A record which needs to be validated.
             * @param {Aenis.model.main.contact.Selection} [oldRecord]    Valid only for 'edit' mode. A record which has been edited.
             */
            'validateSelection'
        );

        me._refs = {};

        me._refs['delete'] = Ext.ComponentManager.create({
            xtype: 'button',
            text: me.T("delete"),
            iconCls: 'icon-delete',
            listeners: {
                click: {fn: this.onDeleteContact, scope: me}
            },
            disabled: true
        });

        var editBtn;
        if(me.enableAttachments)
        {
            me._refs['edit'] = Ext.ComponentManager.create({
                xtype: 'menuitem',
                disabled: true,
                text: this.T("edit_contact"),
                iconCls: 'icon-edit',
                listeners: {
                    click: {fn: this.onEditContact, scope: me}
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
                    click: {fn: this.onEditContact, scope: me}
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
                        text: this.T("natural"),
                        contact_type: 'natural',
                        iconCls: 'icon-contact_np',
                        listeners: {
                            click: {fn: this.onContactRequested, scope: me}
                        }
                    },
                    {
                        text: this.T("juridical"),
                        contact_type: 'juridical',
                        iconCls: 'icon-contact_jp',
                        listeners: {
                            click: {fn: this.onContactRequested, scope: me}
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
                    click: {fn: this.onChooseContactAttachment, scope: me}
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
                        text: me.T("contactName"),
                        tooltip: me.T("contactName"),
                        flex: 1,
                        groupable: false,
                        hideable: !me.enableAttachments,
                        hidden: me.enableAttachments,
                        dataIndex: 'contactName'
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
            cfg.store = Ext.create('Aenis.store.main.contact.Selection');
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


    onChooseContactAttachment: function() {
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
                        model = Ext.create('Aenis.model.main.contact.Selection', selectedModel.getData());
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
     * @param {Aenis.model.main.contact.Selection} record
     * @return {Aenis.model.main.contact.Selection[]}
     */
    getRecordsWithSameHash: function(record) {
        var hash = record.get('hash');
        return this.getStore().getGroups(hash).children;
    },


    onDeleteContact: function() {
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
                    //this.fireEvent('afterRemoveSelection', this, selection);
                }
                else
                {
                    oStore.remove(selection);
                }
            }
            if(true === this.selectSingleRow)
            {
                this._refs['select'].enable();
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
                this.onChooseContactAttachment();
            }
        }
    },


    onEditContact: function() {
        var selection = this.getSelectionModel();
        if(selection.hasSelection())
        {
            var record = selection.getLastSelected();
            if(this.fireEvent(
                'before' + Ext.String.capitalize(record.get('contactType')) + 'ContactRequested',
                this, 'edit', record
            )) {
                this.selectContact(record.get('contactType'), 'edit', record);
            }
        }
    },


    onContactRequested: function(oBtn) {
        if(this.fireEvent(
            'before' + Ext.String.capitalize(oBtn.contact_type) + 'ContactRequested',
            this, 'add'
        )) {
            if(true === this.selectSingleRow)
            {
                this._refs['select'].disable();
            }
            this.selectContact(oBtn.contact_type, 'add', null);
        }
    },


    selectContact: function(type, mode, record) {
        this.params.partTypeId = this.partyTypeId;//// change unexceptionable to party_type_code, this.partyTypeId is equal to 30
                                                  // which is inheritor, died person
        var fromFn, controllerName, me = this;
        if('natural' == type)
        {
            fromFn = 'fromNaturalContact';
            controllerName = 'main.contact.natural.SelectDlg';
        }
        else if('juridical' == type)
        {
            fromFn = 'fromJuridicalContact';
            controllerName = 'main.contact.juridical.SelectDlg';
        }

        var oController = Aenis.application.loadController(controllerName);
        oController.showDialog(this.params).on({
            itemSelected: function(from) {
                var tmp = Ext.create('Aenis.model.main.contact.Selection');
                tmp[fromFn](from);

                if(!this.fireEvent('validateSelection', me, mode, tmp, record))
                {
                    return false;
                }

                if('edit' == mode)
                {
                    if(me.enableAttachments) //we have to change contacts for each record in group
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
                    //this.fireEvent('afterContactRequested',this, 'add');
                    if(!me.fireEvent('afterContactRequested', this, 'add'))
                    {
                        return true;
                    }
                }

                return true;
            },
            scope: this
        });
    }
});
