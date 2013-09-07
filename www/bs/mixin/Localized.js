Ext.define('BestSoft.mixin.Localized', {

    /**
     * Default locale, which will be used if neither ?lang=xxx url
     * parameter nor 'locale' property in class has been specified.
     */
    defaultLocale: 'hy_AM',

    /**
     * Current locale, cached result of getCurrentLocale() to speed up translations
     */
    currentLocale: null,


    getCurrentLocale: function() {
        if(null === this.currentLocale)
        {
            var locale = this.defaultLocale;
            var params = Ext.urlDecode(window.location.search.substring(1));
            if('lang' in params)
            {
                locale = params.lang;
            }
            else
            {
                if('locale' in this)
                {
                    locale = this.locale;
                }
            }
            this.currentLocale = locale;

            for(var key in this.mixins)
            {
                if(0 == key.indexOf("Locale."))
                {
                    if("constructor" in this.mixins[key])
                    {
                        if(! ("translations" in this))
                        {
                            Ext.apply(this, {
                                "translations": {}
                            });
                        }

                        for(var i=0; i<Ext.local.languages.length; ++i)
                        {
                            var langCode = Ext.local.languages[i][0];
                            if(! (langCode in this.translations))
                            {
                                this.translations[langCode] = {};
                            }
                        }
                        this.mixins[key].constructor.call(this);
                    }
                }
            }
        }
        return this.currentLocale;
    },


    T: function(key) {
        var locale = this.getCurrentLocale();
        if(key in this.translations[locale])
            return this.translations[locale][key];
        return key;
    }
});
