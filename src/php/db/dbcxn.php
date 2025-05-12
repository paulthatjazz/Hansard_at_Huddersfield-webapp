<?php
/*
 * Static object to access the DB.
 * Taken from David Sklar & Adam Trachtenberg: PHP Cookbook, 2nd ed., O'Reilly & Assc., 2006
 * Recipe 10.15
 */
class DBCxn {
   // What DSN to connect to?
   public static $dsn = 'pgsql:host=db;port=5432';
   public static $driverOpts = NULL;

   //turn off search recording, recommended False in test environment
   public static $analytics = True;

    // Internal variable to hold the connection
    private static $db;
    // No cloning or instantiating allowed
    private function __construct() { }
    private function __clone() { }

    public static function get($database_name) {
      $dsn_new = self::$dsn . ';dbname=' . $database_name;
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
