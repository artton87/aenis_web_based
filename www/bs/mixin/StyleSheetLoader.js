Ext.define('BestSoft.mixin.StyleSheetLoader', {

    /**
     * Load all stylesheets defined in 'styleSheets' property.
     * If 'theme' property is specified, stylesheets will be loaded from
     *   resources/css/<theme>/
     * otherwise, from
     *   resources/css/default/
     * @param {Function} [fnCallback]    Optional callback function to be called after loading all style sheets
     */
    loadStyleSheets: function(fnCallback) {
        if(!("styleSheets" in this)) return;

        Ext.suspendLayouts();
        var obj = {
            v: Ext.isArray(this.styleSheets) ? this.styleSheets : [this.styleSheets],
            nLoaded: 0
        };

        var nTotal = obj.v.length;

        obj.fn = function() {
            ++obj.nLoaded;
            if(obj.nLoaded >= nTotal)
            {
                Ext.util.CSS.refreshCache();
                Ext.Function.defer(function(){
                    Ext.resumeLayouts(true);
                    if(Ext.isFunction(fnCallback)) fnCallback();
                }, 50);
            }
        };

        for(var i=0; i<nTotal; ++i)
            this.loadStyleSheet(obj.v[i], obj.fn, true);
    },


    /**
     * Load the given stylesheet
     * If 'theme' property is specified, stylesheets will be loaded from
     *   resources/css/<theme>/
     * otherwise, from
     *   resources/css/default/
     * @param {String} styleSheet    URL to style sheet file
     * @param {Function} [fnCallback]    Optional callback function to be called after loading the style sheets
     * @param {Boolean} [noSuspendLayouts]    Optional. If given, does not suspend layouts when style sheet loads
     * @param {String} [id]    Optional. ID of <link> element in HEAD. If omitted, will generate new one using Ext.id()
     */
    loadStyleSheet: function(styleSheet, fnCallback, noSuspendLayouts, id) {
        if(!noSuspendLayouts)
            Ext.suspendLayouts();

        var theme = 'default';
        if("theme" in this)
        {
            theme = this.theme;
        }

        var me = this;
        if(!("loadedStyleSheetsRefMap" in this))
        {
            this.loadedStyleSheetsRefMap = {};
            me.mon(me, 'beforedestroy', me.removeLoadedStyleSheets, me, true);
        }

        if(styleSheet in this.loadedStyleSheetsRefMap) //stylesheet is already loaded, refresh it
        {
            id = this.loadedStyleSheetsRefMap[styleSheet];
        }
        else //new stylesheet, generate new id or use supplied one if any
        {
            id = id || Ext.id();
            this.loadedStyleSheetsRefMap[styleSheet] = id;
        }

        var styleSheetUrl = 'resources/css/'+theme+'/'+styleSheet;

        Ext.util.CSS.removeStyleSheet(id);
        Ext.util.CSS.createStyleSheet('', id);
        Ext.util.CSS.swapStyleSheet(id, styleSheetUrl);

        var img = new Image();
        img.onerror = function(){
            Ext.Function.defer(function(){
                if(!noSuspendLayouts)
                {
                    Ext.util.CSS.refreshCache();
                    Ext.resumeLayouts(true);
                }
                if(Ext.isFunction(fnCallback)) fnCallback();
            }, 50);
        };
        img.src = styleSheetUrl;
    },


    /**
     * Removes all loaded stylesheets.
     * Also acts as component 'beforedestroy' event handler.
     * @param {Ext.Component} cmp    A component which is going to be destroyed
     * @param {Boolean} [noSuspendLayouts]    Optional. If given, does not suspend layouts when style sheet loads
     */
    removeLoadedStyleSheets: function(cmp, noSuspendLayouts) {
        if(!noSuspendLayouts)
            Ext.suspendLayouts();
        Ext.Object.each(this.loadedStyleSheetsRefMap, function(key, id) {
            Ext.util.CSS.removeStyleSheet(id);
        });
        if(!noSuspendLayouts)
            Ext.resumeLayouts(true);
    }
});
