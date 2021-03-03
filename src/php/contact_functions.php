<?php

    header('Content-Type: text/html;charset=utf-8');
    session_start(); 
       
    if(isset($_SESSION['feedback-send'])){

        if(!$_SESSION['feedback-send']){
          echo "feedback-already-send";
        } 

    }

    else if($_GET['action'] == "feedback") {

    $msg = $_GET['message'];
    $email = $_GET['email'];
    $name = $_GET['name'];

    $text= 
        "<b>Name:</b> ".$name."<br>".
        "<b>Email address:</b> ".$email."<br>".
        "<b>Message:</b><br> ".$msg;

    // use wordwrap() if lines are longer than 70 characters
    $text = wordwrap($text,70);

    $headers = "MIME-Version: 1.0\r\n";
    $headers.= "Content-Type: text/html\r\n";

    $success =  mail("hansard@hud.ac.uk","Hansard website - Feedback",$text, $headers);
    if (!$success) {
        print_r(error_get_last()['message']);
    }
    else{
        $_SESSION["feedback-send"] = True;
        echo "ok";

    }


    
}