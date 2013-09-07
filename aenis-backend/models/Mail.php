<?php

class Mail
{
    /**
     * sends mail to given e-mail address
     * @param $to
     * @param $from
     * @param $subject
     * @param $body
     * @param array $attachment
     * @return bool
     */
    public function sendMail($to, $from, $subject, $body, $attachment = array())
     {

        $mailer = new PHPMailer();
        $mailer->AddAddress($to);
        $mailer->AddReplyTo($from);
        $mailer->SetFrom($from, 'enotary.am');
        $mailer->IsHTML();
        $mailer->Subject = $subject;
        if (!empty($attachment))
            $mailer->AddAttachment($attachment['full_path'], $attachment['name']);
        $mailer->Body = $body;
        return $mailer->Send();
    }
}

