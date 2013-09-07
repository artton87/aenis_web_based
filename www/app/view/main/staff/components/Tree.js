Ext.require([
    'BestSoft.tree.Panel',
    'BestSoft.tree.filter.Text',
    'Ext.ux.grid.FiltersFeature',
    'Ext.ux.CheckColumn',
    'Aenis.store.main.Staffs'
]);

/**
 * A grid, which displays staffs tree
 */
Ext.define('Aenis.view.main.staff.components.Tree', {
    extend: 'BestSoft.tree.Panel',
    alias: 'widget.main.staff.Tree',

    mixins: [
        'Locale.hy_AM.Common',
        'Locale.hy_AM.main.staff.components.Tree',
        'BestSoft.mixin.StyleSheetLoader'
    ],

    styleSheets: [
        'main/staff/components/Tree.css'
    ],

    initComponent: function() {
        this.loadStyleSheets();
        Ext.applyIf(this, {
            header: false,
            border: false,
            stateId: this.alias,
            collapsible: false,
            rootVisible: false,
            useArrows: true,
            animate: false,
            tbar: [
                {
                    xtype: 'bsTreeFilterText',
                    tree: this,
                    emptyText: this.T('quick_search'),
                    width: 300,
                    filterFn: function(node) {
                        var val = this.getValue();
                        return (val == "") || (node.get('title').indexOf(val)>=0);
                    }
                },
                '->'
            ],
            columns: [
                {
                    text: this.T('id'),
                    dataIndex: 'id',
                    width: 60,
                    hidden: true
                },
                {
                    xtype: 'treecolumn',
                    text: this.T('title'),
                    flex: 1,
                    hideable: false,
                    dataIndex: 'title'
                },
                {
                    text: this.T('dep_title'),
                    flex: 1,
                    dataIndex: 'dep_title'
                }
            ]
        });
        this.callParent(arguments);
    }
});
