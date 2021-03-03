<?php
include_once 'dbcxn.php';

class query_handler {

	// query the database, binding one parameter
  public static function query_no_parameters($sqli, $database_name) {
 		try {
 			 $db = DBCxn::get($database_name);
       
 			 $ret = $db->query($sqli, PDO::FETCH_NUM);
 			 if($ret == false) {
 					$error = $db->errorInfo();
 					print "Problem in query(): {$error[2]}";
 					throw new Exception();
 			 }

 			 $rows = $ret->fetchAll(PDO::FETCH_ASSOC);
 			 if($rows == null) return null;

 			 return $rows;
 		}
 		catch(PDOException $e) {
 			 echo $e->getMessage();
 			 $myerror = true;
 		}
 		catch(Exception $ex) {
 			 $myerror = true;
 		}
  }

  // query the database, binding n parameters
  public static function query_w_parameters($sqli, $arr, $database_name) {
 		try {
 			 $db = DBCxn::get($database_name);

 			 $stmt = $db->prepare($sqli);
 			 if($stmt == false) {
 					$error = $db->errorInfo();
 					print "Problem in prepare(): {$error[2]}";
 					throw new Exception();
 			 }

 			 $ret = $stmt->execute($arr);
 			 if($ret == false) {
 					$error = $db->errorInfo();
 					print "Problem in execute(): {$error[2]}";
 					throw new Exception();
 			 }

 			 $rows = $stmt->fetchAll();
 			 if($rows == null) return null;

 			 return $rows;
 		}
 		catch(PDOException $e) {
 			 echo $e->getMessage();
 			 $myerror = true;
 		}
 		catch(Exception $ex) {
 			 $myerror = true;
 		}
  }




  // getting PID
  public static function gettingPID($database_name) {
  
   try {
   
      $db = DBCxn::get($database_name);
      $pid = $db->query('SELECT pg_backend_pid();');
      $row = $pid->fetchAll();

      return $row[0]['pg_backend_pid'];

   }catch(PDOException $e) {
      echo $e->getMessage();
   }

  }

    // killing PID
    public static function killingPID($database_name, $pdi) {
  
      try {
      
         $db = DBCxn::get($database_name);
		 $pid = $db->query('SELECT pg_cancel_backend('.$pdi.');');
		 $row = $pid->fetchAll();
   
         return true;
   
      }catch(PDOException $e) {
         echo $e->getMessage();
         return false;
      }
   
     }


}
?>
