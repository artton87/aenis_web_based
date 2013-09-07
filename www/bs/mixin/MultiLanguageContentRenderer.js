Ext.define('BestSoft.mixin.MultiLanguageContentRenderer', {

    /**
     * A renderer for grid/tree column, which should display only first text from multiple languages.
     *
     * @param {Object} value    The data value for the current cell
     * @param {Object} metaData    A collection of metadata about the current cell; can be used or modified by the
     *                             renderer. Recognized properties are: tdCls, tdAttr, and style.
     * @param {Ext.data.Model} record    The record for the current row
     * @param {Number} rowIndex    The index of the current row
     * @param {Number} colIndex    The index of the current column
     * @param {Ext.data.Store} store    The data store
     * @param {Ext.view.View} view    The current view
     * @return {Object}    The HTML string to be rendered or initial value object
     */
    singleLanguageContentRenderer: function(value, metaData, record, rowIndex, colIndex, store, view) {
        var oColumn = view.headerCt.getGridColumns()[colIndex];
        var contentStore = record.content();

        var model = null, text, contentRecord = null;
        if(oColumn.hasOwnProperty('useLanguage'))
        {
            //<debug>
            if(!view.ownerCt['languagesStore'])
            {
                Ext.Error.raise(
                    'Config "useLanguage" is specified, but there is no "languagesStore" config set ' +
                    'to valid languages store'
                );
                return null;
            }
            //</debug>
            model = view.ownerCt.languagesStore.getLanguageByCode(oColumn['useLanguage']);
            if(model)
            {
                contentRecord = contentStore.getById(model.getId());
            }
        }
        else
        {
            //no language specified, trying to take default language
            if(view.ownerCt['languagesStore'])
                model = view.ownerCt.languagesStore.getLanguageByDefaultFlag();

            if(model)
            {
                contentRecord = contentStore.getById(model.getId());
            }
            else
            {
                //take first one if default language was not found
                contentRecord = contentStore.first();
            }
        }

        if(contentRecord && (text = contentRecord.get(oColumn.dataIndex))!="")
        {
            return text;
        }
        return value;
    },


    /**
     * A renderer for grid/tree column, which should display text in multiple languages.
     * The following configs can be given to grid/tree column:
     *     'hiddenFieldDataIndex' - dataIndex of field, which shows row hidden status
     *     'langMissingText' - placeholder to be put when the translation is missing
     *
     * The config 'languagesStore' in grid/tree element should contain a loaded Languages store.
     *
     * Renders all items from 'content' sub-model. Default language content is rendered as
     * text, and all languages are displayed as flag icons, with translation inside flag tooltip.
     *
     * @param {Object} value    The data value for the current cell
     * @param {Object} metaData    A collection of metadata about the current cell; can be used or modified by the
     *                             renderer. Recognized properties are: tdCls, tdAttr, and style.
     * @param {Ext.data.Model} record    The record for the current row
     * @param {Number} rowIndex    The index of the current row
     * @param {Number} colIndex    The index of the current column
     * @param {Ext.data.Store} store    The data store
     * @param {Ext.view.View} view    The current view
     * @return {String}    The HTML string to be rendered.
     */
    multiLanguageContentRenderer: function(value, metaData, record, rowIndex, colIndex, store, view) {
        var oColumn = view.headerCt.getGridColumns()[colIndex];
        var dataIndex = oColumn.dataIndex,
            hiddenFieldDataIndex = oColumn.hiddenFieldDataIndex || 'hidden',
            langMissingText = oColumn.langMissingText;

        if(record.get(hiddenFieldDataIndex))
            metaData.style += 'opacity:0.4;';

        var contentStore = record.content();

        //render flag icons for each language
        var html = '', defaultLangModel = null;
        view.ownerCt.languagesStore.each(function(lang) {
            if(lang.get('is_default'))
                defaultLangModel = lang;
            var text, contentRecord = contentStore.getById(lang.getId());
            if(contentRecord && (text = contentRecord.get(dataIndex))!="")
            {
                html += '<div class="ml-content-icon" data-qtip="'+Ext.String.htmlEncode(text)+'"><div class="lang-'+lang.get('code')+'"></div></div>';
            }
            else
            {
                html += '<div class="ml-content-icon ml-content-missing" data-qtip="'+langMissingText+'"><div class="lang-'+lang.get('code')+'"></div></div>';
            }
        });

        if(('showData' in oColumn) && !oColumn.showData)
        {
            return html;
        }

        //show default content if any
        var text, contentRecord = contentStore.getById(defaultLangModel.getId());
        if(contentRecord && (text = contentRecord.get(dataIndex))!="")
        {
            html += text;
        }
        return html;
    }
});
