/**
 * Adds hidden file field for model.
 * Model should at least have fields 'file_id' and 'file_name'.
 */
Ext.define('BestSoft.mixin.ModelFileField', {

    /**
     * Resets fields for file selection
     */
    resetFileSelection: function() {
        this.set({
            file_id: 0,
            file_name: ''
        });
    },


    /**
     * Returns file field
     * @return {Ext.form.field.File}
     */
    getFileField: function() {
        return this.fileField;
    },


    /**
     * Creates and appends file field for selecting file for this model in the DOM.
     * @param {Ext.Component} containerEl    The element, to which newly create field will be appended as child
     */
    createHiddenFileField: function(containerEl) {
        var me = this;
        if(!me.fileField)
        {
            me.fileField = Ext.ComponentManager.create({
                xtype: 'filefield',
                //name: me.get('hash')+"["+me.get('doc_type_id')+"]",
                listeners: {
                    change: function() {
                        var selectedFileName = me.fileField.getValue();
                        /*    model.fileField.destroy();
                         delete model.fileField;
                         model.fileField = null;
                         */
                        var posBS = selectedFileName.lastIndexOf('/');
                        var posFW = selectedFileName.lastIndexOf('\\');
                        var pos = posBS > posFW ? posBS : posFW;
                        selectedFileName = selectedFileName.substr(pos+1);
                        me.set({
                            file_id: 0,
                            file_name: selectedFileName
                        });
                    }
                },
                hidden: true
            });
            containerEl.add(me.fileField);
            me.updateHiddenFileFieldName();
        }
        return me.fileField;
    },


    /**
     * Updates name of hidden file field element
     */
    updateHiddenFileFieldName: function() {
        if(this.fileField)
        {
            this.fileField.fileInputEl.set({
                name: this.get('hash')+"["+this.get('doc_type_id')+"]"
            });
        }
    },


    /**
     * Destroys hidden file field
     */
    destroyHiddenFileField: function() {
        if(this.fileField)
        {
            this.fileField.destroy();
            delete this.fileField;
            this.fileField = null;
        }
    },


    /**
     * Shows file open dialog by generating click event on hidden file field
     */
    pickFile: function() {
        var evt = document.createEvent("MouseEvents");
        evt.initEvent("click", true, false);
        this.fileField.fileInputEl.dom.dispatchEvent(evt);
    }
});
