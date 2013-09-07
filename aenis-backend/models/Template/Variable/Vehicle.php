<?php
/**
 * Template variable for vehicle
 * @package aenis
 */


/**
 * Variable for vehicle
 * @author BestSoft
 * @package aenis\docmgmt
 */
class Template_Variable_Vehicle extends Template_Variable_Abstract_Object implements Template_IVariable
{
    /**
	 * Returns information about parameters the variable can accept
	 * @return Template_Variable_Argument[]    An array of Template_Variable_Argument type objects
	 */
	public function getParameters()
	{
		$arg = new Template_Variable_Argument;
		$arg->name = 'property';
		$arg->display_name = 'Տվյալի անվանում';
		$arg->is_required = true;
		$arg->values = array(
			new Template_Variable_Argument_Value('body_number', 'թափքի համարը'),
			new Template_Variable_Argument_Value('body_type', 'թափքի տեսակը'),
			new Template_Variable_Argument_Value('brand', 'մակնիշը'),
			new Template_Variable_Argument_Value('chassis_number', 'հենասարքի համարը'),
			new Template_Variable_Argument_Value('color', 'գույնը'),
			new Template_Variable_Argument_Value('engine_number', 'շարժիչի համարը'),
			new Template_Variable_Argument_Value('engine_power', 'շարժիչի հզորությունը'),
			new Template_Variable_Argument_Value('model', 'տիպարը'),
			new Template_Variable_Argument_Value('model_year', 'թողարկման տարեթիվը'),
			new Template_Variable_Argument_Value('number', 'հաշվառման համարանիշ'),
			new Template_Variable_Argument_Value('type', 'ՏՄ տեսակը'),
			new Template_Variable_Argument_Value('vin', 'նույնացման համարը')
		);
		return array($arg);
	}
}
