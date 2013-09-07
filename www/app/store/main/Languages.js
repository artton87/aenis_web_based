Ext.define('Aenis.store.main.Languages', {
    extend: 'Ext.data.Store',

    model: 'Aenis.model.main.Language',

    autoLoad: false,
    autoDestroy: true,
    autoSync: true,

    _cache: {
        defaultLanguageModel: null,
        languageCodeModelMap: {}
    },


    /**
     * Returns language model by given code
     * @param {String} code    Language code
     * @return {Aenis.model.main.Language}
     */
    getLanguageByCode: function(code) {
        if(!this._cache.languageCodeModelMap[code])
        {
            var i = this.findExact('code', code);
            if(i>=0)
            {
                this._cache.languageCodeModelMap[code] = this.getAt(i);
            }
        }
        return this._cache.languageCodeModelMap[code];
    },


    /**
     * Returns language model for the default language
     * @return {Aenis.model.main.Language}
     */
    getLanguageByDefaultFlag: function() {
        if(!this._cache.defaultLanguageModel)
        {
            var i = this.findExact('is_default', true);
            if(i>=0)
            {
                this._cache.defaultLanguageModel = this.getAt(i);
            }
        }
        return this._cache.defaultLanguageModel;
    }
});
