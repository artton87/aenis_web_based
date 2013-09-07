Ext.define('Aenis.model.main.Vehicle', {
    extend: 'Ext.data.Model',

    idProperty: "id",

    fields: [
        {type: 'int', name: 'id'},
        {type: 'string', name: 'vin'},//W0I0JBF19W1343711
        {type: 'string', name: 'body_number'},//???
        {type: 'string', name: 'body_type'},//ՍԵԴԱՆ
        {type: 'string', name: 'brand'},//???
        {type: 'string', name: 'chassis_number'},
        {type: 'string', name: 'color'},//ԿԱՆԱՉ ԲԱՑ ԿԱՆԱՉ ՄԵՏԱԼԻԿ
        {type: 'int', name: 'engine_number'},//3873980
        {type: 'int', name: 'engine_power'},//50
        {type: 'string', name: 'model'},// VAZ 2106
        {type: 'int', name: 'model_year'},// 1979
        {type: 'string', name: 'number'},//25 LL 250
        {type: 'string', name: 'type'},//ԹԵԹԵՎ ՄԱՐԴԱՏԱՐ
        {type: 'string', name: 'owner'}//Պողոս Պողոսյան
    ],

    /**
     * Returns human-readable name of vehicle
     * @return {String}
     */
    getName: function() {
        return this.get('number')+' '+this.get('color')+' '+this.get('body_type')+' '+this.get('type')+' '+this.get('model')+' '+this.get('model_year');
    },


    proxy: {
        type: 'ajax',
        actionMethods: {
            read: 'POST'
        },
        api: {
            read: 'main/vehicle/vehicles.json.php'
        },
        reader: {
            type: 'json',
            root: 'data',
            totalProperty: 'total'
        }
    }
});
