Ext.define('Aenis.model.main.user.GridItem', {
	extend: 'Ext.data.Model',

    requires: [
        'Aenis.model.main.user.Resource',
        'Aenis.model.main.user.Staff'
    ],
    
	idProperty: 'id',
	fields: [
        {name: 'id', type: 'int', useNull: true},
        {name: 'username', type: 'string'},
        {name: 'email', type: 'string'},
        {name: 'fax_number', type: 'string'},
        {name: 'phone', type: 'string'},
        {name: 'is_ws_consumer', type: 'boolean'},
        {name: 'has_position', type: 'boolean'},
        {name: 'lang_id', type: 'int'},
        {name: 'first_name', type: 'string'},
        {name: 'last_name', type: 'string'},
        {name: 'second_name', type: 'string'},
        {name: 'user_full_name', type: 'auto', persist: false, convert: function(v, record) {
            return record.getFullName();
        }}
    ],
    
    hasMany:[
        {
            foreignKey: 'user_id',
            associationKey: 'resources',
            model: 'Aenis.model.main.user.Resource',
            name: 'resources'
        },
        {
            foreignKey: 'user_id',
            associationKey: 'staffs',
            model: 'Aenis.model.main.user.Staff',
            name: 'staffs'
        }
    ],
    
    proxy: {
        type: 'ajax',
        extraParams: {
            default_language_only: 1,
            merge_content_data: 1
        },

        reader: {
            type: 'json',
            root: 'data'
        },

        api: {
            read: 'main/user/users.json.php'
        }
    },


    /**
     * Returns full name
     */
    getFullName: function() {
        var name = [
            this.get('first_name')
        ];
        var sName = this.get('second_name');
        if(!Ext.isEmpty(sName))
            name.push(sName);
        name.push(this.get('last_name'));
        return name.join(" ");
    },


    /**
     * Returns name with initials
     */
    getInitialsName: function() {
        var name = '';
        var nameInitialParts = [this.get('first_name'), this.get('second_name')];
        for(var i=0; i<nameInitialParts.length; ++i)
        {
            var initial = '';
            if(nameInitialParts[i].length>1)
            {
                initial = nameInitialParts[i].substr(0, 2).toUpperCase();
                if(initial === 'ՈՒ')
                {
                    initial = 'Ու';
                }
                else
                {
                    initial = initial.substr(0, 1);
                }
            }
            else if(nameInitialParts[i].length>0)
            {
                initial = nameInitialParts[i].substr(0, 2).toUpperCase();
            }

            if('' !== initial)
            {
                name += initial+". ";
            }
        }

        name += this.get('last_name');
        return name;
    }
});
