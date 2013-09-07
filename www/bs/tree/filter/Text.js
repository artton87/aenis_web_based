/**
 * @class BestSoft.tree.filter.Text
 * @extends Ext.form.Trigger
 * Provides a basic text entry field with a trigger for clearing the field/filter and another
 * to apply the field value and filter.
 */
Ext.define('BestSoft.tree.filter.Text', {
    extend: 'Ext.form.Trigger',
    alias: 'widget.bsTreeFilterText',

    /**
     * @cfg {Ext.tree.Panel|String} tree
     * A tree selector or element
     */
    tree: null,


    /**
     * Override this function to implement custom filtering
     * @cfg {Function} filterFn
     */
    filterFn: Ext.emptyFn,

    trigger1Cls: 'x-form-clear-trigger',
    trigger2Cls: 'x-form-search-trigger',


    initComponent: function() {
        this.callParent(arguments);

        this.addEvents(
            /**
             * @event beforeFilter
             * Fired before starting filtering process
             */
            'beforeFilter',

            /**
             * @event afterFilter
             * Fired after filtering process finishes
             */
            'afterFilter',

            /**
             * @event beforeClearFilter
             * Fired before clearing all filters
             */
            'beforeClearFilter',

            /**
             * @event afterClearFilter
             * Fired after clearing all filters
             */
            'afterClearFilter'
        );

        this.mon(this, 'specialkey', function(f, e) {
            var key = e.getKey();
            if(key == e.ENTER) //apply filter when user presses ENTER key
            {
                this.onTrigger2Click();
            }
            else if(key == e.ESC) //reset filter when user presses ESC
            {
                if(f.getValue() != "") //it makes sense to reset only if value is not blank
                {
                    this.onTrigger1Click();
                    e.stopPropagation();
                }
            }
        }, this);

        if(this.tree)
            this.setTreeComponent(this.tree);
    },


    /**
     * Sets tree panel, which this filter should filter
     * @param {Ext.tree.Panel} oTree
     */
    setTreeComponent: function(oTree) {
        if(typeof oTree === 'string')
        {
            oTree = Ext.ComponentQuery.query(this.tree)[0];
        }
        this.tree = oTree;

        this.tree.addFilter(
            new Ext.util.Filter({
                filterFn: this.filterFn
            }),
            this
        );
    },


    onTrigger1Click: function() {
        //<debug>
        if(!this.tree)
        {
            Ext.log({
                msg: 'Tree component is not set. Consider calling setTreeComponent().',
                level: 'error'
            });
        }
        //</debug>
        this.setValue('');
        this.tree.rememberSelection();
        this.fireEvent('beforeClearFilter');
        this.tree.filter();
        this.tree.restoreTreeState();
        this.tree.restoreSelection();
        this.fireEvent('afterClearFilter');
    },


    onTrigger2Click: function() {
        //<debug>
        if(!this.tree)
        {
            Ext.log({
                msg: 'Tree component is not set. Consider calling setTreeComponent().',
                level: 'error'
            });
        }
        //</debug>
        this.fireEvent('beforeFilter');
        this.tree.storeTreeState();
        this.tree.filter();
        this.fireEvent('afterFilter');
    }
});
