<?php
/**
 * @author Best Soft
 * @package aenis\docmgmt
 */

 
require_once(LIBRARY_PATH.'tcpdf/tcpdf.php');
require_once(LIBRARY_PATH.'tcpdf/config/lang/arm.php');

/**
 * Methods for working with templates
 * @author BestSoft
 * @package aenis\docmgmt
 */
class Template_TCPDF extends TCPDF
{
	public function Header() {}
		
	public function Footer() {}

	public static function getTCPDFObject($pdf_title)
	{
		// create new PDF document
		$pdf = new self('P', 'mm', 'A4', true, 'UTF-8', false);

		// set document information
		$pdf->SetCreator(PDF_CREATOR);
		$pdf->SetAuthor('BEST SOFT');

		//set margins
		$pdf->SetMargins(PDF_MARGIN_LEFT, PDF_MARGIN_TOP, PDF_MARGIN_RIGHT);
		$pdf->SetHeaderMargin(0);
		$pdf->SetFooterMargin(0);

		//set image scale factor
		$pdf->setImageScale(PDF_IMAGE_SCALE_RATIO);

		// cache for fonts
		$pdf->setFontSubsetting(true);

		//set some language-dependent strings
		//$pdf->setLanguageArray($l);

		// Set font
		// dejavusans is a UTF-8 Unicode font, if you only need to
		// print standard ASCII chars, you can use core fonts like
		// helvetica or times to reduce file size.
		$pdf->SetFont('dejavusans', '', 10, '', true);
		
		$pdf->SetTitle($pdf_title);
		return $pdf;
	}
}
