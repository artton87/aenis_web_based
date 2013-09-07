Ext.define('Aenis.model.workflow.transaction.Property', {
    extend: 'Ext.data.Model',
    requires: [
        'Aenis.model.workflow.transaction.property.type.Value'
    ],

    idProperty: 'id',

    fields: [
        {name: 'id', type: 'int'},
        {name: 'tr_id', type: 'int'},
        {name: 'label', type: 'string', persist: false},
        {name: 'value', type: 'auto'},
        {name: 'type', type: 'string', persist: false}
    ],

    hasMany:[
        {
            foreignKey: 'tr_property_type_id',
            associationKey: 'typeValues',
            name: 'typeValues',
            model: 'Aenis.model.workflow.transaction.property.type.Value'
        }
    ],


    /**
     * Returns display value of this property
     */
    getDisplayValue: function() {
        var val = this.get('value');
        var type = this.get('type');
        if(type == 'enum')
        {
            var valuesStore = this.typeValues();
            if(valuesStore.isLoaded())
            {
                var valueModel = valuesStore.getById(parseInt(val));
                if(valueModel)
                    return valueModel.get('label');
            }
        }
        return val;
    }
});
