Ext.define('Aenis.controller.workflow.template.PreviewDlg', {
	extend: 'Ext.app.Controller',
    requires: [
        'Aenis.view.workflow.template.PreviewDlg'
    ],

    /**
     * Shows dialog and returns created instance of
     * dialog so caller can listen to dialog events.
     * @param {Object} params    {String} html - html text to show
     *                           {Boolean} previewMode - If TRUE, will not do variable replacement on the server side
     * @return {Aenis.view.workflow.template.PreviewDlg}
     */
    showDialog: function(params) {
        this.oDlg = this.createMainView();
        this.addComponentRefs(this.oDlg);

        this.oDlg.params = params;
        this.oDlg.control({
            '[action=cancel]': {
                click: {fn: this.oDlg.close, scope: this.oDlg}
            },
            '.': {
                afterrender: this.loadIFrame,
                beforeclose: function() {
                    delete this.oDlg;
                    return true;
                }
            }
        }, null, this);
        this.oDlg.show();

        return this.oDlg;
    },


    loadIFrame: function() {
        var me = this;
        Ext.Ajax.request({
            url: 'workflow/template/render.php',
            method: 'POST',
            params: {
                init: 1,
                previewMode: this.oDlg.params.previewMode ? 1 : 0,
                html: this.oDlg.params.html
            },
            callback: function(options, success, response) {
                if(Aenis.application.handleAjaxResponse(response))
                {
                    var oResponse = Ext.JSON.decode(response.responseText);
                    if(oResponse.key)
                    {
                        me.getIFrame().load(BestSoft.config.server + 'workflow/template/render.php?key='+oResponse.key);
                    }
                }
            }
        });
    }
});
