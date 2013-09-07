/**
 * This file contains name and alias mappings for all overrides.
 * That allows to require all available overrides at once, using
 *   Ext.require('BestSoft.override.*')
 * syntax.
 *
 * Remember to add here the name of each new override you create in 'override' folder.
 */

(function() {
    var mappings = {
        "BestSoft.override.app.Controller": [],
        "BestSoft.override.Component": [],
        "BestSoft.override.data.Model": [],
        "BestSoft.override.data.Store": [],
        "BestSoft.override.window.MessageBox": [],
        "BestSoft.override.form.Basic": []
    };
    Ext.ClassManager.addNameAlternateMappings(mappings);
    Ext.ClassManager.addNameAliasMappings(mappings);
})();

