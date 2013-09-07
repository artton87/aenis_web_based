// Loader config
Ext.Loader.setConfig({
    enabled: true,
    paths: {
        "Ext": "ext/src",
        "Ext.ux": "ext/src/ux",
        "Aenis": "app",
        "Locale": "app/locale",
        "BestSoft": "bs",
        "Ext.calendar" :"calendar/src"
    }
});


/**
 * Namespace for BestSoft variables
 */
Ext.ns('BestSoft');

/**
 * afterLabelTextTpl config value for required fields
 * @type {String}
 */
BestSoft.required = '<span class="field_required"></span>';

/**
 * Buffer value for events
 * @type {Number}
 */
BestSoft.eventDelay = 300;

// Ext.supports.LocalStorage is available since 4.1.2 only
if(!("LocalStorage" in Ext.supports))
{
    Ext.supports.LocalStorage = 'localStorage' in window && window['localStorage'] !== null;
}
