<?php

    include_once 'query_handler.php';

    class keywords extends query_handler
    {

        static function get_corpus_predefined($id){

            return null;
        }

        static function get_corpus_user_defined($term, $dateFrom, $dateTo, $house, $member){

            $sql_term_1 = "";
            $sql_term_2 = "";

            if($term != ""){

                $cleaned_term = convert_data::clean_query($term);
                $ts_term = convert_data::gen_postgresql_query($cleaned_term);

                $sql_term_1 = ", to_tsquery('simple','" . $ts_term . "') as q ";
                $sql_term_2 = "and idxfti_simple @@ q ";
                
            }

            $sql = "SELECT contributiontext FROM hansard_" . $house . "." . $house . $sql_term_1 . " WHERE sittingday BETWEEN '" . $dateFrom . "'::DATE AND '" . $dateTo . "'::DATE";

            if($member != ""){
                $sql .= " AND member ='" . $member . "' ";
            }

            $sql .= $sql_term_2;
            
            $rows = self::query_no_parameters($sql, "hansard");

            return $rows;
        }


        static function kw_analysis($corpus_1, $corpus_2){

            if($corpus_1['preCalculated'][0] == "false"){

                $corpus_comp = self::get_corpus_user_defined($corpus_1['term'], $corpus_1['dateFrom'], $corpus_1['dateTo'], $corpus_1['house'], $corpus_1['member']);

            }else{

            }

            if($corpus_2['preCalculated'][0] == "false"){
                
                $corpus_target = self::get_corpus_user_defined($corpus_2['term'], $corpus_2['dateFrom'], $corpus_2['dateTo'], $corpus_2['house'], $corpus_2['member']);

            }else{

            }

            $r = self::simple_maths_kw($corpus_comp, $corpus_target);

            return $r;
        }


        static function simple_maths_kw($comp, $target){

            $stoplist = ["the"];


            $comp = self::prepare_corpus($comp, $stoplist, 2);


            return $comp;

        }

        static function prepare_corpus($corpus, $stoplist, $limit){

            $word_arr = [];
            $count_arr = [];
            $total_count = 0;
            
            foreach ($corpus as $text) {

                $words = explode(" ", $text["contributiontext"]);

                foreach ($words as $word){

                    $word = preg_replace('/[[:punct:]]/', '', $word);
                    $word = strtolower($word);

                    if(in_array($word, $stoplist) || strlen($word) <= $limit){
                        $total_count += 1;
                    }else{
                        $i = array_search($word, $word_arr);

                        if(is_numeric($i)){
                            $count_arr[$i] += 1;
                        }else{
                            $word_arr[] = $word;
                            $count_arr[] = 1;
                        }

                        $total_count += 1;
                    }

                }

            }

            return $total_count;

        }

        static function fpm($corpus){
            
            return null;
        }

    }


?>