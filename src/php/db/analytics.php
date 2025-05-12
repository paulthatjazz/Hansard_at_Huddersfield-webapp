<?php

    include_once 'query_handler.php';
    include_once 'dbcxn.php';

    class analytics extends query_handler
    {

        private function createUpdateRecord($id, $adv, $dateFrom, $dateTo, $house, $terms, $members, $descriptions){

            if($adv == TRUE){
                $type = "true";
            }else{
                $type = "false";
            }

            if(strlen($dateTo) == 4){
                $dateFrom .= "-01-01";
                $dateTo .= "-12-31";
            }
            
            $sql = "INSERT INTO hansard_analytics.search (id, searchdate, hit, type, datefrom, dateto, house, term, member, description) VALUES "
            . "('" . $id . "', NOW(), 0, " . $type . ",'" . $dateFrom . "'::DATE, '" . $dateTo . "'::DATE, '" . $house . "', " . $terms . "," . $members . "," . $descriptions . ") "
            . "ON CONFLICT (id) DO UPDATE SET type = '" . $type . "', house = '" . $house . "', datefrom = '" . $dateFrom . "'::DATE, dateto = '" . $dateTo . "'::DATE, "
            . "term = " . $terms . ", member = " . $members . ", description = " . $descriptions
            . " WHERE search.id = '" . $id . "'";
            

            $r = query_handler::query_no_parameters($sql, "hansard");
        }

        private function recordSingleQuery($paras, $dateFrom, $dateTo, $house, $adv){
            
            $sessionId = $paras["sessionId"];

            if(strlen($dateTo) == 4){
                $dateFrom .= "-01-01";
                $dateTo .= "-12-31";
            }

            $sql = "INSERT INTO hansard_analytics.query (id, datefrom, dateto, term, member, description, searchdate, house) VALUES "
            . "( '" . $sessionId . "','" . $dateFrom . "'::DATE, '" . $dateTo . "'::DATE, ";

            if($paras["term"] == ""){
                $sql .= " NULL, ";
            }else{
                $sql .= " '" . $paras["term"] . "',";
            }

            if($adv == TRUE){
                if($paras["member"] == ""){
                    $sql .= " NULL, ";
                }else{
                    $sql .= " '" . $paras["member"] . "',";
                }

                if($paras["description"] == ""){
                    $sql .= " NULL, ";
                }else{
                    $sql .= " '" . $paras["description"] . "',";
                }
            }else{
                $sql .= " NULL, NULL, ";
            }

            $sql .= " NOW(), '" . $house . "') ";

            $r = query_handler::query_no_parameters($sql, "hansard");

        }

        public static function recordQuery($paras, $adv, $dateFrom, $dateTo, $house){

            if(DBCxn::$analytics == False){
                return;
            }

            $searchId = $paras[0]["searchId"];

            $terms = "ARRAY[";
            $members = "ARRAY[";
            $descriptions = "ARRAY[";

            foreach($paras as $row){

                self::recordSingleQuery($row, $dateFrom, $dateTo, $house, $adv);
                
                if($row["term"] == ""){
                    $terms .= "NULL,";
                }else{
                    $terms .= "'" . $row["term"] . "',";
                }
                if($adv == TRUE){
                    if($row["member"] == ""){
                        $members .= "NULL,";
                    }else{
                        $members .= "'" . $row["member"] . "',";
                    }
                    if($row["description"] == ""){
                        $descriptions .= "NULL,";
                    }else{
                        $descriptions .= "'" . $row["description"] . "',";
                    }
                }else{
                    $members .= "NULL,";
                    $descriptions .= "NULL,";
                }
            }

            $terms = substr($terms, 0, -1) . "]";
            $members = substr($members, 0, -1) . "]";
            $descriptions = substr($descriptions, 0, -1) . "]";

            
            self::createUpdateRecord($searchId, $adv, $dateFrom, $dateTo, $house, $terms, $members, $descriptions);

            return;
        }

        public static function getQueryData($id){

            $sql = "select "
            . "type as advanced,"
            . "dateto,"
            . "datefrom,"
            . "house,"
            
            . "term[1] as q1_term,"
            . "member[1] as q1_member,"
            . "description[1] as q1_description,"
            
            . "term[2] as q2_term,"
            . "member[2] as q2_member,"
            . "description[2] as q2_description,"
            
            
            . "term[3] as q3_term,"
            . "member[3] as q3_member,"
            . "description[3] as q3_description,"
            
            
            . "term[4] as q4_term,"
            . "member[4] as q4_member,"
            . "description[4] as q4_description "
            
            . "from hansard_analytics.search WHERE id = '" . $id . "'";

            $r = query_handler::query_no_parameters($sql, "hansard");

            return $r;
        }

    }

?>