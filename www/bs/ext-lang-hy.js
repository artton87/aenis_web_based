/**
 * Armenian translation
 */
Ext.onReady(function() {
    var cm = Ext.ClassManager,
        exists = Ext.Function.bind(cm.get, cm);

    if (Ext.Updater) {
        Ext.Updater.defaults.indicatorText = '<div class="loading-indicator">Բեռնավորվում է ...</div>';
    }

    Ext.define("Ext.locale.hy.view.View", {
        override: "Ext.view.View",
        emptyText: ""
    });

    Ext.define("Ext.locale.hy.grid.Panel", {
        override: "Ext.grid.Panel",
        ddText: "{0} նշված տող"
    });

    Ext.define("Ext.locale.hy.TabPanelItem", {
        override: "Ext.TabPanelItem",
        closeText: "Փակել այս ներդիրը"
    });

    Ext.define("Ext.locale.hy.form.Basic", {
        override: "Ext.form.Basic",
        waitTitle: "Բեռնավորվում է ..."
    });

    Ext.define("Ext.locale.hy.LoadMask", {
        override: "Ext.LoadMask",
        msg: "Բեռնավորվում է ..."
    });

    Ext.define("Ext.locale.hy.form.field.Base", {
        override: "Ext.form.field.Base",
        invalidText: "Այս դաշտի արժեքը սխալ է"
    });

    // changing the msg text below will affect the LoadMask
    Ext.define("Ext.locale.hy.view.AbstractView", {
        override: "Ext.view.AbstractView",
        msg: "Բեռնավորվում է  ..."
    });

    if (Ext.Date) {
        Ext.Date.monthNames = ["Հունվար", "Փետրվար", "Մարտ", "Ապրիլ", "Մայիս", "Հունիս", "Հուլիս", "Օգոստոս", "Սեպտեմբեր", "Հոկտեմբեր", "Նոյեմբեռ", "Դեկտեմբեր"];

        Ext.Date.shortMonthNames = ["Հունվ", "Փետ", "Մարտ", "Ապր", "Մայ", "Հուն", "Հուլ", "Օգոստ", "Սեպ", "Հոկ", "Նոյմ", "Դեկ"];

        Ext.Date.getShortMonthName = function(month) {
            return Ext.Date.shortMonthNames[month];
        };

        Ext.Date.monthNumbers = {
            "Հունվ": 0,
            "Փետ": 1,
            "Մարտ": 2,
            "Ապր": 3,
            "Մայ": 4,
            "Հուն": 5,
            "Հուլ": 6,
            "Օգոստ": 7,
            "Սեպ": 8,
            "Հոկ": 9,
            "Նոյմ": 10,
            "Դեկ": 11
        };

        Ext.Date.getMonthNumber = function(name) {
            name = name.substring(0, 1).toUpperCase() + name.substring(1).toLowerCase();
            var i;
            if(i = Ext.Array.indexOf(Ext.Date.shortMonthNames, name))
            {
                return i;
            }
            else
            {
                return Ext.Array.indexOf(Ext.Date.monthNames, name);
            }
        };

        Ext.Date.dayNames = ["Կիրակի", "Երկուշաբթի", "Երեքշաբթի", "Չորեքշաթի", "Հինգշաբթի", "Ուրբաթ", "Շաբաթ"];

        Ext.Date.shortDayNames = ["Կիր", "Երկ", "Երք", "Չրք", "Հնգ", "Ուրբ", "Շբթ"];

        Ext.Date.getShortDayName = function(day) {
            return Ext.Date.shortDayNames[day];
        };
    }

    Ext.define("Ext.locale.hy.window.MessageBox", {
        override: "Ext.window.MessageBox",
        buttonText: {
            ok: "OK",
            cancel: "Փակել",
            yes: "Այո",
            no: "Ոչ"
        },
        titleText: {
            confirm: 'Հաստատել',
            prompt: 'Հավաքեք արժեք',
            wait: 'Բեռնավորվում է...',
            alert: 'Ուշադրություն'
        }
    });

    if (exists('Ext.util.Format')) {
        Ext.util.Format.__number = Ext.util.Format.number;
        Ext.util.Format.number = function(v, format) {
            return Ext.util.Format.__number(v, format || "0.000,00/i");
        };

        Ext.apply(Ext.util.Format, {
            thousandSeparator: '.',
            decimalSeparator: ',',
            currencySign: 'դրամ', // Armenian dram
            dateFormat: 'd/m/Y'
        });
    }

    Ext.define("Ext.locale.hy.picker.Date", {
        override: "Ext.picker.Date",
        todayText: "Այսօր",
        minText: "Այս ամսաթիվը փոքր է թույլատրված փոքրագույն ամսաթվից",
        maxText: "Այս ամսաթիվը գերազանցում է թույլատրված մեծագույն ամսաթիվը",
        disabledDaysText: "",
        disabledDatesText: "",
        monthNames: Ext.Date.monthNames,
        dayNames: Ext.Date.dayNames,
        nextText: "Հաջորդ ամիս (Ctrl + Աջ)",
        prevText: "Նախորդ ամիս (Ctrl + Ձախ)",
        monthYearText: 'Ընտրել ամիս (Ctrl + Վերև / Ներքև տարվա ընտրության համար)',
        todayTip: "{0} (Space)",
        format: "d/m/Y",
        startDay: 1
    });

    Ext.define("Ext.locale.hy.picker.Month", {
        override: "Ext.picker.Month",
        okText: "&#160;Հաստատել&#160;",
        cancelText: "Փակել"
    });

    Ext.define("Ext.locale.hy.toolbar.Paging", {
        override: "Ext.PagingToolbar",
        beforePageText: "Էջ",
        afterPageText: "{0}-ից",
        firstText: "Առաջին էջ",
        prevText: "Նախորդ էջ",
        nextText: "Հաջորդ էջ",
        lastText: "Վերջին էջ",
        refreshText: "Թարմացնել",
        displayMsg: "Ցուցադրված են {0}-ից {1} գրառումներ, ընդամենը` {2}",
        emptyMsg: 'Գրառումներ չկան'
    });

    Ext.define("Ext.locale.hy.form.field.Text", {
        override: "Ext.form.field.Text",
        minLengthText: "Այս դաշտի փոքրագույն թույլատրելի երկարությունը {0} է",
        maxLengthText: "Այս դաշտի մեծագույն թույլատրելի երկարությունը {0} է",
        blankText: "Այս դաշտը պարտադիր է լրացման համար",
        regexText: "",
        emptyText: null
    });

    Ext.define("Ext.locale.hy.form.field.Number", {
        override: "Ext.form.field.Number",
        minText: "Այս դաշտի արժեքը չի կարող փոքր լինել {0}-ից",
        maxText: "Այս դաշտի արժեքը չի կարող մեծ լինել {0}-ից",
        nanText: "{0}-ն թվային արժեք չէ "
    });

    Ext.define("Ext.locale.hy.form.field.Date", {
        override: "Ext.form.field.Date",
        disabledDaysText: "Հասանելի չէ",
        disabledDatesText: "Հասանելի չէ",
        minText: "Ամսաթիվը պետք է մեծ լինի {0}-ից",
        maxText: "Ամսաթիվը պետք է փոքր լինի {0}-ից",
        invalidText: "{0}-ն թույլատրելի ձևաչափով ամսաթիվ չէ: Ամսաթիվը պետք է տրված լինի {1} ձևաչափով",
        format: "d/m/Y",
        altFormats: "d/m/Y|d.m.y|d-m-y|d-m-Y|d/m|d-m|dm|dmy|dmY|d|Y-m-d"
    });

    Ext.define("Ext.locale.hy.form.field.ComboBox", {
        override: "Ext.form.field.ComboBox",
        valueNotFoundText: undefined
    }, function() {
        Ext.apply(Ext.form.field.ComboBox.prototype.defaultListConfig, {
            loadingText: "Բեռնավորվում է ..."
        });
    });

    if (exists('Ext.form.field.VTypes')) {
        Ext.apply(Ext.form.field.VTypes, {
            emailText: 'Այս դաշտը պետք է պարունակի էլ. փոստի հասցե "user@example.com" ձևաչափով',
            urlText: 'Այս դաշտը պետք է պարունակի URL "http:/' + '/www.example.com" ձևաչափով',
            alphaText: 'Այս դաշտը պետք է պարունակի միայն անգլերեն տառեր և "_" ընդգծման նշան',
            alphanumText: 'Այս դաշտը պետք է պարունակի միայն անգլերեն տառեր, թվեր և "_" ընդգծման նշան'
        });
    }

    Ext.define("Ext.locale.hy.form.field.HtmlEditor", {
        override: "Ext.form.field.HtmlEditor",
        createLinkText: 'Նշեք հղման հասցեն`'
    }, function() {
        Ext.apply(Ext.form.field.HtmlEditor.prototype, {
            buttonTips: {
                bold: {
                    title: 'Թավ (Ctrl+B)',
                    text: 'Տեքստի նշված հատվածը դարձնել թավ:',
                    cls: Ext.baseCSSPrefix + 'html-editor-tip'
                },
                italic: {
                    title: 'Շեղատառ (Ctrl+I)',
                    text: 'Տեքստի նշված հատվածը դարձնել շեղատառ:',
                    cls: Ext.baseCSSPrefix + 'html-editor-tip'
                },
                underline: {
                    title: 'Ընդգծված (Ctrl+U)',
                    text: 'Տեքստի նշված հատվածը դարձնել ընդգծված:',
                    cls: Ext.baseCSSPrefix + 'html-editor-tip'
                },
                increasefontsize: {
                    title: 'Խոշորացնել տեքստը',
                    text: 'Մեծացնել տառատեսակի չափը',
                    cls: Ext.baseCSSPrefix + 'html-editor-tip'
                },
                decreasefontsize: {
                    title: 'Փոքրացնել տեքստը',
                    text: 'Փոքրացնել տառատեսակի չափը',
                    cls: Ext.baseCSSPrefix + 'html-editor-tip'
                },
                backcolor: {
                    title: 'Տեքստի ֆոնի գույն',
                    text: 'Փոխել տեքստի նշված հատվածի ֆոնի գույնը',
                    cls: Ext.baseCSSPrefix + 'html-editor-tip'
                },
                forecolor: {
                    title: 'Տեքստի գույն',
                    text: 'Փոխել տեքստի նշված հատվածի գույնը',
                    cls: Ext.baseCSSPrefix + 'html-editor-tip'
                },
                justifyleft: {
                    title: 'Հավասարացնել ըստ ձախի',
                    text: 'Հավասարացնել տեքստը ըստ ձախի',
                    cls: Ext.baseCSSPrefix + 'html-editor-tip'
                },
                justifycenter: {
                    title: 'Հավասարացնել ըստ կենտրոնի',
                    text: 'Հավասարացնել տեքստը ըստ կենտրոնի',
                    cls: Ext.baseCSSPrefix + 'html-editor-tip'
                },
                justifyright: {
                    title: 'Հավասարացնել ըստ աջի',
                    text: 'Հավասարացնել տեքստը ըստ աջի',
                    cls: Ext.baseCSSPrefix + 'html-editor-tip'
                },
                insertunorderedlist: {
                    title: 'Կետերով համարակալում',
                    text: 'Սկսել կետերով համարակալված ցուցակ',
                    cls: Ext.baseCSSPrefix + 'html-editor-tip'
                },
                insertorderedlist: {
                    title: 'Թվերով համարակալում',
                    text: 'Սկսել թվերով համարակալված ցուցակ',
                    cls: Ext.baseCSSPrefix + 'html-editor-tip'
                },
                createlink: {
                    title: 'Հղում',
                    text: 'Տեքստի նշված հատվածը դարձնել հղում',
                    cls: Ext.baseCSSPrefix + 'html-editor-tip'
                },
                sourceedit: {
                    title: 'Կոդի խմբագրում',
                    text: 'Անցնել կոդի խմբագրման ռեժիմին',
                    cls: Ext.baseCSSPrefix + 'html-editor-tip'
                }
            }
        });
    });

    Ext.define("Ext.locale.ru.grid.header.Container", {
        override: "Ext.grid.header.Container",
        sortAscText: "Դասավորել աճման կարգով",
        sortDescText: "Դասավորել նվազման կարգով",
        lockText: "Ամրացնել սյունակը",
        unlockText: "Հանել սյունակի ամրացումը",
        columnsText: "Սյունակներ"
    });

    Ext.define("Ext.locale.hy.grid.GroupingFeature", {
        override: "Ext.grid.GroupingFeature",
        emptyGroupText: '(Դատարկ է)',
        groupByText: 'Խմբավորել ըստ այս դաշտի',
        showGroupsText: 'Ցույց տալ ըստ խմբերի'
    });

    Ext.define("Ext.locale.hy.grid.PropertyColumnModel", {
        override: "Ext.grid.PropertyColumnModel",
        nameText: "Անուն",
        valueText: "Արժեք",
        dateFormat: "d/m/Y"
    });

    Ext.define("Ext.locale.hy.grid.BooleanColumn", {
        override: "Ext.grid.BooleanColumn",
        trueText: "այո",
        falseText: "ոչ"
    });

    Ext.define("Ext.locale.hy.grid.NumberColumn", {
        override: "Ext.grid.NumberColumn",
        format: '0.000,00/i'
    });

    Ext.define("Ext.locale.hy.grid.DateColumn", {
        override: "Ext.grid.DateColumn",
        format: 'd/m/Y'
    });

    Ext.define("Ext.locale.hy.form.field.Time", {
        override: "Ext.form.field.Time",
        minText: "Այս դաշտում նշված ժամը պետք է մեծ լինի կամ հավասար {0}-ից",
        maxText: "Այս դաշտում նշված ժամը պետք է փոքր լինի կամ հավասար {0}-ին",
        invalidText: "{0}-ն թույլատրելի ժամ չէ",
        format: "H:i"
    });

    Ext.define("Ext.locale.hy.form.CheckboxGroup", {
        override: "Ext.form.CheckboxGroup",
        blankText: "Հարկավոր է նշել գոնե մեկ կետ այս խմբից"
    });

    Ext.define("Ext.locale.hy.form.RadioGroup", {
        override: "Ext.form.RadioGroup",
        blankText: "Հարկավոր է ընտրել որևէ կետ"
    });


    Ext.define("Ext.locale.hy.grid.feature.Grouping", {
        override: "Ext.grid.feature.Grouping",
        groupByText: 'Խմբավորել ըստ այս սյունակի',
        showGroupsText: 'Ցուցադրել խմբավորված'
    });

    Ext.define("Ext.ux.locale.hy.grid.FiltersFeature", {
        override: "Ext.ux.grid.FiltersFeature",
        menuFilterText: 'Ֆիլտրներ'
    });

    Ext.define("Ext.ux.locale.hy.grid.filter.BooleanFilter", {
        override: "Ext.ux.grid.filter.BooleanFilter",
        yesText: 'Այո',
        noText: 'Ոչ'
    });

    Ext.define("Ext.ux.locale.hy.grid.filter.DateFilter", {
        override: "Ext.ux.grid.filter.DateFilter",
        afterText: 'Սկսած',
        beforeText: 'Մինչև',
        onText: 'Օր'
    });

    Ext.define("Ext.ux.locale.hy.grid.filter.StringFilter", {
        override: "Ext.ux.grid.filter.StringFilter",
        emptyText: 'Հավաքեք ֆիլտրի տեքստը'
    });

    Ext.define("Ext.ux.locale.hy.grid.menu.RangeMenu", {
        override: "Ext.ux.grid.menu.RangeMenu",
        fieldLabels: {
            gt: 'Ավելի մեծ քան',
            lt: 'Ավելի փոքև քան',
            eq: 'Հավասար'
        },
        menuItemCfgs : {
            emptyText: 'Հավաքեք թիվ...',
            selectOnFocus: false,
            width: 155
        }
    });

    Ext.define("Ext.locale.hy.view.AbstractView", {
        override: "Ext.view.AbstractView",
        loadingText: 'Բեռնավորվում է'
    });

    Ext.define("Ext.ux.locale.hy.grid.menu.ListMenu", {
        override: "Ext.ux.grid.menu.ListMenu",
        loadingText: 'Բեռնավորվում է'
    });


    Ext.define("Ext.ux.locale.hy.TabCloseMenu", {
        override: "Ext.ux.TabCloseMenu",
        closeTabText: 'Փակել ներդիրը',
        closeOthersTabsText: 'Փակել մյուս ներդիրները',
        closeAllTabsText: 'Փակել բոլոր ներդիրները'
    });


    Ext.define("Ext.ux.locale.hy.IFrame", {
        override: "Ext.ux.IFrame",
        loadMask: 'Բեռնավորվում է ...'
    });
});
