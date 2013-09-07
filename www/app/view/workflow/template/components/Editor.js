Ext.require([
    'Ext.form.field.ComboBox',
    'Aenis.model.workflow.Template',
    'Aenis.store.workflow.template.Variables'
]);

/**
 * A template editor component
 */
Ext.define('Aenis.view.workflow.template.components.Editor', {
    extend: 'Ext.panel.Panel',
    alias: 'widget.workflow.template.Editor',

    mixins: [
        'Locale.hy_AM.Common',
        'Locale.hy_AM.workflow.template.components.Editor',
        'BestSoft.mixin.Localized',
        'BestSoft.mixin.TinyMCEConfig'
    ],


    /**
     * @cfg {Boolean} hideSelectTemplateButton
     * If TRUE, hides button for template selection
     */
    hideSelectTemplateButton: false,


    /**
     * @cfg {Boolean} previewMode
     * If TRUE, content variables will not be substituted.
     * Defaults to FALSE.
     */
    previewMode: false,

    /**
     * @cfg {String|Number} documentType
     * Will be shown only variables defined for that document type.
     * Numeric values will be treated as document type ids.
     * Function setDocumentType() can be used to change document type at a run time.
     */
    documentType: 0,

    /**
     * @cfg {Number} transactionTypeId
     * Will be shown only variables defined for that transaction type.
     * Function setTransactionTypeId() can be used to change transaction type at a run time.
     */
    transactionTypeId: 0,

    /**
     * @cfg {Object} variableSubstituteConfig
     * Should be set to make offline variable substitution work.
     * In order to set, listen to afterrender event and call setVariableSubstituteConfig() from event handler.
     */
    variableSubstituteConfig: {
        /**
         * Is used as caller (this) object while calling fn() function.
         * If not set, defaults to this editor.
         */
        scope: null,

        /**
         * Function which is called to return variable content. Usually should be provided by host
         * component.
         * The following parameters will be passed to that function:
         *  {Aenis.model.workflow.template.Variable} model    Variable model
         */
        fn: Ext.emptyFn
    },


    /**
     * Loads template from remote server
     * @access public
     * @param {Number} templateId    Template ID
     */
    loadTemplate: function(templateId) {
        Aenis.model.workflow.Template.load(templateId, {
            params: {detailed: 1},
            scope: this,
            success: function(record/*, operation*/) {
                this.setValue(record.get('content'));
            }
        });
    },

    /**
     * Due to tinyMCE implementation, should be called before submitting this field.
     * NOTE. There is no need to call it before calling getValue(), because it will be called automatically.
     * @access public
     */
    triggerSave: function() {
        tinymce.triggerSave();
    },

    /**
     * Loads template variables buttons for the given document type
     * @access public
     * @param {Number|String} docType    Document type code or id. If numeric, will be treated as type id
     */
    setDocumentType: function(docType) {
        this.documentType = docType;
        this.loadVariables();
    },

    /**
     * Loads template variables buttons for the given transaction type
     * @access public
     * @param {Number} transactionTypeId    Transaction type id
     */
    setTransactionTypeId: function(transactionTypeId) {
        this.transactionTypeId = transactionTypeId || 0;
        this.loadVariables();
    },

    /**
     * Sets reference to object which contains variable substitution parameters: fn and scope.
     * @access public
     * @param {Object} variableSubstituteConfig
     */
    setVariableSubstituteConfig: function(variableSubstituteConfig) {
        this.variableSubstituteConfig = variableSubstituteConfig;
    },


    /**
     * Parses content and replaces all found variables inside.
     * No requests are being made to server.
     * @access public
     * @return {String}    Resulting html code
     */
    parse: function(content, data) {
        var me = this,
            variablesStore = me.getVariablesCombo().getStore(),
            foundVarInfo = {};

        var el = document.createElement('div');
        el.setAttribute('style', 'height:0;width:0;display:none;');
        el.innerHTML = content;
        document.body.appendChild(el);

        //collect variables from content
        var elements = Ext.dom.Query.select('span[data-id]', el, 'select', false);
        Ext.Array.each(elements, function(element) {
            var varId = element.getAttribute('data-id');
            var varArgs = element.getAttribute('data-args');
            var varKey = varId+'#'+(Ext.isEmpty(varArgs) ? '' : varArgs);
            if(!foundVarInfo.hasOwnProperty(varKey)) //first-time occurrence, get variable value
            {
                foundVarInfo[varKey] = null;

                var html = null,
                    model = variablesStore.getById(parseInt(varId));
                if(model)
                {
                    if(model.get('is_dynamic')) //ask host component for value if variable is dynamic
                    {
                        if(Ext.isEmpty(varArgs))
                        {
                            varArgs = {};
                        }
                        else
                        {
                            varArgs = Ext.JSON.decode(Ext.String.htmlDecode(varArgs));
                        }

                        var value = me.variableSubstituteConfig.fn.apply(me.variableSubstituteConfig.scope, [me, model, varArgs, data]);
                        if(null !== value && typeof value != "undefined") //if host component returns something
                        {
                            html = value;
                        }
                    }
                    else //just use content if variable is not dynamic
                    {
                        html = model.get('content');
                    }

                }
                foundVarInfo[varKey] = html;
            }

            if(null !== foundVarInfo[varKey])
            {
                Ext.DomHelper.insertHtml('beforeBegin', element, html);
                element.parentNode.removeChild(element);
            }
            else
            {
                element.setAttribute("style", "color:red");
            }
        });

        //pass generated html to tinyMCE parser to let him clean the HTML from errors
        var parser = new tinymce.html.DomParser({validate: true}, tinymce.activeEditor.schema);
        var result = parser.parse(el.innerHTML);
        result = new tinymce.html.Serializer().serialize(result);

        document.body.removeChild(el);
        return result;
    },


    /**
     * Returns the current data value of the field
     * @access public
     * @return {String} value    The field value
     */
    getValue: function() {
        this.triggerSave();
        return this.getEditor().getValue();
    },

    /**
     * Sets a data value into the field and runs the change detection and validation.
     * @access public
     * @param {String} value    The value to set
     * @return {Ext.form.field.Field} this
     */
    setValue: function(value) {
        return this.getEditor().setValue(value);
    },




    /**
     * Loads template variables from server using configured parameters
     * @access protected
     */
    loadVariables: function() {
        var params = {};

        if(this.transactionTypeId>0)
            params['tr_type_id'] = this.transactionTypeId;

        if(Ext.isNumeric(this.documentType))
            params['doc_type_id'] = this.documentType;
        else
            params['doc_type_code'] = this.documentType;

        var oCombo = this.getVariablesCombo(),
            oStore = oCombo.getStore(),
            me = this;
        oStore.load({
            params: params,
            scope: this,
            callback: function(records, operation, success) {
                if(success && oStore.getTotalCount()>0)
                {
                    oCombo.select(oStore.getAt(0));
                    me.getVariablesCombo().enable();
                    me.getVariableInsertBtn().enable();
                }
                me.fireEvent('load', me);
            }
        });
    },

    /**
     * @access protected
     */
    initComponent: function() {
        this.addEvents(
            /**
             * @event beforeVariableInsert
             * Fired before variable is inserted into editor.
             * Return FALSE from handler to block variable from being inserted.
             * @param {Aenis.view.workflow.template.components.Editor} editor    An editor
             * @param {Aenis.model.workflow.template.Variable} variableModel    A variable model
             */
            'beforeVariableInsert',

            /**
             * @event load
             * Fired when editor is loaded
             * @param {Aenis.view.workflow.template.components.Editor} editor    An editor
             */
            'load'
        );

        //defaults to this editor
        this.variableSubstituteConfig.scope = this;

        Ext.applyIf(this, {
            layout: {
                type: 'fit'
            },
            bodyStyle: 'border-width:0 0 1px 0 !important;',
            items: [
                {
                    xtype: 'tinymce_textarea',
                    itemId: 'editor',
                    noWysiwyg: false,
                    tinyMCEConfig: this.tinyMCEConfig,
                    name: this.editorName,
                    margin: 0
                }
            ],
            bbar: [
                {
                    xtype: 'combobox',
                    itemId: 'variablesCombo',
                    flex: 1,
                    formExcluded: true,
                    store: Ext.create('Aenis.store.workflow.template.Variables'),
                    queryMode: 'local',
                    editable: false,
                    disabled: true,
                    valueField: 'id',
                    displayField: 'title',
                    listeners: {
                        render: {fn: this.onRenderVariablesCombo, scope: this, single: true}
                    }
                },
                {
                    itemId: 'variableInsertBtn',
                    iconCls: 'icon-insert',
                    disabled: true,
                    text: this.T("insert_into_text"),
                    listeners: {
                        click: {fn: this.templateVariableInsertHandler, scope: this}
                    }
                },
                '->',
                {
                    iconCls: 'icon-browse',
                    text: this.T("select_template"),
                    hidden: this.hideSelectTemplateButton,
                    listeners: {
                        click: {fn: this.onSelectTemplateBtn, scope: this}
                    }
                },
                ' ',
                {
                    iconCls: 'icon-print-preview',
                    text: this.T("print_preview"),
                    listeners: {
                        click: {fn: this.openPreview, scope: this}
                    }
                }
            ]
        });
        this.callParent(arguments);
    },


    onSelectTemplateBtn: function() {
        var me = this, oController = Aenis.application.loadController('workflow.template.SelectDlg');
        oController.showDialog({
            documentType: this.documentType,
            transactionTypeId: this.transactionTypeId
        }).on({
            itemSelected: function(model) {
                me.loadTemplate(model.getId());
            }
        });
    },


    openPreview: function() {
        var oController = Aenis.application.loadController('workflow.template.PreviewDlg');
        oController.showDialog({
            html: this.parse(this.getValue(), {}),
            previewMode: this.previewMode
        });
    },

    templateVariableInsertHandler: function() {
        var oEditor = this.getEditor(),
            oVariablesCombo = this.getVariablesCombo(),
            variableId = oVariablesCombo.getValue(),
            variableModel = oVariablesCombo.getStore().getById(variableId);
        if(!this.fireEvent('beforeVariableInsert', this, variableModel))
        {
            return; //this variable should not be inserted
        }
        if(variableModel.get('is_dynamic'))
        {
            var title = variableModel.get('title');
            if(variableModel.get('has_parameters'))
            {
                var oController = Aenis.application.loadController('workflow.template.variable.SetArgumentsDlg');
                oController.showDialog({variable: variableModel}).on({
                    itemSelected: function() {
                        var args = {}, titleParts = [];
                        var parameterStore = variableModel.parameters();
                        parameterStore.each(function(record) {
                            var paramValue = record.get('value');
                            if(!Ext.isEmpty(paramValue))
                            {
                                var valueModel = record.acceptableValues().getById(paramValue);
                                titleParts.push(valueModel ? valueModel.get('display_name') : paramValue);
                                args[record.get('name')] = paramValue;
                            }
                        });
                        args = Ext.String.htmlEncode(Ext.JSON.encode(args));
                        title += ' ('+titleParts.join(',')+')';
                        oEditor.insertText(
                            '&nbsp;<span class="template_variable" ' +
                                'data-id="'+variableModel.getId()+'" ' +
                                'data-args="'+args+'" ' +
                                '>'+title+'</span>&nbsp;'
                        );
                    },
                    scope: this
                });
            }
            else
            {
                oEditor.insertText(
                    '&nbsp;<span class="template_variable" data-id="'+variableModel.getId()+
                        '">'+title+'</span>&nbsp;'
                );
            }
        }
        else
        {
            var value = this.variableSubstituteConfig.fn.apply(this.variableSubstituteConfig.scope, [this, variableModel]);
            if(Ext.isEmpty(value, false))
                value = variableModel.get('content');
            oEditor.insertText(value);
        }
    },

    onRenderVariablesCombo: function(oCombo) {
        this.loadVariables();
    },

    getEditor: function() {
        return this.down('#editor');
    },

    getBottomBar: function() {
        return this.getDockedItems('*[dock="bottom"]')[0];
    },

    getVariableInsertBtn: function() {
        return this.getBottomBar().down('#variableInsertBtn');
    },

    getVariablesCombo: function() {
        return this.getBottomBar().down('#variablesCombo');
    }
});
