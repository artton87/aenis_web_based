Ext.require('Ext.button.Split');

/**
 * An application toolbox
 */
Ext.define('Aenis.view.sysadmin.menu.components.Toolbox', {
    extend: 'Ext.Container',
    alias: 'widget.sysadmin.menu.Toolbox',
    requires: [
        'Aenis.store.sysadmin.menu.Toolbox',
        'Aenis.store.main.profile.ModuleList'
    ],


    mixins: [
        'Locale.hy_AM.sysadmin.menu.components.Toolbox',
        'BestSoft.mixin.Localized',
        'BestSoft.mixin.StyleSheetLoader'
    ],


    /**
     * @cfg {Number} moduleId
     * Id of module, for which toolbox will be generated.
     */
    moduleId: 0,

    /**
     * @cfg {String} moduleCode
     * Code of module, for which toolbox will be generated.
     */
    moduleCode: '',

    /**
     * @cfg {Boolean} [showModulePicker]
     * Whenever to show module picker. Defaults to true.
     */
    showModulePicker: true,


    /**
     * Returns the store associated with this Toolbox.
     * @return {Ext.data.Store} The store
     */
    getStore: function(){
        return this.store;
    },


    initComponent: function() {
        var me = this;

        Ext.applyIf(this, {
            xtype: 'container',
            border: false,
            layout: {
                type: 'vbox',
                align: 'stretch'
            },
            items: [
                {
                    xtype: 'toolbar',
                    itemId: 'menubar'
                },
                {
                    xtype: 'toolbar',
                    itemId: 'toolbar',
                    layout: {
                        type: 'hbox',
                        overflowHandler: 'Menu'
                    }
                }
            ]
        });
        this.callParent(arguments);

        //setup toolbox store, where all commands reside
        me.store = Ext.create('Aenis.store.sysadmin.menu.Toolbox');
        me.store.on('load', me.onToolboxStoreLoaded, me);
        if(me.moduleId)
            this.loadStore();
    },


    onToolboxStoreLoaded: function(store) {
        var me = this;

        //load style sheet with toolbox icons
        me.loadStyleSheet(me.moduleCode + '/toolbox.css', null, false);

        //destroy all previous toolbox items
        var oMenuBar = this.down('#menubar');
        oMenuBar.removeAll();

        var oToolBar = this.down('#toolbar');
        oToolBar.removeAll();

        Ext.suspendLayouts();
        var root = store.getRootNode();

        var toolbarButtons = [];

        //creating menu bar items
        var refMap = {};
        root.cascadeBy(function(oNode) {
            if(oNode.isRoot()) return; //skip root node

            var cfg = {text: oNode.data.title};
            if(oNode.hasChildNodes())
            {
                Ext.apply(cfg, {menu: []});
            }
            else if(oNode.data.command)
            {
                Ext.apply(cfg, {
                    scope: me,
                    command: oNode.data.command,
                    handler: me.onToolboxItem,
                    iconCls: 'toolbox-' + oNode.data.command.replace(/\./g, '-')
                });
                if(oNode.data.has_toolbar_button) //collect toolbar buttons
                    toolbarButtons.push(oNode.data);
            }

            if(0 == oNode.data.parent_id) //first level (without parent)
            {
                Ext.apply(cfg, {
                    xtype: 'button'
                });
                refMap[oNode.data.id] = Ext.ComponentManager.create(cfg);
                oMenuBar.add(refMap[oNode.data.id]);
                if(oNode.data.has_menu_sep)
                    oMenuBar.add(Ext.create('Ext.toolbar.Separator'));
            }
            else //child levels
            {
                Ext.apply(cfg, {
                    xtype: 'menuitem'
                });
                refMap[oNode.data.id] = Ext.ComponentManager.create(cfg);
                refMap[oNode.data.parent_id].menu.add(refMap[oNode.data.id]);
                if(oNode.data.has_menu_sep)
                    refMap[oNode.data.parent_id].menu.add(Ext.ComponentManager.create({xtype:'menuseparator'}));
            }
        }, this);

        //creating toolbar buttons
        Ext.Array.sort(toolbarButtons, function (a, b) {
            return a.toolbar_order - b.toolbar_order;
        });
        for(var i=0; i<toolbarButtons.length; ++i)
        {
            var btn = toolbarButtons[i];
            var cfg = {
                xtype: 'button',
                tooltip: btn.title,
                scope: me,
                command: btn.command,
                handler: me.onToolboxItem,
                iconCls: 'toolbox-' + btn.command.replace(/\./g, '-')
            };
            oToolBar.add(Ext.ComponentManager.create(cfg));
            if(btn.has_toolbar_sep)
                oToolBar.add(Ext.ComponentManager.create({xtype: 'tbseparator'}));
        }
        Ext.resumeLayouts(true);

        if(me.showModulePicker)
        {
            var modules = Ext.create('Aenis.store.main.profile.ModuleList');
            modules.load(function(records) {
                if(records.length>1)
                {
                    Ext.suspendLayouts();
                    oToolBar.add(Ext.ComponentManager.create({xtype: 'tbfill'}));
                    var cfg = {
                        xtype: 'splitbutton',
                        text: me.T("module_list"),
                        iconCls: 'toolbox-main-profile-ModuleList',
                        scope: me,
                        command: 'main.profile.ModuleList',
                        handler: me.onToolboxItem,
                        menu: []
                    };
                    for(var i=0; i<records.length; ++i)
                    {
                        var record = records[i];
                        var style = (record.data.id == me.moduleId) ? 'font-weight:bold;' : '';
                        cfg.menu.push({
                            xtype: 'menuitem',
                            text: record.data.title,
                            style: style,
                            iconCls: 'small-appicon-'+record.data.module,
                            scope: me,
                            moduleId: record.data.id,
                            command: record.data.module,
                            handler: me.onToolboxItem
                        });
                    }
                    oToolBar.add(Ext.ComponentManager.create(cfg));
                    Ext.resumeLayouts(true);
                }
            });
        }
    },


    /**
     * Set toolbox module id and code.
     * @param {Number} moduleId    For which module to generate
     * @param {String} moduleCode    For which module to generate
     */
    load: function(moduleId, moduleCode) {
        Ext.apply(this, {
            moduleId: moduleId,
            moduleCode: moduleCode
        });
        this.loadStore();
    },


    loadStore: function() {
        this.store.load({params: {module: this.moduleId}});
    },


    onToolboxItem: function(oAction) {
        if(oAction.moduleId)
        {
            this.fireEvent(
                'moduleActivated',
                {
                    module: oAction.command,
                    moduleId: oAction.moduleId
                }
            );
        }
        else
        {
            this.fireEvent(
                'commandActivated',
                {
                    command: oAction.command,
                    moduleId: this.moduleId,
                    moduleCode: this.moduleCode
                }
            );
        }
    }
});
