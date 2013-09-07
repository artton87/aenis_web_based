Ext.define('BestSoft.tree.Panel', {
    extend: 'Ext.tree.Panel',
    requires: [
        'Ext.state.LocalStorageProvider'
    ],
    alias: 'widget.bstree',

    mixins: [
        'Locale.hy_AM.Common',
        'BestSoft.mixin.Localized'
    ],


    /**
     * @cfg {Ext.util.Filter[]} filters
     * Filters which should be applied to view
     */
    filters: [],

    /**
     * @cfg {Boolean} filterLeavesOnly
     * By default filtering affects all tree items.
     * Setting this to true will make tree view to look only on tree leafs while filtering.
     */
    filterLeafsOnly: false,


    /**
     * Load attached store if it is not currently loading
     * @param {Object} [params]    Optional. Parameters, which will be passed to store load() method
     */
    loadStore: function(params) {
        var oStore = this.getStore();
        if(oStore && !oStore.isLoading())
            oStore.load(params);
    },


    /**
     * Appends a new filter to tree view
     * @param {Ext.util.Filter} filter    A filter
     * @param {Object} [scope]    Optional scope, which will be used when calling filter
     */
    addFilter: function(filter, scope) {
        this.filters.push({
            filter: filter,
            scope: scope
        });
    },


    /**
     * Returns true if the given node matches to all configured filters.
     * @param {Ext.data.NodeInterface}  node
     * @return {Boolean}
     */
    nodeMatchesFilters: function(node) {
        for(var i=this.filters.length-1; i>=0; --i)
        {
            if(!this.filters[i].filter.filterFn.call(this.filters[i].scope || this, node))
            {
                return false;
            }
        }
        return true;
    },


    /**
     * Runs through all tree nodes, hiding items, for which at least one filter returns false.
     * @param {Ext.data.NodeInterface} [startingNode]    If given, will do filtering only below that node
     */
    filter: function(startingNode) {
        if(this._isFiltering)
            return; //do nothing if we are currently filtering

        var me = this,
            treeNodeHash = this.getStore().tree.nodeHash;

        startingNode = startingNode || null;
        if(null !== startingNode && startingNode.isRoot()) //check if startingNode is tree root node
        {
            //do not use it, because all nodes will be its descendants
            //this will avoid cpu-expensive calls to isAncestor() method
            startingNode = null;
        }

        //do filtering
        this._isFiltering = true;
        for(var i in treeNodeHash)
        {
            if(!treeNodeHash.hasOwnProperty(i)) continue;

            var node = treeNodeHash[i];
            if(!me.rootVisible && node.isRoot()) continue; //skip invisible root

            //if startingNode is given, we should take only his descendant nodes
            if(null !== startingNode && node !== startingNode && !node.isAncestor(startingNode)) continue;

            if(this.filterLeafsOnly && !node.isLeaf()) //we should filter only leafs
            {
                continue; //node is not leaf, continue with another node
            }

            //exclude current node if it does not match filters and include otherwise
            this.excludeNode(node, !me.nodeMatchesFilters(node));

            //exclude(or include) nodes in parent chain
            this.excludeParentNode(node);
        }
        this._isFiltering = false;
    },


    /**
     * Consequently filters out parent nodes if they do not contains non-filtered items
     * @param {Ext.data.NodeInterface} node    A node to filter out or show again
     */
    excludeParentNode: function(node) {
        var parentNode = node.parentNode;
        var childNode = parentNode.firstChild;
        if(null !== childNode && !parentNode.isRoot())
        {
            var bAllChildrenExcluded = true;
            while(childNode)
            {
                if(!childNode.isExcludedByFilters)
                {
                    bAllChildrenExcluded = false;
                    break;
                }
                childNode = childNode.nextSibling;
            }
            this.excludeNode(parentNode, bAllChildrenExcluded);
            this.excludeParentNode(parentNode);
        }
    },


    /**
     * Filters node out or shows again
     * @param {Ext.data.NodeInterface} node    A node to filter out or show again
     * @param {Boolean} bExclude    Whenever to filter node out
     */
    excludeNode: function(node, bExclude) {

        //necessary to be sure Ext.fly will have access to a rendered element
        var parentNode = node.parentNode;
        if(null !== parentNode && !parentNode.isExpanded())
        {
            parentNode.expand();
        }

        var el = Ext.fly(this.getView().getNodeByRecord(node));
        el.setVisibilityMode(Ext.Element.DISPLAY);
        el.setVisible(!bExclude);
        node.isExcludedByFilters = bExclude;
    },


    /**
     * Removes all filters
     */
    clearFilters: function() {
        this.filters.length = 0;
        this.filter();
    },


    /**
     * Saves expand/collapse state of all tree nodes to LocalStorage.
     * If stateId config is not set, store is not loaded or LocalStorage is not supported, will do nothing.
     */
    storeTreeState: function() {
        var oStore = this.getStore();
        if(oStore && this.stateId && Ext.supports.LocalStorage)
        {
            var expandedIds = [];
            var treeNodeHash = oStore.tree.nodeHash;
            for(var i in treeNodeHash)
            {
                if(treeNodeHash.hasOwnProperty(i))
                {
                    var node = treeNodeHash[i],
                        nodeId = node.getId();
                    if(nodeId && node.isExpanded())
                    {
                        expandedIds.push(nodeId);
                    }
                }
            }
            var oProvider = Ext.create('Ext.state.LocalStorageProvider', {prefix: 'bs-'});
            oProvider.set(this.stateId, {
                expandedIds: expandedIds
            });
        }
    },


    /**
     * Restores expand/collapse state of all tree nodes from LocalStorage.
     * If stateId config is not set, store is not loaded or LocalStorage is not supported, will do nothing.
     */
    restoreTreeState: function() {
        var oStore = this.getStore();
        if(oStore && this.stateId && Ext.supports.LocalStorage)
        {
            var oProvider = Ext.create('Ext.state.LocalStorageProvider', {prefix: 'bs-'});
            oProvider = oProvider.get(this.stateId);
            var expandedIds = oProvider ? oProvider.expandedIds : [];

            var treeNodeHash = oStore.tree.nodeHash;
            for(var i in treeNodeHash)
            {
                if(treeNodeHash.hasOwnProperty(i))
                {
                    var node = treeNodeHash[i];
                    if(node.isExpandable())
                    {
                        var nodeId = node.getId();
                        if(Ext.Array.contains(expandedIds, nodeId))
                        {
                            node.expand();
                        }
                        else
                        {
                            if(nodeId && node.isExpanded())
                                node.collapse();
                        }
                    }
                }
            }
        }
    },


    /**
     * Remembers tree selection if any
     */
    rememberSelection: function() {
        this._selectedNode = this.getSelectionModel().getSelection()[0] || null;
    },


    /**
     * Restores previously remembered tree selection if any
     */
    restoreSelection: function() {
        if(this._selectedNode)
        {
            this.expandPath(this._selectedNode.getPath());
            this.getSelectionModel().select(this._selectedNode);
        }
    },


    initComponent: function() {
        //whenever to enable or disable filtering
        this._isFiltering = false;

        //last selected node
        this._selectedNode = null;

        var me = this;
        Ext.applyIf(this, {
            columnLines: true,
            autoLoadStore: true,
            viewConfig: {
                stripeRows: true
            },
            tools:[{
                type:'refresh',
                tooltip: me.T("reload"),
                handler: function(){
                    var oStore = me.getStore();
                    if(oStore)
                    {
                        me.storeTreeState();
                        oStore.reload();
                    }
                }
            }]
        });
        if(this.autoLoadStore)
        {
            this.on('afterrender', this.loadStore, this, {single: true});
        }
        if(this.stateId) //load event is needed only for state restoring
        {
            var oStore = this.getStore();
            if(oStore)
                oStore.on('load', this.onStoreLoad, this);
            else
                Ext.log({
                    msg: 'A stateId config is set, but there is no valid store assigned to tree component! ' +
                        'Tree state will not be restored after store load.',
                    level: 'error'
                });
        }
        this.callParent(arguments);

        //apply filter on particular node when it is expanded
        this.mon(this, 'afteritemexpand', this.filter, this);
    },


    /**
     * Invoked before the component is destroyed
     */
    beforeDestroy: function() {
        this.filters.length = 0;
        this.storeTreeState();
        this.callParent(arguments);
    },


    /**
     * Fires whenever the store reads data from a remote data source.
     * @param {Ext.data.TreeStore} oStore
     * @param {Ext.data.NodeInterface} node    The node that was loaded.
     * @param {Ext.data.Model[]} records    An array of records.
     * @param {Boolean} successful    True if the operation was successful.
     */
    onStoreLoad: function(oStore, node, records, successful) {
        if(successful)
            this.restoreTreeState();
    }
});
