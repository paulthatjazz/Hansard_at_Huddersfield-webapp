<?php 

    include_once 'query_handler.php';
    include_once './convert_data.php';

    class search extends query_handler
    {
        //a class containing an encapsulation of methods for search queries on the database
        public static function contribution($dateFrom, $dateTo, $term, $house, $kwic, $count, $offset, $sort, $order, $limit, $context){
            //basic contribution

            
            $termdata = convert_data::prepareTerm($term);


            $sql = "SELECT * FROM (";
            if($house != "lords")
            {
                $sql .= self::generateContributionQuery("commons", $termdata, $dateFrom, $dateTo, $kwic);
            }
            if($house == "both")
            {
                $sql .= " UNION ";
            }
            if($house != "commons")
            {
                $sql .= self::generateContributionQuery("lords", $termdata, $dateFrom, $dateTo, $kwic);
            
            }
            $sql .= ") c ";

            $sql2 = $sql . ";";

            $sql .= " ORDER BY c." . $sort . " " . $order . " LIMIT " . $limit . " OFFSET " . $offset . ";";



            $total = self::contributionTotal($count, $offset, $house, $termdata, $dateFrom, $dateTo);
            
            $rows = self::query_no_parameters($sql, "dbname=hansard");

            if ($kwic == "contribution" || $kwic == "contribution_nonRank") 
            {
                $var = convert_data::gen_json_documents($rows, $termdata->cleanterm, $total);
            } 
            else  if ($kwic == "contribution-kwic" || $kwic == "contribution-kwic_nonRank") 
            {
                $var = convert_data::gen_json_kwic($rows, $termdata->cleanterm, $total, $offset, $context);
            }

            return $var;
        }

        private function contributionTotal($count, $offset, $house, $term, $dateFrom, $dateTo){

            if ($count == 0 && $offset == 0) {
                $total[] = array("count" => "total");
              } else if ($count == 0 && $offset != 0) {
                $total[] = array("count" => $count);
              } else {
                
                
                $sql = "SELECT count(*) FROM ";
                if($house == "both"){
                    $sql .= "
                    (
                        (  
                            SELECT id FROM 
                            hansard_commons.commons, to_tsquery('simple', '" . $term->tsterm . "') as q
                            WHERE
                            sittingday BETWEEN '" . $dateFrom . "'::DATE AND '" . $dateTo . "'::DATE  
                            and idxfti_simple @@ q
                        )
                        UNION
                        (  
                            SELECT id FROM 
                            hansard_lords.lords, to_tsquery('simple', '" . $term->tsterm . "') as q
                            WHERE
                            sittingday BETWEEN '" . $dateFrom . "'::DATE AND '" . $dateTo . "'::DATE  
                            and idxfti_simple @@ q
                        )
                    ) x ";
                }else{
                    $sql .= "hansard_" . $house . "." . $house . ", to_tsquery('simple','" . $term->tsterm . "') as q "
                    . "WHERE "
                    . "sittingday BETWEEN '" . $dateFrom . "'::DATE AND '" . $dateTo . "'::DATE "
                    . "and idxfti_simple @@ q ";
                }
                
                $total = query_handler::query_no_parameters($sql, "dbname=hansard");
              }

            return $total;

        }

        private function generateContributionQuery($house, $term, $dateFrom, $dateTo, $kwic){

            if($kwic == "contribution-kwic" || $kwic == "contribution-kwic_nonRank")
            {
                $contributiontext = "ts_headline('simple',contributiontext,q, 'StartSel=<b>, StopSel=</b>, HighlightAll=TRUE') as contributiontext";
            } 
            else 
            {
                $contributiontext = "contributiontext";
            }

            $r = " ( "
                . " SELECT id, href as url, " . $contributiontext . ", sittingday, '" . ucfirst($house) . "' as source, ts_rank(idxfti_simple, q) AS relevance, description, member "
                . " FROM hansard_" . $house . ". " . $house . ", to_tsquery('simple', '" . $term->tsterm . "') as q "
                . " WHERE "
                . " sittingday BETWEEN '" . $dateFrom . "'::DATE AND '" . $dateTo . "'::DATE "
                . " AND idxfti_simple @@ q "
                . " ) ";

            return $r;
        }

        private function generateDistributionQuery($house, $term, $dateFrom, $dateTo){

            //generates a query based on search type (multi-word or single) and specific house


            
            if($term->n == 1){

                if(strlen($dateTo) != 4){
                    $dateFrom = substr($dateFrom, 0, -6);
                    $dateTo = substr($dateTo, 0, -6);
                }

                $r = " ( " 
                . " SELECT freq, y.myear, total FROM"
                . " ( "
                . " SELECT sum(sw.hits) as freq, sw.year as myear FROM hansard_" . $house . "_single_word_year sw "
                . " WHERE sw.word like '" . $term->cleanterm . "' "
                . " AND sw.year BETWEEN '" . $dateFrom . "' AND '" . $dateTo . "' "
                . " GROUP BY sw.year ) x "
                . " JOIN (SELECT year as myear, total FROM hansard_" . $house . "_total_word_year) as y ON y.myear = x.myear "
                . " ) ";
            }else{

                if(strlen($dateTo) == 4){
                    $dateFrom .= "-01-01";
                    $dateTo .= "-12-31";
                }

                $r = " ( "
                . " SELECT z.myear, freq, total FROM ( "
                . " SELECT y.myear, sum(y.hits) as freq FROM ("
                . " SELECT x.myear, count(x.matches) as hits FROM ( "
                . " SELECT sq.myear, sq.contributiontext, regexp_matches(sq.contributiontext, '(?i)" . $term->term . "', 'g') as matches, sq.id FROM ( "
                . " SELECT substring(sittingday::text,0,5) as myear, contributiontext, id FROM "
                . " hansard_". $house . "." . $house . ", to_tsquery('simple', '" . $term->tsterm . "') as q "
                . " WHERE sittingday BETWEEN '" . $dateFrom . "'::DATE AND '" . $dateTo . "'::DATE AND idxfti_simple @@ q ) as sq " 
                . " ) as x GROUP BY x.id, x.contributiontext, x.myear ) as y GROUP BY y.myear ) as z "
                . " JOIN (SELECT year as myear, total FROM hansard_" . $house . "_total_word_year) as s ON z.myear = s.myear ) ";
            }

            return $r;
        }

        private function getDistributionQuery($term, $house, $dateFrom, $dateTo, $hitsOnly){
            /*gets basic distribution of phraises between two dates. 

            if hitsOnly is true, it will sum all totals together, otherwise it is split by year.*/

            if($hitsOnly){
                $sql = "SELECT sum(freq) as count FROM ( ";
            }else{
                $sql = "SELECT sum(freq) as frequency, sum(total) as total, myear FROM ( ";
            }
            if($house != "lords"){
                $sql .= self::generateDistributionQuery("commons", $term, $dateFrom, $dateTo);
            }
            if($house == "both"){
                 $sql .= " UNION ";
            }
            if($house != "commons"){
                $sql .= self::generateDistributionQuery("lords", $term, $dateFrom, $dateTo);
            }
            if($hitsOnly){
                $sql .= ") i";
            }else{
                $sql .= ") i GROUP BY myear ORDER BY myear asc";
            }

            return $sql;

        }

        public static function distribution($paras, $house, $dateFrom, $dateTo){
            
            $i = 0;
            
            foreach($paras as $value)
            {
                $termdata = convert_data::prepareTerm($value["term"]);

                $sql = self::getDistributionQuery($termdata, $house, $dateFrom, $dateTo, FALSE);

                $rows[$i] = self::query_no_parameters($sql, "dbname=hansard");
                $i++;
            }

            return $rows;
        }

        public static function hits($value, $dateFrom, $dateTo, $house){

            $term = convert_data::prepareTerm($value['term']);
            
            $sql = self::getDistributionQuery($term, $house, $dateFrom, $dateTo, TRUE);

            $total = query_handler::query_no_parameters($sql, "dbname=hansard");

            return $total;

        }

    }

?>