Ext.define('Locale.hy_AM.main.App', {

    constructor: function() {
        var currentYear = Ext.Date.format(new Date(), 'Y');
        Ext.applyIf(this.translations["hy_AM"], {
            'copyright': '&copy; Բեսթ Սոֆթ '+((2013 == currentYear) ? '2013' : '2013-'+currentYear),
            'bs_homepage_url': 'http://www.bestsoft.am',
            'app_title': 'AENIS',
            'app_version': 'AENIS {0}',
            'app_version_tip': 'AENIS {0} / Ext JS {1}.{2}.{3}',
            'session_expired': 'Աշխատանքային սեսիան ավարտվել է',
            'exception': 'Սխալ',
            'exception_info': "<b><pre>{1}::{2}</pre></b><div>{0}</div>"
        });
    }
});
