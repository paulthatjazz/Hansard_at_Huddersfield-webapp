<?php 

    include_once 'query_handler.php';
    include_once './convert_data.php';

    class search extends query_handler
    {
        //a class containing an encapsulation of methods for search queries on the database
        public static function contribution($dateFrom, $dateTo, $term, $house, $kwic, $count, $offset, $sort, $order, $limit, $context){
            //basic contribution

            
            $termdata = convert_data::prepareTerm($term);
            

            if($kwic == "contribution-kwic" || $kwic == "contribution-kwic_nonRank")
            {
                $contributiontext = "ts_headline('simple',contributiontext,q, 'StartSel=<b>, StopSel=</b>, HighlightAll=TRUE') as contributiontext";
            } 
            else 
            {
                $contributiontext = "contributiontext";
            }


            $sql = "SELECT * FROM (";
            if($house == "commons" || $house == "both")
            {
                $sql .= " ( "
                . "SELECT id, href as url, " . $contributiontext . ", sittingday, 'commons' as house, ts_rank(idxfti_simple, q) AS relevance, description, member "
                . "FROM hansard_commons.commons, to_tsquery('simple', '" . $termdata->tsterm . "') as q "
                . "WHERE "
                . "sittingday BETWEEN '" . $dateFrom . "'::DATE AND '" . $dateTo . "'::DATE "
                . "AND idxfti_simple @@ q "
                . " ) ";
            }
            if($house == "both"){
                $sql .= " UNION ";
            }
            if($house == "lords" || $house == "both"){
               $sql .= " ( "
                . "SELECT id, href as url, " . $contributiontext . ", sittingday, 'lords' as house, ts_rank(idxfti_simple, q) AS relevance, description, member "
                . "FROM hansard_lords.lords, to_tsquery('simple', '" . $termdata->tsterm . "') as q "
                . "WHERE "
                . "sittingday BETWEEN '" . $dateFrom . "'::DATE AND '" . $dateTo . "'::DATE "
                . "AND idxfti_simple @@ q "
                . " ) "; 
            
            }
            $sql .= ") c ";

            $sql2 = $sql . ";";

            $sql .= " ORDER BY c." . $sort . " " . $order . " LIMIT " . $limit . " OFFSET " . $offset . ";";



            $total = self::contributionTotal($sql2, $count, $offset);
            
            $rows = self::query_no_parameters($sql, "dbname=hansard");

            if ($kwic == "contribution" || $kwic == "contribution_nonRank") 
            {
                $var = convert_data::gen_json_documents($rows, $termdata->tsterm, $total);
            } 
            else  if ($kwic == "contribution-kwic" || $kwic == "contribution-kwic_nonRank") 
            {
                $var = convert_data::gen_json_kwic($rows, $termdata->tsterm, $total, $offset, $context);
            }

            return $var;
        }

        private function contributionTotal($sql, $count, $offset){

            if($count = 0 && $offset == 0)
            {
                $total[] = array("count" => "total");
            }
            else if($count = 0 && $offset != 0)
            {
                $total[] = array("count" => $count);
            }else{
                $sql = str_replace("*", "count(*)", $sql);
                $total = query_handler::query_no_parameters($sql, "dbname=hansard");
            }

            return $total;

        }

        private function generateQuery($house, $term, $dateFrom, $dateTo){

            $r = " ( SELECT freq, y.myear, total FROM";
            //if($term->n == 1){
                $r .=  " ( "
                . " SELECT sum(sw.hits) as freq, sw.year as myear FROM hansard_" . $house . "_single_word_year sw "
                . " WHERE sw.word like '" . $term->cleanterm . "' "
                . " AND sw.year BETWEEN '" . $dateFrom . "' AND '" . $dateTo . "' "
                . " GROUP BY sw.year ) x "
                . " JOIN (SELECT year as myear, total FROM hansard_" . $house . "_total_word_year) as y ON y.myear = x.myear "
                . " ) ";
            /*}else{
                $r .= "";
            }*/

            return $r;
        }

        public static function distribution($paras, $house, $dateFrom, $dateTo){
            
            $i = 0;
            
            foreach($paras as $value)
            {
                $termdata = convert_data::prepareTerm($value["term"]);

                $sql = "SELECT sum(freq) as frequency, sum(total) as total, myear FROM ( ";
                if($house != "lords"){
                    $sql .= self::generateQuery("commons", $termdata, $dateFrom, $dateTo);
                }
                if($house == "both"){
                     $sql .= " UNION ";
                }
                if($house != "commons"){
                    $sql .= self::generateQuery("lords", $termdata, $dateFrom, $dateTo);
                }
                $sql .= ") i GROUP BY myear ORDER BY myear asc";

                $rows[$i] = self::query_no_parameters($sql, "dbname=hansard");
                $i++;
            }

            return $rows;
        }

    }

?>