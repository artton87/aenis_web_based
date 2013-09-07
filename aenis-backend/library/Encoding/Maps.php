<?php
/**
 * Character maps definition
 * @package arpis-jace\library
 */

/**
 * Character maps definitions
 * @author BestSoft
 * @package arpis-jace\library
 */
class Encoding_Maps
{
	/**
	 * Character convertion map for armascii-unicode conversion
	 * @static
	 * @access public
	 * @var array
	 */
	public static $ARMASCII_UTF8 = array(
		0x00B2 => 'Ա',
		0x00B4 => 'Բ',
		0x00B6 => 'Գ',
		0x00B8 => 'Դ',
		0x00BA => 'Ե',
		0x00BC => 'Զ',
		0x00BE => 'Է',
		0x00C0 => 'Ը',
		0x00C2 => 'Թ',
		0x00C4 => 'Ժ',
		0x00C6 => 'Ի',
		0x00C8 => 'Լ',
		0x00CA => 'Խ',
		0x00CC => 'Ծ',
		0x00CE => 'Կ',
		0x00D0 => 'Հ',
		0x00D2 => 'Ձ',
		0x00D4 => 'Ղ',
		0x00D6 => 'Ճ',
		0x00D8 => 'Մ',
		0x00DA => 'Յ',
		0x00DC => 'Ն',
		0x00DE => 'Շ',
		0x00E0 => 'Ո',
		0x00E2 => 'Չ',
		0x00E4 => 'Պ',
		0x00E6 => 'Ջ',
		0x00E8 => 'Ռ',
		0x00EA => 'Ս',
		0x00EC => 'Վ',
		0x00EE => 'Տ',
		0x00F0 => 'Ր',
		0x00F2 => 'Ց',
		0x00F4 => 'Ւ',
		0x00F6 => 'Փ',
		0x00F8 => 'Ք',
		0x00FA => 'Օ',
		0x00FC => 'Ֆ',

		0x00B3 => 'ա',
		0x00B5 => 'բ',
		0x00B7 => 'գ',
		0x00B9 => 'դ',
		0x00BB => 'ե',
		0x00BD => 'զ',
		0x00BF => 'է',
		0x00C1 => 'ը',
		0x00C3 => 'թ',
		0x00C5 => 'ժ',
		0x00C7 => 'ի',
		0x00C9 => 'լ',
		0x00CB => 'խ',
		0x00CD => 'ծ',
		0x00CF => 'կ',
		0x00D1 => 'հ',
		0x00D3 => 'ձ',
		0x00D5 => 'ղ',
		0x00D7 => 'ճ',
		0x00D9 => 'մ',
		0x00DB => 'յ',
		0x00DD => 'ն',
		0x00DF => 'շ',
		0x00E1 => 'ո',
		0x00E3 => 'չ',
		0x00E5 => 'պ',
		0x00E7 => 'ջ',
		0x00E9 => 'ռ',
		0x00EB => 'ս',
		0x00ED => 'վ',
		0x00EF => 'տ',
		0x00F1 => 'ր',
		0x00F3 => 'ց',
		0x00F5 => 'ւ' ,
		0x00F7 => 'փ',
		0x00F9 => 'ք',
		0x00FB => 'օ',
		0x00FD => 'ֆ',
		0x00A8 => 'և',
		0x00A3 => ':',
		0x00B0 => '՛',
		0x00AF => '՜',
		0x00AA => '՝',
		0x00B1 => '՞',
		0x00AD => '՟',
		0x00A7 => 'ՙ',
		0x00A6 => '՚'
	);
	
	
	/**
	 * Character convertion map for unicode-armascii conversion
	 * @static
	 * @access public
	 * @var array
	 */
	public static $UTF8_ARMASCII = array(
		'Ա' => 0x00B2,
		'Բ' => 0x00B4,
		'Գ' => 0x00B6,
		'Դ' => 0x00B8,
		'Ե' => 0x00BA,
		'Զ' => 0x00BC,
		'Է' => 0x00BE,
		'Ը' => 0x00C0,
		'Թ' => 0x00C2,
		'Ժ' => 0x00C4,
		'Ի' => 0x00C6,
		'Լ' => 0x00C8,
		'Խ' => 0x00CA,
		'Ծ' => 0x00CC,
		'Կ' => 0x00CE,
		'Հ' => 0x00D0,
		'Ձ' => 0x00D2,
		'Ղ' => 0x00D4,
		'Ճ' => 0x00D6,
		'Մ' => 0x00D8,
		'Յ' => 0x00DA,
		'Ն' => 0x00DC,
		'Շ' => 0x00DE,
		'Ո' => 0x00E0,
		'Չ' => 0x00E2,
		'Պ' => 0x00E4,
		'Ջ' => 0x00E6,
		'Ռ' => 0x00E8,
		'Ս' => 0x00EA,
		'Վ' => 0x00EC,
		'Տ' => 0x00EE,
		'Ր' => 0x00F0,
		'Ց' => 0x00F2,
		'Ւ' => 0x00F4,
		'Փ' => 0x00F6,
		'Ք' => 0x00F8,
		'Օ' => 0x00FA,
		'Ֆ' => 0x00FC,
		             
		'ա' => 0x00B3,
		'բ' => 0x00B5,
		'գ' => 0x00B7,
		'դ' => 0x00B9,
		'ե' => 0x00BB,
		'զ' => 0x00BD,
		'է' => 0x00BF,
		'ը' => 0x00C1,
		'թ' => 0x00C3,
		'ժ' => 0x00C5,
		'ի' => 0x00C7,
		'լ' => 0x00C9,
		'խ' => 0x00CB,
		'ծ' => 0x00CD,
		'կ' => 0x00CF,
		'հ' => 0x00D1,
		'ձ' => 0x00D3,
		'ղ' => 0x00D5,
		'ճ' => 0x00D7,
		'մ' => 0x00D9,
		'յ' => 0x00DB,
		'ն' => 0x00DD,
		'շ' => 0x00DF,
		'ո' => 0x00E1,
		'չ' => 0x00E3,
		'պ' => 0x00E5,
		'ջ' => 0x00E7,
		'ռ' => 0x00E9,
		'ս' => 0x00EB,
		'վ' => 0x00ED,
		'տ' => 0x00EF,
		'ր' => 0x00F1,
		'ց' => 0x00F3,
		'ւ' => 0x00F5,
		'փ' => 0x00F7,
		'ք' => 0x00F9,
		'օ' => 0x00FB,
		'ֆ' => 0x00FD,
		'և' => 0x00A8,
		':' => 0x00A3,
		'՛' => 0x00B0,
		'՜' => 0x00AF,
		'՝' => 0x00AA,
		'՞' => 0x00B1,
		'՟' => 0x00AD,
		'ՙ' => 0x00A7,
		'՚' => 0x00A6
	);
}