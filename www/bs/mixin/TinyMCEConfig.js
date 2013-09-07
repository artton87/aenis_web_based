Ext.define('BestSoft.mixin.TinyMCEConfig', {

    /**
     * @cfg {Object} tinyMCEConfig
     * Default (and recommended) configuration for embedded TinyMCE editor
     */
    tinyMCEConfig: {
        theme: "advanced",

        language: 'hy',
        skin: "extjs",
        inlinepopups_skin: "extjs",

        // Original value is 23, hard coded.
        // with 23 the editor calculates the height wrong.
        // With these settings, you can do the fine tuning of the height
        // by the initialization.
        theme_advanced_row_height: 27,
        delta_height: 1,

        schema: "html5",

        plugins : "autolink,lists,pagebreak,table,advhr,advimage,advlink,iespell,inlinepopups,searchreplace,paste,fullscreen,noneditable,visualchars,nonbreaking,xhtmlxtras",

        theme_advanced_buttons1: "bold,italic,underline,|,formatselect,|,justifyleft,justifycenter,justifyright,justifyfull,|,forecolor,backcolor,|,cut,copy,paste,pastetext,pasteword,|,bullist,numlist,|,outdent,indent,|,undo,redo",
        theme_advanced_buttons2: "tablecontrols,|,hr,removeformat,visualaid,|,sub,sup,|,advhr,|,search,replace,|,fullscreen,cleanup,code,|,visualchars,nonbreaking",
        theme_advanced_buttons3: "",
        theme_advanced_toolbar_location: "top",
        theme_advanced_toolbar_align: "left",
        theme_advanced_statusbar_location: 0,
        theme_advanced_blockformats: "h3,h4,h5,h6",
        content_css: "resources/css/default/tinymce_textarea_editor.css"
    }
});
