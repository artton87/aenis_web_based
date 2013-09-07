Ext.define('BestSoft.grid.Panel', {
    extend: 'Ext.grid.Panel',
    alias: 'widget.bsgrid',

    mixins: [
        'Locale.hy_AM.Common',
        'BestSoft.mixin.Localized'
    ],

    /**
     * Load attached store if it is not currently loading
     * @param {Object} [params]    Optional. Parameters, which will be passed to store load() method
     */
    loadStore: function(params) {
        params = params || {};

        var oStore = this.getStore();
        if(oStore && !oStore.isLoading())
        {
            if(this.down('pagingtoolbar'))
            {
                params.params = params.params || {};
                params.params.init = 1;
                oStore.load(params);
            }
            else
                oStore.load(params);
        }
    },


    /**
     * Removes all items from panel store.
     * No requests will be sent to server.
     * Can be used to clean up memory occupied by store items.
     */
    freeStore: function() {
        var oStore = this.getStore();
        if(oStore) //clean up the store to free memory
        {
            oStore.suspendEvents();
            oStore.clearData();
            oStore.resumeEvents();
            oStore.fireEvent('refresh', oStore);
        }
    },


    /**
     * Remembers grid selection if any
     */
    rememberSelection: function() {
        this._selection = this.getSelectionModel().getSelection();
    },


    /**
     * Restores previously remembered grid selection if any
     */
    restoreSelection: function() {
        if(this._selection && this._selection.length>0)
        {
            this.getSelectionModel().deselectAll();
            this.getSelectionModel().select(this._selection);
            this._selection.length = 0;
        }
    },


    initComponent: function() {
        var me = this;
        var autoFreeStoreDefaults = false;
        if(Ext.isString(this.store)) //store is assigned via alias
        {
            autoFreeStoreDefaults = true;
        }
        Ext.applyIf(this, {
            columnLines: true,
            autoLoadStore: true,
            autoFreeStore: autoFreeStoreDefaults,
            viewConfig: {
                stripeRows: true
            },
            tools:[{
                type:'refresh',
                tooltip: me.T("reload"),
                handler: function(){
                    var oStore = me.getStore();
                    if(oStore)
                        oStore.reload();
                }
            }]
        });

        if(this.autoLoadStore)
        {
            this.on('afterrender', this.loadStore, this, {single: true});
        }
        /*if(this.autoFreeStore)
        {
            this.on('destroy', this.onDestroy, this);
        }*/
        this.callParent(arguments);
    },


    /**
     * Destroys the Component.
     */
    destroy: function() {
        if(this.autoFreeStore && !this.getStore().autoDestroy)
        {
            this.freeStore();
        }
        this.callParent(arguments)
    }
});
