Ext.require([
    'BestSoft.grid.Panel',
    'Ext.ux.grid.FiltersFeature'
]);

/**
 * A grid for selecting party right types
 */
Ext.define('Aenis.view.workflow.party.right.type.components.TypesGrid', {
    extend: 'BestSoft.grid.Panel',
    alias: 'widget.workflowPartyRightTypesGrid',

    mixins: [
        'Locale.hy_AM.Common',
        'Locale.hy_AM.workflow.party.right.type.components.TypesGrid',
        'BestSoft.mixin.Localized'
    ],


    initComponent: function() {
        Ext.apply(this, {
            features: [
                {
                    ftype: 'filters',
                    encode: false,
                    local: true
                }
            ],
            columns: [
                {
                    text: this.T('id'),
                    dataIndex: 'id',
                    hidden: true,
                    width: 70,
                    filterable: true
                },
                {
                    text: this.T('label'),
                    flex: 1,
                    dataIndex: 'label',
                    hideable: false,
                    filterable: true
                }
            ]
        });
        this.callParent(arguments);
    }
});
