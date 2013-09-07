/**
 * A save button ([action=save]) which is initially disabled
 */
Ext.define('BestSoft.button.Save', {
    extend: 'Ext.button.Button',
    alias: 'widget.bsbtnSave',

    mixins: [
        'Locale.hy_AM.Common',
        'BestSoft.mixin.Localized'
    ],

    initComponent: function() {
        Ext.applyIf(this, {
            text: this.T('save'),
            action: 'save',
            iconCls: 'icon-save'
        });
        this.callParent(arguments);
    }
});
