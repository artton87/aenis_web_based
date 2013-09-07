Ext.require([
    //'BestSoft.calendar.Panel'

   /* 'Ext.picker.Date',
    'Ext.calendar.util.Date',
    'Ext.calendar.CalendarPanel',
    'Ext.calendar.data.MemoryCalendarStore',
    'Ext.calendar.data.MemoryEventStore',
    'Ext.calendar.data.Events',
    'Ext.calendar.data.Calendars',
    'Ext.calendar.form.EventWindow'*/
]);


Ext.define('Aenis.view.main.calendar.Manage', {
    extend: 'Ext.container.Container',
    alias: 'widget.mainCalendarManage',

    mixins: [
        'Locale.hy_AM.Common',
        'Locale.hy_AM.main.calendar.Manage',
        'BestSoft.mixin.Localized',
        'BestSoft.mixin.StyleSheetLoader'
    ],

    /*styleSheets: [
        'main/calendar/calendar.css',
        'main/calendar/examples.css'
    ],*/

    initComponent: function(app) {

        /*this.calendarStore = Ext.create('Ext.calendar.data.MemoryCalendarStore', {
            data: Ext.calendar.data.Calendars.getData()
        });


        this.eventStore = Ext.create('Ext.calendar.data.MemoryEventStore', {
            data: Ext.calendar.data.Events.getData()
        });*/

        Ext.apply(this, {
            tabConfig: {
                title: this.T("calendar")
            },
            items:[
                /*{
                    region: 'west',
                    xtype: 'datepicker',
                    ref:'calendarPicker',

                    id: 'app-nav-picker',
                    cls: 'ext-cal-nav-picker'
                },
                {
                    region: 'center',
                    title: this.T("event_diagram"),
                    xtype: 'calendarpanel',
                    eventStore: Ext.create('Ext.data.ArrayStore', {}),
                    calendarStore: Ext.create('Ext.data.ArrayStore', {})
                }*/
            ]
        });

        this.callParent(arguments);
    }

});
