Ext.define('Aenis.controller.main.profile.ModuleList', {
    extend: 'Ext.app.Controller',
	
	stores: [
		'main.profile.ModuleList'
	],

    requires: [
        'Aenis.view.main.profile.ModuleList'
    ],

    init: function() {
        var me = this;
        me.control({
            'mainProfileModuleList [ref=moduleContainer] button': {
                'click': function(oBtn) {
                    me.setCurrentNotarialOfficeAndLoadModule(oBtn.data.module, oBtn.data.id);
                }
            }
        });
    },

    onLaunch: function(app) {
        Ext.state.Manager.clear('currentModule');
        Ext.state.Manager.clear('currentModuleId');
        app.oViewPort.loadToolbox();
        var oView = this.createMainView();
        this.addComponentRefs(oView);
        oView.control({
            '[ref=moduleContainer]': {
                'beforerender': this.onBeforeRenderModuleContainer
            },
            '[ref=notarialOfficesCombo]': {
                'beforerender': this.onBeforeRenderNotarialOfficesCombo
            },
            '.': {
                afterrender: this.onAfterRenderView
            }
        }, null, this);
        app.loadView(oView);
    },

    onAfterRenderView: function(/*oView*/) {
        console.log("after render");
        var me = this;
        Ext.Ajax.request({
            url: 'main/profile/check_session.php',
            callback: function(options, success, response){
                if(me.application.handleAjaxResponse(response, true))
                {
                    var oPane = me.getUserFullNameInfoPane();
                    Ext.apply(oPane.serverData, Ext.JSON.decode(response.responseText));
                    if(oPane.serverData.user_full_name != '')
                    {
                        oPane.update(Ext.String.format(
                            oPane.formatString, Ext.String.htmlEncode(oPane.serverData.user_full_name)
                        ));
                    }
                }
            }
        });
    },

    onBeforeRenderModuleContainer: function() {
        console.log('onBeforerender');
        var me = this,
            notarialOfficesCount = me.getNotarialOfficesCombo().getStore().getTotalCount(),
            oContainer = me.getModuleContainer(),
            store = Ext.getStore('main.profile.ModuleList');
        console.log(notarialOfficesCount);
        store.load(function(records) {
            if(1 == records.length && 1 == notarialOfficesCount)
            {
                console.log("aaaa");
                me.setCurrentNotarialOfficeAndLoadModule(records[0].data.module, records[0].data.id);
                return;
            }
            oContainer.removeAll(true);
            for(var i=0; i<records.length; ++i)
            {
                var record = records[i];
                oContainer.add(Ext.ComponentManager.create({
                    xtype: 'button',
                    data: record.data,
                    text: Ext.String.format(oContainer.formatString, record.data.title, record.data.description),
                    iconCls: 'large-appicon-'+record.data.module,
                    textAlign: 'left',
                    scale: 'large',
                    margin: 6
                }));
            }
        });
    },

    onBeforeRenderNotarialOfficesCombo: function(combo) {
        var oStore = combo.getStore();
        oStore.on('load', this.notarialOfficesStoreLoad, this);
    },

    notarialOfficesStoreLoad: function(store) {
        var notarialOfficesCount = this.getNotarialOfficesCombo().getStore().getTotalCount();
        if(notarialOfficesCount>0)
        {
            this.getNotarialOfficesCombo().setValue(store.getAt(0).getId());
            if(notarialOfficesCount>1)
                this.getNotarialOfficesCombo().show();
        }
    },

    setCurrentNotarialOfficeAndLoadModule: function(module, moduleId) {
        var me = this,
            selectedOfficeId = this.getNotarialOfficesCombo().getValue();
        Ext.Ajax.request({
            url: 'workflow/notarial_office/session_set_current_office.php',
            params: {
                office_id: selectedOfficeId
            },
            callback: function(options, success, response){
                if(me.application.handleAjaxResponse(response))
                {
                    var obj = Ext.JSON.decode(response.responseText);
                    var oPane = me.getUserFullNameInfoPane();
                    oPane.serverData.notarial_office_name = obj.notarial_office_name;
                    console.log(oPane.serverData);
                    me.application.loadModule(module, moduleId, oPane.serverData);
                }
            }
        });
    }
});
