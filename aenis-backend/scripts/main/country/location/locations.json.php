<?php
user_auth_check();

$oLanguages = new Languages();
$lang_ids = array($oLanguages->getDefaultLanguage()->id);

$oCountries = new Countries();
$country_id = $oCountries->getDefaultCountry()->id;

$cache_id = 'locations';
if(false === ($items = App_Cache()->get($cache_id, true, true)))
{
	$items = array();

	$oRegions = new Country_Regions();
	$resultRegions = $oRegions->getRegions(array('country_id'=>$country_id), $lang_ids);
	while($rowRegions = $oRegions->db_fetch_array($resultRegions))
	{
		$regionItem = array(
			'region_id' => $rowRegions['id'],
			'name' => $rowRegions['name'],
			'data' => array()
		);
		$oCommunities = new Country_Region_Communities();
		$resultCommunities = $oCommunities->getCommunities(array('region_id'=>$rowRegions['id']), $lang_ids);
		while($rowCommunities = $oCommunities->db_fetch_array($resultCommunities))
		{
			$communityItem = array(
				'community_id' => $rowCommunities['id'],
				'name' => $rowCommunities['name'],
				'leaf' => true
			);
			$regionItem['data'][] = $communityItem;
		}

		$items[] = $regionItem;
	}

	App_Cache()->set($cache_id, $items, null, array(
		Countries::CACHE_TAG,
		Country_Regions::CACHE_TAG,
		Country_Region_Communities::CACHE_TAG
	), true);
}

Ext::sendResponse(true, array(
	'data' => $items
));
