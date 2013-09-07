Ext.define('BestSoft.button.Reset', {
    extend: 'Ext.button.Button',
    alias: 'widget.bsbtnReset',

    mixins: [
        'Locale.hy_AM.Common',
        'BestSoft.mixin.Localized'
    ],

    initComponent: function() {
        Ext.applyIf(this, {
            text: this.T('reset'),
            action: 'reset',
            iconCls: 'icon-reset'
        });
        this.callParent(arguments);
    }
});
