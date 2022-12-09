<?php
/*
 * Static object to access the DB.
 * Taken from David Sklar & Adam Trachtenberg: PHP Cookbook, 2nd ed., O'Reilly & Assc., 2006
 * Recipe 10.15
 */
class DBCxn {
   // What DSN to connect to?
   public static $dsn = 'pgsql:host=localhost;port=5432';
   public static $driverOpts = array(
      PDO::MYSQL_ATTR_INIT_COMMAND => 'SET NAMES utf8',
   );

   //turn off search recording, recommended False in test environment
   public static $analytics = True;

    // Internal variable to hold the connection
    private static $db;
    // No cloning or instantiating allowed
    final private function __construct() { }
    final private function __clone() { }

    public static function get($database_name) {
      $dsn_new=self::$dsn.$database_name;
      try {
        // Connect if not already connected
           if (is_null(self::$db)) {
              $parsed_ini = parse_ini_file("dbconfig.ini");
              self::$db = new PDO($dsn_new, $parsed_ini['user'], $parsed_ini['password'],
                                self::$driverOpts);
              self::$db->setAttribute(PDO::ATTR_ERRMODE, PDO::ERRMODE_EXCEPTION);
           }
    	}
        catch (PDOException $e) {
            print "Error!: " . $e->getMessage() . "<br/>";
            die();
        }
        // Return the connection
        return self::$db;
    }
}
