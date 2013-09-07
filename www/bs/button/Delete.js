/**
 * A delete button ([action=delete]) which is initially disabled
 */
Ext.define('BestSoft.button.Delete', {
    extend: 'Ext.button.Button',
    alias: 'widget.bsbtnDelete',

    mixins: [
        'Locale.hy_AM.Common',
        'BestSoft.mixin.Localized'
    ],

    initComponent: function() {
        Ext.applyIf(this, {
            text: this.T('delete'),
            action: 'delete',
            iconCls: 'icon-delete'
        });
        this.callParent(arguments);
    }
});
