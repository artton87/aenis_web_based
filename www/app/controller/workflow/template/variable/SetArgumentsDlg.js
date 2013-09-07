Ext.define('Aenis.controller.workflow.template.variable.SetArgumentsDlg', {
	extend: 'Ext.app.Controller',
    requires: [
        'Aenis.view.workflow.template.variable.SetArgumentsDlg'
    ],

    /**
     * Shows dialog for setting values for template variable arguments and returns
     * created instance of dialog so caller can listen to dialog events.
     * @param {Object} params    {Aenis.model.workflow.template.Variable} variable - template variable model
     * @return {Aenis.view.workflow.template.variable.SetArgumentsDlg}
     */
    showDialog: function(params) {
        this.oDlg = this.createMainView();
        this.oDlg.params = params;
        this.oDlg.addEvents(
            /**
             * @event itemSelected
             * Fired when user fills in parameters and presses OK button.
             * Return FALSE from event handler to prevent dialog from closing.
             */
            'itemSelected',

            /**
             * @event cancelled
             * Fired when user closes the dialog without selecting an item
             */
            'cancelled'
        );
        this.addComponentRefs(this.oDlg);
        this.oDlg.returnValue = null;
        this.oDlg.control({
            '[ref=argumentsGrid]': {
                'edit': this.onEditArgumentsGrid
            },
            '[ref=acceptAction]': {
                click: this.onAccept
            },
            '[action=cancel]': {
                click: {fn: this.oDlg.close, scope: this.oDlg}
            },
            '.': {
                beforeclose: this.onBeforeClose
            }
        }, null, this);

        this.oDlg.show();

        var parameterStore = this.oDlg.params.variable.parameters();
        parameterStore.each(function(record) {
            record.data.value = null;
        });
        this.getArgumentsGrid().reconfigure(parameterStore);
        this.getArgumentsGrid().loadStore();

        return this.oDlg;
    },

    onBeforeClose: function(oDlg) {
        if(oDlg.returnValue)
        {
            if(!oDlg.fireEvent('itemSelected', oDlg.returnValue))
            {
                oDlg.returnValue = null;
                return false;
            }
        }
        else
        {
            oDlg.fireEvent('cancelled');
        }
        delete this.oDlg;
        return true;
    },

    onEditArgumentsGrid: function(editor, e) {
        e.record.commit();
        this.getAcceptAction().enable();
        var parameterStore = this.oDlg.params.variable.parameters();
        parameterStore.each(function(record) {
            if(record.get('is_required') && Ext.isEmpty(record.get('value')))
            {
                this.getAcceptAction().disable();
                return false; //abort iteration through store records
            }
            return true;
        }, this);
    },

    onAccept: function() {
        this.oDlg.returnValue = true;
        this.oDlg.close();
    }
});
