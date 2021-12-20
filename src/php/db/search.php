<?php 

    include_once 'query_handler.php';
    include_once 'analytics.php';
    include_once './convert_data.php';

    class search extends query_handler
    {
        //a class containing an encapsulation of methods for search queries on the database
        public static function contribution($dateFrom, $dateTo, $paras, $house, $kwic, $count, $offset, $sort, $order, $limit, $context, $adv = FALSE){
            //basic contribution

            $term = $paras["term"];

            $termdata = convert_data::prepareTerm($term);

            if($adv){
                // if adv, check for desc, term, & member
                if($paras["description"]){
                    $desc = $paras["description"];
                }else{
                    $desc = NULL;
                }

                if($paras["member"]){
                    $member = $paras["member"];
                }else{
                    $member = NULL;
                }
            }else{
                $desc = NULL;
                $member = NULL;
            }


            $sql = "SELECT * FROM (";
            if($house != "lords")
            {
                $sql .= self::generateContributionQuery("commons", $termdata, $dateFrom, $dateTo, $kwic, $member, $desc);
            }
            if($house == "both")
            {
                $sql .= " UNION ";
            }
            if($house != "commons")
            {
                $sql .= self::generateContributionQuery("lords", $termdata, $dateFrom, $dateTo, $kwic, $member, $desc);
            
            }
            $sql .= ") c ";

            $sql2 = $sql . ";";

            $sql .= " ORDER BY c." . $sort . " " . $order . " LIMIT " . $limit . " OFFSET " . $offset . ";";



            $total = self::contributionTotal($count, $offset, $house, $termdata, $dateFrom, $dateTo, $desc, $member);
            
            $rows = self::query_no_parameters($sql, "dbname=hansard");

            if ($kwic == "contribution" || $kwic == "contribution_nonRank" || $kwic == "false") 
            {
                if($termdata->n == 0){
                    if($desc != NULL && $member != NULL){
                        $var = convert_data::gen_json_documents_desc_member($rows, convert_data::clean_query($desc), $total);
                    }else if($member == NULL){
                        $var = convert_data::gen_json_description($rows, $desc, $total, $offset);
                    }else{
                        $var = convert_data::gen_json_concordance_member($rows, $total);
                    }
                }else{
                    $var = convert_data::gen_json_documents($rows, $termdata->cleanterm, $total);
                }
            } 
            else  if ($kwic == "contribution-kwic" || $kwic == "contribution-kwic_nonRank" || $kwic == "true") 
            {
                $var = convert_data::gen_json_kwic($rows, $termdata->cleanterm, $total, $offset, $context);
            }

            return $var;
        }

        private function contributionTotal($count, $offset, $house, $term, $dateFrom, $dateTo, $desc, $member){

            if ($count == 0 && $offset == 0) {
                $total[] = array("count" => "total");
              } else if ($count == 0 && $offset != 0) {
                $total[] = array("count" => $count);
              } else {

                if($term->n != 0){
                    $termquery1 = ", to_tsquery('simple', '" . $term->tsterm . "') as q";
                    $termquery2 = "and idxfti_simple @@ q";
                }else{
                    $termquery1 = " ";
                    $termquery2 = " ";
                }

                $memquery = " ";
                $descquery = " ";

                if($member != NULL){
                    $cleaned_member = convert_data::clean_query($member);
                    if($cleaned_member == "Speaker")
                    {
                        $memquery = " AND member ilike '%speaker%' ";
                    }else{
                        $memquery = " AND member = '" . $cleaned_member . "'";
                    }
                }

                if($desc != NULL){
                    $cleaned_desc = convert_data::clean_query($desc);
                    $descquery = " AND description ilike '%" . $cleaned_desc . "%' ";
                }
                
                
                $sql = "SELECT count(*) FROM ";
                if($house == "both"){
                    $sql .= "
                    (
                        (  
                            SELECT id FROM 
                            hansard_commons.commons
                            " . $termquery1 . "
                            WHERE
                            sittingday BETWEEN '" . $dateFrom . "'::DATE AND '" . $dateTo . "'::DATE  
                            " . $termquery2 . $memquery . $descquery . "
                        )
                        UNION
                        (  
                            SELECT id FROM 
                            hansard_lords.lords
                            " . $termquery1 . "
                            WHERE
                            sittingday BETWEEN '" . $dateFrom . "'::DATE AND '" . $dateTo . "'::DATE  
                            " . $termquery2 . $memquery . $descquery . "
                        )
                    ) x ";
                }else{
                    $sql .= " hansard_" . $house . "." . $house 
                    . $termquery1
                    . " WHERE "
                    . " sittingday BETWEEN '" . $dateFrom . "'::DATE AND '" . $dateTo . "'::DATE "
                    . $termquery2 . $memquery . $descquery;
                }
                
                $total = query_handler::query_no_parameters($sql, "dbname=hansard");
              }

            return $total;

        }

        private function generateContributionQuery($house, $term, $dateFrom, $dateTo, $kwic, $member, $desc){

            $memquery = " ";
            $descquery = " ";

            if($member != NULL){
                $cleaned_member = convert_data::clean_query($member);
                if($cleaned_member == "Speaker")
                {
                    $memquery = " AND member ilike '%speaker%' ";
                }else{
                    $memquery = " AND member = '" . $cleaned_member . "'";
                }
            }

            if($desc != NULL){
                $cleaned_desc = convert_data::clean_query($desc);
                $descquery = " AND description ilike '%" . $cleaned_desc . "%' ";
            }

            if($kwic == "contribution-kwic" || $kwic == "contribution-kwic_nonRank" || $kwic == "true")
            {
                $contributiontext = "ts_headline('simple',contributiontext,q, 'StartSel=<b>, StopSel=</b>, HighlightAll=TRUE') as contributiontext";
            } 
            else 
            {
                $contributiontext = "contributiontext";
            }

            if($term->n == 0){

                $r = " ("
                    . " SELECT id, sittingday, contributiontext, member, href as url, description "
                    . " FROM hansard_" . $house . "." . $house . " "
                    . " WHERE "
                    . " sittingday BETWEEN '" . $dateFrom . "'::DATE AND '" . $dateTo . "'::DATE " . $descquery . $memquery
                    . " ) ";

            }else{

                $r = " ( "
                    . " SELECT id, href as url, " . $contributiontext . ", sittingday, '" . ucfirst($house) . "' as source, ts_rank(idxfti_simple, q) AS relevance, description, member "
                    . " FROM hansard_" . $house . ". " . $house . ", to_tsquery('simple', '" . $term->tsterm . "') as q "
                    . " WHERE "
                    . " sittingday BETWEEN '" . $dateFrom . "'::DATE AND '" . $dateTo . "'::DATE " . $descquery . $memquery
                    . " AND idxfti_simple @@ q "
                    . " ) ";
            }

            return $r;
        }

        private function generateDistributionQuery($house, $term, $dateFrom, $dateTo, $monthly, $member = NULL, $description = NULL, $hitsOnly){

            //generates a query based on search type (multi-word or single) and specific house
            if($term->n == 1 && $monthly == FALSE && $member == NULL && $description == NULL && $term->booleanOperaton != TRUE){

                //single word query per year

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

                //more logic required for monthly or multi word/advanced queries
                
                if(strlen($dateTo) == 4){
                    $dateFrom .= "-01-01";
                    $dateTo .= "-12-31";
                }

                //monthly grouping logic

                if($monthly == TRUE){
                    $d = 8;
                    $db = "total_word_month_year";
                }else{
                    $d = 5;
                    $db = "total_word_year";
                }

                if($member != NULL){
                    $cleaned_member = convert_data::clean_query($member);
                    if($cleaned_member == "Speaker")
                    {
                        $memquery = " AND member ilike '%speaker%' ";
                    }else{
                        $memquery = " AND member = '" . $cleaned_member . "'";
                    }
                }else{
                    $memquery = " ";
                }

                if($description != NULL){
                    $cleaned_desc = convert_data::clean_query($description);
                    $descquery = " AND description ilike '%" . $cleaned_desc . "%' ";
                }else{
                    $descquery = " ";
                }

                if($term->n != 0)
                {

                    // term, term + desc, term + member, term + member + desc scenarios

                    if($hitsOnly && $term->booleanOperaton)
                    {
                        $t = $term->highlightterm;
                        
                    }else{
                        $t = $term->regexterm;
                    }

                    $r = " ( "
                    . " SELECT z.myear, freq, total FROM ( "
                    . " SELECT y.myear, sum(y.hits) as freq FROM ("
                    . " SELECT x.myear, count(x.matches) as hits FROM ( "
                    . " SELECT sq.myear, sq.contributiontext, regexp_matches(sq.contributiontext, '(?i)\y" . $term->regexterm . "\y', 'g') as matches, sq.id FROM ( "
                    . " SELECT substring(sittingday::text,0," . $d . ") as myear, contributiontext, id FROM "
                    . " hansard_". $house . "." . $house . ", to_tsquery('simple', '" . $term->tsterm . "') as q "
                    . " WHERE sittingday BETWEEN '" . $dateFrom . "'::DATE AND '" . $dateTo . "'::DATE AND idxfti_simple @@ q " . $memquery . $descquery . " ) as sq " 
                    . " ) as x GROUP BY x.id, x.contributiontext, x.myear ) as y GROUP BY y.myear ) as z "
                    . " JOIN (SELECT year as myear, total FROM hansard_" . $house . "_" . $db . ") as s ON z.myear = s.myear ) ";

                }else{

                    // member, desc, member + desc scenarios

                    if($monthly == TRUE)
                    {
                       // might require a table for monthly contributions if computation time becomes a problem 
                        $totalcontrib = "select year, 0 as frequency, total from "
                        . "( "
                        . " SELECT substring(sittingday::TEXT,0,8) as year, count(*) as total "
                        . " FROM hansard_" . $house . "." . $house
                        . " WHERE sittingday BETWEEN '" . $dateFrom . "'::DATE AND '" . $dateTo . "'::DATE "
                        . " group by year ) s ) x ";

                    }else{
                        $totalcontrib = "select year, 0 as frequency, total from hansard_" 
                        . $house . "_total_contributions_year WHERE year BETWEEN substring('" . $dateFrom . "'::text,0,5) AND substring('" 
                        . $dateTo . "'::text,0,5)	" 
                        . ") x "; 
                    }

                    $r = "( select myear, sum(total) as total, sum (frequency) as freq FROM(	" .
                    "SELECT substring(sittingday::text,0," . $d . ") as myear, COUNT(*) as frequency, 0 as total FROM hansard_" . $house . "." . $house . "	" .
                    "WHERE " .
                    "sittingday BETWEEN '" . $dateFrom . "'::DATE AND '" . $dateTo . "'::DATE	" .
                    $memquery .
                    $descquery .
                    "group by myear, description, member	" .
                    "UNION ALL	" .
                    $totalcontrib .
                    "group by myear	" .
                    "order by myear )";

                }
            }


            return $r;
        }

        private function getDistributionQuery($term, $house, $dateFrom, $dateTo, $hitsOnly, $monthly = FALSE, $member = NULL, $desc = NULL){
            /*gets basic distribution of phraises between two dates. 

            if hitsOnly is true, it will sum all totals together, otherwise it is split by year.*/

            if($hitsOnly){
                $sql = "SELECT sum(freq) as count FROM ( ";
            }else{
                $sql = "SELECT sum(freq) as frequency, sum(total) as total, myear FROM ( ";
            }
            if($house != "lords"){
                $sql .= self::generateDistributionQuery("commons", $term, $dateFrom, $dateTo, $monthly, $member, $desc, $hitsOnly);
            }
            if($house == "both"){
                 $sql .= " UNION ";
            }
            if($house != "commons"){
                $sql .= self::generateDistributionQuery("lords", $term, $dateFrom, $dateTo, $monthly, $member, $desc, $hitsOnly);
            }
            if($hitsOnly){
                $sql .= ") i";
            }else{
                $sql .= ") i GROUP BY myear ORDER BY myear asc";
            }

            return $sql;

        }

        public static function distribution($paras, $house, $dateFrom, $dateTo, $adv = FALSE, $monthly = FALSE){
            
            $i = 0;

            analytics::recordQuery($paras, $adv, $dateFrom, $dateTo, $house);
            foreach($paras as $value)
            {
                $termdata = convert_data::prepareTerm($value["term"]);

                if($adv == TRUE){

                    if($value["member"] == ""){
                        $member = NULL;
                    }else{
                        $member = $value["member"];
                    }
                    
                    if($value["description"] == ""){
                        $desc = NULL;
                    }else{
                        $desc = $value["description"];
                    }

                    $sql = self::getDistributionQuery($termdata, $house, $dateFrom, $dateTo, FALSE, $monthly, $member, $desc);
                }else{
                    $sql = self::getDistributionQuery($termdata, $house, $dateFrom, $dateTo, FALSE);
                }

                $rows[$i] = self::query_no_parameters($sql, "dbname=hansard");
                $i++;
            }

            return $rows;
        }

        public static function hits($value, $dateFrom, $dateTo, $house, $type, $monthly){


            $term = convert_data::prepareTerm($value['term']);

            if($type == "advanced"){
                if($value["description"]){
                    $desc = $value["description"];
                }else{
                    $desc = NULL;
                }

                if($value["member"]){
                    $member = $value["member"];
                }else{
                    $member = NULL;
                }
            }else{
                $desc = NULL;
                $member = NULL;
            }
            
            $sql = self::getDistributionQuery($term, $house, $dateFrom, $dateTo, TRUE, $monthly, $member, $desc);

            $total = query_handler::query_no_parameters($sql, "dbname=hansard");

            return $total;

        }

        private function generateDocumentQuery($house, $id){
            return "SELECT sittingday, contributiontext, member, description FROM hansard_" . $house . "." . $house . " WHERE id in (" . $id . ")";
        }

        public static function getDocumentsById($house, $id){

            $sql = "SELECT * FROM "
            . " ( ";
            if($house != "lords"){
                $sql .= self::generateDocumentQuery("commons", $id);
            }
            if($house == "both"){
                $sql .= " UNION ";
            }
            if($house != "commons"){
                $sql .= self::generateDocumentQuery("lords", $id);
            }
            $sql .= " ) as x";

            return $sql;

        }
    }

?>