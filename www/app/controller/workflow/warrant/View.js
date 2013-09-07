Ext.define('Aenis.controller.workflow.warrant.View', {
    extend: 'Ext.app.Controller',

    requires: [
        'Aenis.view.workflow.warrant.View'
    ],

    onLaunch: function(app) {
        app.loadMainViewTab(this, function(oView) {
            this.addComponentRefs(oView);
            oView.control({
                'textfield': {
                    //specialkey: this.onTextFieldSpecialKey
                },
                '[ref=contractsGrid]': {
                    selectionchange: this.onSelectChangeContractsGrid
                },
                '.': {
                    //afterrender: {fn: this.afterRenderTab, single:true}
                }
            }, null, this);

        });
    },

    onSelectChangeContractsGrid: function(){
        var selection = this.getContractsGrid().getSelectionModel().getSelection();
        if(selection.length > 0)
        {
            var selected = selection[0];

            var oForm = this.getMainFormTransactionTab();
            var oContent = this.getContentTab();

            oForm.removeAll(true);
            oContent.removeAll(true);
            Ext.suspendLayouts();

            //var tr_id = selected.getId();
            var relationshipsStore = selected.relationships();
            relationshipsStore.on('load', this.onRelationshipStoreLoad, this, {single: true});
            relationshipsStore.load();
            //var relModel = relationshipsStore.getProxy().getModel();
            /*
            partiesStore.load();
            var relModel  =  Ext.create('Aenis.model.workflow.Relationship');
            var partyStore = relModel.parties();
            partyStore.load();
            console.log(relationshipsStore.parties());
             */
        }

    },

    onRelationshipStoreLoad: function(store, records) {
        var partiesStore = records[0].parties();
        partiesStore.on('load', this.onPartiesStoreLoad, this, {single: true});
        partiesStore.load();

        var objectsStore = records[0].objects();
        var oForm = this.getMainFormTransactionTab();
        var cfg = oForm.objectConfig;
        var el = Ext.ComponentManager.create(cfg);
        var oObjectsGrid = el.down('#objectsGrid');
        oForm.add(el);
        oObjectsGrid.reconfigure(objectsStore);

        objectsStore.on('load', this.onObjectsStoreLoad, this, {single: true});
        objectsStore.load();
    },

    onPartiesStoreLoad: function(store,records){
        var oForm = this.getMainFormTransactionTab();
        var cfg = oForm.partyConfig;
        Ext.Array.each(records, function(record){
            var el = Ext.ComponentManager.create(cfg);
            var oPartiesGrid = el.down('#partiesGrid');
            oPartiesGrid.setTitle(record.get('party_type_label'));
            oForm.add(el);

            var subjects = record.subjects();
            oPartiesGrid.reconfigure(subjects);
        });
        Ext.resumeLayouts(true);
    },

    onObjectsStoreLoad: function(store,records){
        console.log('------------');
        console.log(store);
        console.log(records);
        console.log('------------');
    }
});
