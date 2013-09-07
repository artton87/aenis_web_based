/**
 * An edit button ([action=edit]) which is initially disabled
 */
Ext.define('BestSoft.button.Edit', {
    extend: 'Ext.button.Button',
    alias: 'widget.bsbtnEdit',

    mixins: [
        'Locale.hy_AM.Common',
        'BestSoft.mixin.Localized'
    ],

    initComponent: function() {
        Ext.applyIf(this, {
            text: this.T('edit'),
            action: 'edit',
            iconCls: 'icon-edit'
        });
        this.callParent(arguments);
    }
});
