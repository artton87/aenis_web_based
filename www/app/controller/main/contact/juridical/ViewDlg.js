Ext.define("Aenis.controller.main.contact.juridical.ViewDlg", {
    extend: 'Ext.app.Controller',
    requires: [
        'Aenis.view.main.contact.juridical.ViewDlg'
    ],

    mixins: [
        'Locale.hy_AM.Common',
        'Locale.hy_AM.main.contact.juridical.ViewDlg',
        'BestSoft.mixin.Localized'
    ],


    /**
     * Shows dialog and returns created instance of
     * dialog so caller can listen to dialog events.
     * @param {Object} params    {Aenis.model.main.contact.Natural} model
     * @return {Aenis.view.main.contact.Natural}
     */
    showDialog: function(params) {
        this.oDlg = this.createMainView();

        this.addComponentRefs(this.oDlg);
        this.oDlg.params = params || {};
        this.oDlg.control({

            '[action=cancel]': {
                click:this.onclickCloseBtn
            },
            '.': {
                beforeclose: function() {
                    delete this.oDlg;
                    return true;
                },
                afterrender:{fn:this.afterRenderViewContactDialog,single:true}
            }
        }, null, this);
        this.oDlg.show();
        return this.oDlg;
    },

    afterRenderViewContactDialog: function(){
        console.log("entered");
        console.log(this.oDlg.params.params);

        Ext.suspendLayouts();

        var model = this.oDlg.params.params;
        var cfg = this.getDataView().dataConfig;
        var panel = this.getDataContent();
        var item;

        var data = model.serviceData[0];
        for(var key in data)
        {
            if(data.hasOwnProperty(key))
            {
                cfg.items[0].text = data[key];
                item = Ext.ComponentManager.create(cfg);
                panel.add(item);
            }
        }

        Ext.resumeLayouts(true);
    },

    onclickCloseBtn: function() {
        this.oDlg.close();
    }
});


