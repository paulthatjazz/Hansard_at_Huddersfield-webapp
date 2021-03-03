<?php

class convert_data
{

	public static function gen_json_documents_desc($db_inp, $query, $descr, $total)
	{

		$outp['total'] = $total[0]['count'];

		if ($db_inp != null) {

			$counter = 0;
			$house = "-";
			$url = "-";

			$relevance = "-";

			foreach ($db_inp as $entry) {
				foreach ($entry as $key => $value) {
					if ($key == "id") {
						$id = $value;
					} else if ($key == "sittingday") {
						$date = $value;
					} else if ($key == "contributiontext") {
						$contribution = $value;
					} else if ($key == "member") {
						$member = $value;
					} else if ($key == "url") {

						if (strpos($value, 'external.html?link') !== FALSE) {
							$url = explode("=", $value)[1];
						} else {
							$url = $value;
						}
					} else if ($key == "description") {
						$description = $value;
					} else if ($key == "relevance") {
						$relevance = $value;
					} else if ($key == "source") {
						if ($value == "Commons") {
							$house = "<span style='color: #016131; font-weight:bold;'>" . $value . "</span>";
						} else {
							$house = "<span style='color: #95060e; font-weight:bold;'>" . $value . "</span>";
						}
					}
				}

				$contribution = convert_data::formatMatchedDocument($contribution, $query, 200);
				$description = convert_data::formatMatchedDescription($description, $descr, 200);

				$aux[] = array(
					'document_id' => $id,
					'date' => $date,
					'contribution' => $contribution,
					'member' => "<span data-url='" . $url . "'>" . $member . "</span>",
					'relevance' => $relevance,
					'description' => $description,
					'house' => $house,
				);
			}

			$outp['rows'] = $aux;
		} else {
			$outp['rows'] = null;
		}


		return $outp;
	}

	public static function gen_json_documents_desc_member($db_inp, $descr, $total)
	{

		$outp['total'] = $total[0]['count'];

		if ($db_inp != null) {

			$counter = 0;
			$house = "-";
			$url = "-";

			$relevance = "-";

			foreach ($db_inp as $entry) {
				foreach ($entry as $key => $value) {
					if ($key == "id") {
						$id = $value;
					} else if ($key == "sittingday") {
						$date = $value;
					} else if ($key == "contributiontext") {
						$contribution = substr($value, 0, 300) . " <b>...</b>";
					} else if ($key == "member") {
						$member = $value;
					} else if ($key == "url") {
						if (strpos($value, 'external.html?link') !== FALSE) {
							$url = explode("=", $value)[1];
						} else {
							$url = $value;
						}
					} else if ($key == "description") {
						$description = $value;
					} else if ($key == "relevance") {
						$relevance = $value;
					} else if ($key == "source") {
						if ($value == "Commons") {
							$house = "<span style='color: #016131; font-weight:bold;'>" . $value . "</span>";
						} else {
							$house = "<span style='color: #95060e; font-weight:bold;'>" . $value . "</span>";
						}
					}
				}

				$description = convert_data::formatMatchedDescription($description, $descr, 200);

				$aux[] = array(
					'document_id' => $id,
					'date' => $date,
					'contribution' => $contribution,
					'member' => "<span data-url='" . $url . "'>" . $member . "</span>",
					'relevance' => $relevance,
					'description' => $description,
					'house' => $house,
				);
			}

			$outp['rows'] = $aux;
		} else {
			$outp['rows'] = null;
		}


		return $outp;
	}

	// generate markes for the jVectorMap map; caveat: jVectorMap uses lat-long, Twitter uses long-lat, so coordinates in the db need to be swapped
	public static function gen_json_word_cloud($db_inp)
	{

		foreach ($db_inp as $entry) {
			foreach ($entry as $key => $value) {
				if ($key == "word") {
					$text = $value;
				} else if ($key == "freq") {
					$size = $value;
				}
			}
			$outp[] = array(
				'text' => $text,
				'size' => $size
			);
		}

		return $outp;
	}

	public static function gen_json_line($db_inps, $total_both, $parameters, $dateFrom, $dateTo)
	{

		if ($total_both != "") {
			foreach ($total_both as $entry) {
				$total_both_array[$entry['year']] = $entry['total'];
			}
		}

		$i = 0;

		foreach ($db_inps as &$db_inp) {

			$j = (int) $dateFrom;

			$line_aux['key'] = $parameters[$i]["term"];
			$line_aux['color'] = $parameters[$i]["colour"];
			$values = array();

			if ($db_inp != null) {
				foreach ($db_inp as $entry) {
					foreach ($entry as $key => $value) {
						if ($key == "frequency") {
							$freq = $value;
						} else if ($key == "myear") {
							$year = $value;
						} else if ($key == "total") {
							$total = $value;
						}
					}

					if (isset($total)) {

						if ($total_both == "") {
							$freqNorm = $freq * 1000000 / $total;
						} else {
							$freqNorm = $freq * 1000000 / $total_both_array[$year];
						}
					} else {
						$freqNorm = $freq;
					}

					while ($j != (int) $year) {
						$values[] = array(
							'x' => (int) $j,
							'y' => 0,
							'freqRaw' => 0
						);
						$j++;
					}

					$values[] = array(
						'x' => (int) $year,
						'y' => $freqNorm,
						'freqRaw' => (int) $freq,
					);
					$j++;
				}
			}


			while ($j <= (int) $dateTo) {
				$values[] = array(
					'x' => (int) $j,
					'y' => 0,
					'freqRaw' => 0
				);
				$j++;
			}

			$line_aux['values'] = $values;
			$outp[]	= $line_aux;
			$i++;
		}


		return $outp;
	}

	public static function gen_json_line_advanced($db_inps, $parameters, $norm_flag, $dateFrom, $dateTo)
	{

		$i = 0;

		foreach ($db_inps as &$db_inp) {

			$j = (int) $dateFrom;

			$line_aux['key'] = $parameters[$i]["query"];
			$line_aux['color'] = $parameters[$i]["colour"];
			$values = array();

			if ($db_inp != null) {
				foreach ($db_inp as $entry) {
					foreach ($entry as $key => $value) {
						if ($key == "frequency") {
							$freq = $value;
						} else if ($key == "year") {
							$year = $value;
						} else if ($key == "total") {
							$total = $value;
						}
					}

					if ($norm_flag) {
						$freqNorm = $freq * 1000000 / $total;
					} else {
						$freqNorm = (int) $freq;
					}


					while ($j != (int) $year) {
						$values[] = array(
							'x' => (int) $j,
							'y' => 0,
							'freqRaw' => 0
						);
						$j++;
					}

					$values[] = array(
						'x' => (int) $year,
						'y' => $freqNorm,
						'freqRaw' => (int) $freq,
					);
					$j++;
				}
			}

			while ($j <= (int) $dateTo) {
				$values[] = array(
					'x' => (int) $j,
					'y' => 0,
					'freqRaw' => 0
				);
				$j++;
			}


			$line_aux['values'] = $values;
			$outp[]	= $line_aux;
			$i++;
		}


		return $outp;
	}

	public static function gen_json_line_advanced_month($db_inps, $parameters, $norm_flag, $dateFrom, $dateTo)
	{

		$current_year = (int) substr($dateFrom, 0, 4);
		$current_month = (int) substr($dateFrom, 5, 7);

		$i = 0;

		foreach ($db_inps as &$db_inp) {

			$line_aux['key'] = $parameters[$i]["query"];
			$line_aux['color'] = $parameters[$i]["colour"];
			$values = array();

			if ($db_inp != null) {

				foreach ($db_inp as $entry) {

					foreach ($entry as $key => $value) {
						if ($key == "frequency") {
							$freq = $value;
						} else if ($key == "year") {
							$date = $value;
						} else if ($key == "total") {
							$total = $value;
						}
					}

					if ($norm_flag) {
						$freqNorm = $freq * 1000000 / $total;
					} else {
						$freqNorm = (int) $freq;
					}

					$date_year = (int) substr($date, 0, 4);
					$date_month = (int) substr($date, 5, 7);

					while (($current_year <= $date_year) && ($current_month < $date_month)) {
						$values[] = array(
							'x' => $current_year . "-" . sprintf('%02d', $current_month),
							'y' => 0,
							'freqRaw' => 0
						);
						if ($current_month == 12) {
							$current_month = 1;
							$current_year += 1;
						} else {
							$current_month += 1;
						}
					}

					/*
					$values[] = array(
						'x' => $current_year."-".sprintf('%02d',$current_month)."      ".$date_year."-".sprintf('%02d',$date_month),
						'y' => 0,
						'freqRaw'=> 0
					);*/

					$values[] = array(
						'x' => $date,
						'y' => $freqNorm,
						'freqRaw' => (int) $freq,
					);


					if ($current_month == 12) {
						$current_month = 1;
						$current_year += 1;
					} else {
						$current_month += 1;
					}
				}
			}

			$to_year = (int) substr($dateTo, 0, 4);
			$to_month = (int) substr($dateTo, 5, 7);

			while (($current_year <= $to_year) && ($current_month < $to_month)) {
				$values[] = array(
					'x' => $current_year . "-" . sprintf('%02d', $current_month),
					'y' => 0,
					'freqRaw' => 0
				);
				if ($current_month == 12) {
					$current_month = 1;
					$current_year += 1;
				} else {
					$current_month += 1;
				}
			}


			$line_aux['values'] = $values;
			$outp[]	= $line_aux;
			$i++;
		}


		return $outp;
	}

	public static function gen_json_documents($db_inp, $query, $total)
	{

		$outp['total'] = $total[0]['count'];

		if ($db_inp != null) {

			$counter = 0;
			$house = "-";
			$url = "-";
			$description = "-";

			$relevance = "-";

			foreach ($db_inp as $entry) {
				foreach ($entry as $key => $value) {
					if ($key == "id") {
						$id = $value;
					} else if ($key == "sittingday") {
						$date = $value;
					} else if ($key == "contributiontext") {
						$contribution = $value;
					} else if ($key == "member") {
						$member = $value;
					} else if ($key == "description") {
						$description = $value;
					} else if ($key == "url") {
						if (strpos($value, 'external.html?link') !== FALSE) {
							$url = explode("=", $value)[1];
						} else {
							$url = $value;
						}
					} else if ($key == "relevance") {
						$relevance = $value;
					} else if ($key == "source") {
						if ($value == "Commons") {
							$house = "<span style='color: #016131; font-weight:bold;'>" . $value . "</span>";
						} else {
							$house = "<span style='color: #95060e; font-weight:bold;'>" . $value . "</span>";
						}
					}
				}

				$contribution = convert_data::formatMatchedDocument($contribution, $query, 200);

				$aux[] = array(
					'document_id' => $id,
					'date' => $date,
					'contribution' => $contribution,
					'description' => $description,
					'member' => "<span data-url='" . $url . "'>" . $member . "</span>",
					'relevance' => $relevance,
					'house' => $house,
				);
			}

			$outp['rows'] = $aux;
		} else {
			$outp['rows'] = null;
		}


		return $outp;
	}

	public static function gen_kw_documents($db_inp, $corpus_name)
	{

		if ($db_inp != null) {

			$text = "";

			foreach ($db_inp as $entry) {
				foreach ($entry as $key => $value) {
					$text .= $value . "\n";
				}
			}
		} else {
			return null;
		}

		$myfile = fopen("../../tmp/" . $corpus_name . ".txt", "w") or die("Unable to open file!");
		fwrite($myfile, $text);
		fclose($myfile);

		return true;
	}

	public static function formatMatchedDocument($text, $query, $offset)
	{ 	// En negrita el primer hit, cuenta los otros y reduce la contribucion

		$query = preg_quote($query);
		$query =	str_replace("\*", '\w*', $query); //wildcard
		$query =	str_replace(" ", '[\p{P}]* ', $query); //spaces and punctuaction -> Postgresql search in this way Ireland, can
		if (strpos($query, ".") == FALSE) {
			$pattern = '/\b[\p{P}]*' . $query . '[\p{P}]*\b/ui';
		} else {
			if (strpos($query, "*") == FALSE) {
				$pattern = '/\b' . $query . '*\b/ui';
			} else {
				$pattern = '/\b' . $query . '\b/ui';
			}
		}


		// Search hits: \b word boundary; \p punctuaction, P: any punctuaction -> https://www.regular-expressions.info/unicode.html#prop
		preg_match_all($pattern, $text, $matches, PREG_OFFSET_CAPTURE);
		$text = substr($text, 0, $matches[0][0][1]) . "<b>" . $matches[0][0][0] . "</b>" . substr($text, ($matches[0][0][1] + strlen($matches[0][0][0])));

		$offset = (int) $offset + strlen($matches[0][0][0]);

		if ((int) $matches[0][0][1] - $offset < 0) {
			$start = 0;
		} else {
			$start = (int) $matches[0][0][1] - $offset;
		}

		$result = "<b>...</b> ";
		$result .= mb_substr($text, $start, $offset * 2, "utf-8");

		$result .= "<b>...</b> <span style='color: #007bff; font-style: italic;'>[" . (count($matches[0]) - 1) . " more]</span>";

		return $result;
	}

	#ts_headline(contributiontext,q, 'HighlightAll=TRUE') as contributiontext takes a lot of time
	public static function formatMatchedDescription($text, $query, $offset)
	{ 	// First hit in bold, count the others and reduce the contribution

		$query = preg_quote($query);
		$query =	str_replace("\*", '\w*', $query); //wildcard

		if (strpos($query, ".") == FALSE) {
			$pattern = '/[\p{P}]*' . $query . '[\p{P}]*/ui';
		} else {
			$pattern = '/\b' . $query . '*\b/ui';
		}


		// Search hits: \b word boundary; \p punctuaction, P: any punctuaction -> https://www.regular-expressions.info/unicode.html#prop
		preg_match_all($pattern, $text, $matches, PREG_OFFSET_CAPTURE);
		$result = substr($text, 0, $matches[0][0][1]) . "<b>" . $matches[0][0][0] . "</b>" . substr($text, ($matches[0][0][1] + strlen($matches[0][0][0])));

		return ($result);
	}

	public static function gen_json_kwic($db_inp, $word, $total, $offset_kwic, $context)
	{

		// e.g. id: 1; sittingday: 10-05-2005; contributiontext:"Irlanda is nice ... Northern Ireland too ...", member: Sir James
		// Document may return several hits of the same word

		$outp['total'] = $total[0]['count'];
		$url = "-";

		if ($db_inp != null) {

			$counter = $offset_kwic;
			$house = "-";
			$description = "-";

			$relevance = "-";

			foreach ($db_inp as $entry) {
				foreach ($entry as $key => $value) {
					if ($key == "id") {
						$id = $value;
					} else if ($key == "sittingday") {
						$date = $value;
					} else if ($key == "contributiontext") {
						$text = $value;
					} else if ($key == "member") {
						$member = $value;
					} else if ($key == "description") {
						$description = $value;
					} else if ($key == "url") {
						if (strpos($value, 'external.html?link') !== FALSE) {
							$url = explode("=", $value)[1];
						} else {
							$url = $value;
						};
					} else if ($key == "relevance") {
						$relevance = $value;
					} else if ($key == "source") {
						if ($value == "Commons") {
							$house = "<span style='color: #016131; font-weight:bold;'>" . $value . "</span>";
						} else {
							$house = "<span style='color: #95060e; font-weight:bold;'>" . $value . "</span>";
						}
					}
				}

				$counter += 1;

				$concordances = convert_data::formatMatchedHits($text, $word, $context);

				foreach ($concordances as $concordance) {
					$aux[] = array(
						'#document' => $counter,
						'document_id' => $id,
						'date' => $date,
						'left_context' => $concordance[0],
						'hit' => $concordance[1],
						'right_context' => $concordance[2],
						'member' => "<span data-url='" . $url . "'>" . $member . "</span>",
						'relevance' => $relevance,
						'description' => $description,
						'house' => $house,
					);
				}
			}

			$outp['rows'] = $aux;
		} else {
			$outp['rows'] = null;
		}

		return $outp;
	}

	public static function gen_json_kwic_desc($db_inp, $word, $descr, $total, $offset_kwic, $context)
	{

		// e.g. id: 1; sittingday: 10-05-2005; contributiontext:"Irlanda is nice ... Northern Ireland too ...", member: Sir James
		// Document may return several hits of the same word

		$outp['total'] = $total[0]['count'];
		$url = "-";

		if ($db_inp != null) {

			$counter = $offset_kwic;
			$house = "-";

			$relevance = "-";

			foreach ($db_inp as $entry) {
				foreach ($entry as $key => $value) {
					if ($key == "id") {
						$id = $value;
					} else if ($key == "sittingday") {
						$date = $value;
					} else if ($key == "contributiontext") {
						$text = $value;
					} else if ($key == "member") {
						$member = $value;
					} else if ($key == "url") {
						if (strpos($value, 'external.html?link') !== FALSE) {
							$url = explode("=", $value)[1];
						} else {
							$url = $value;
						}
					} else if ($key == "description") {
						$description = $value;
					} else if ($key == "relevance") {
						$relevance = $value;
					} else if ($key == "source") {
						if ($value == "Commons") {
							$house = "<span style='color: #016131; font-weight:bold;'>" . $value . "</span>";
						} else {
							$house = "<span style='color: #95060e; font-weight:bold;'>" . $value . "</span>";
						}
					}
				}

				$counter += 1;
				$concordances = convert_data::formatMatchedHits($text, $word, $context);
				$description = convert_data::formatMatchedDescription($description, $descr, 200);


				foreach ($concordances as $concordance) {
					$aux[] = array(
						'#document' => $counter,
						'document_id' => $id,
						'date' => $date,
						'left_context' => $concordance[0],
						'hit' => $concordance[1],
						'right_context' => $concordance[2],
						'member' => "<span data-url='" . $url . "'>" . $member . "</span>",
						'relevance' => $relevance,
						'description' => $description,
						'house' => $house,
					);
				}
			}

			$outp['rows'] = $aux;
		} else {
			$outp['rows'] = null;
		}

		return $outp;
	}

	public static function formatMatchedHits($text, $query, $context)
	{

		$text =	preg_replace('/\s+/', ' ', trim($text));
		$word_text = explode(" ", $text);
		$num_words = count(explode(" ", $query));

		$matches  = preg_grep('/<b>[\w+ ]*<\/b>/i', $word_text);


		if ($num_words == 1) {
			foreach ($matches as $key => $value) {

				$concordance[0] = implode(" ", array_slice($word_text, ($key - $context > 0 ? $key - $context : 0), ($key - $context > 0 ? $context : $key)));
				$concordance[1] = $value;
				$concordance[2] = implode(" ", array_slice($word_text, $key + 1, $context));

				$result[] = $concordance;
			}
		} else {
			foreach ($matches as $key => $value) {
				$matches_sequence[] = array('pos' => $key, 'val' => $value);
			}


			for ($i = 0; $i < count($matches_sequence); $i++) {
				if (convert_data::isMWE($num_words, $matches_sequence, $i)) {
					$keys[] = $matches_sequence[$i]['pos'];
				}
			}


			foreach ($keys as $key) {

				$concordance[0] = implode(" ", array_slice($word_text, ($key - $context > 0 ? $key - $context : 0), ($key - $context > 0 ? $context : $key)));
				$concordance[1] = implode(" ", array_slice($word_text, $key, $num_words));
				$concordance[2] = implode(" ", array_slice($word_text, $key + $num_words, $context));

				$result[] = $concordance;
			}
		}

		return $result;
	}

	public static function gen_json_concordance_member($db_inp, $total)
	{

		$outp['total'] = $total[0]['count'];
		$house = "-";
		$url = "-";
		$description = "-";
		if ($db_inp != null) {
			foreach ($db_inp as $entry) {
				foreach ($entry as $key => $value) {
					if ($key == "id") {
						$id = $value;
					} else if ($key == "sittingday") {
						$date = $value;
					} else if ($key == "description") {
						$description = $value;
					} else if ($key == "contributiontext") {
						$contribution = substr($value, 0, 300) . " <b>...</b>";
					} else if ($key == "source") {
						if ($value == "Commons") {
							$house = "<span style='color: #016131; font-weight:bold;'>" . $value . "</span>";
						} else {
							$house = "<span style='color: #95060e; font-weight:bold;'>" . $value . "</span>";
						}
					} else if ($key == "url") {
						if (strpos($value, 'external.html?link') !== FALSE) {
							$url = explode("=", $value)[1];
						} else {
							$url = $value;
						}
					}
				}

				$aux[] = array(
					'document_id' => $id,
					'date' => $date,
					'contribution' => $contribution,
					'house' => $house,
					'description' => $description,
				);
			}

			$outp['rows'] = $aux;
		} else {
			$outp['rows'] = null;
		}
		return $outp;
	}

	public static function gen_json_description($db_inp, $word, $total, $offset)
	{

		$outp['total'] = $total[0]['count'];
		$house = "-";
		$url = "-";

		if ($db_inp != null) {

			foreach ($db_inp as $entry) {
				foreach ($entry as $key => $value) {
					if ($key == "id") {
						$id = $value;
					} else if ($key == "sittingday") {
						$date = $value;
					} else if ($key == "description") {
						$description =  preg_replace('/\b' . preg_quote($word, "/") . '\b/i', "<b>\$0</b>", $value);
					} else if ($key == "member") {
						$member = $value;
					} else if ($key == "url") {
						if (strpos($value, 'external.html?link') !== FALSE) {
							$url = explode("=", $value)[1];
						} else {
							$url = $value;
						}
					} else if ($key == "contributiontext") {
						$contribution = substr($value, 0, 300) . " <b>...</b>";
					} else if ($key == "source") {
						if ($value == "Commons") {
							$house = "<span style='color: #016131; font-weight:bold;'>" . $value . "</span>";
						} else {
							$house = "<span style='color: #95060e; font-weight:bold;'>" . $value . "</span>";
						}
					}
				}

				$aux[] = array(
					'document_id' => $id,
					'date' => $date,
					'description' => $description,
					'member' => "<span data-url='" . $url . "'>" . $member . "</span>",
					'contribution' => $contribution,
					'house' => $house,
				);
			}

			$outp['rows'] = $aux;
		} else {
			$outp['rows'] = null;
		}

		return $outp;
	}

	public static function str_ends_with($haystack, $needle)
	{
		return strrpos($haystack, $needle) === strlen($haystack) - strlen($needle);
	}

	public static function format_contributionOne($db_inp, $query)
	{

		$myfile = fopen("../../tmp/" . session_id() . ".txt", "w") or die("Unable to open file!");
		$txt = $db_inp[0]['contributiontext'];
		fwrite($myfile, $txt);
		fclose($myfile);

		$outp['id'] = $db_inp[0]['id'];
		$outp['member'] = $db_inp[0]['member'];

		if ($query != "" && $query != null) {

			$query = preg_quote($query);
			$query =	str_replace("\*", '\w*', $query); //wildcard

			//$pattern = '/\b[^a-zA-Z0-9\s]' . $query . '[^a-zA-Z0-9\s]\b/ui';
			$pattern = '/\b[^a-zA-Z0-9][\s]*' . $query . '[^a-zA-Z0-9][\s]*\b/ui';

			$outp['contributiontext'] = preg_replace($pattern, "$1<span style='background-color: #f3f315; font-weight:bold;'>$0</span>$2", $db_inp[0]['contributiontext']);
		} else {
			$outp['contributiontext'] = $db_inp[0]['contributiontext'];
		}

		$pattern = '/([a-z]+)\.[ ]*([A-Z])+/';
		$outp['contributiontext'] = preg_replace($pattern, "$1.<br><br>$2", $outp['contributiontext']);


		$pattern = '/hon\.<br><br>/';
		$outp['contributiontext'] = preg_replace($pattern, "hon. ", $outp['contributiontext']);

		$pattern = '/Mr\.<br><br>/';
		$outp['contributiontext'] = preg_replace($pattern, "Mr. ", $outp['contributiontext']);

		$pattern = '/Dr\.<br><br>/';
		$outp['contributiontext'] = preg_replace($pattern, "Dr. ", $outp['contributiontext']);

		return $outp;
	}

	function replaceSymbols($contributiontext)
	{

		$contributiontext = str_replace("#x00A3;", "£", $contributiontext);
		$contributiontext = str_replace("#x2014;", "-", $contributiontext);
	}

	public static function clean_query($query)
	{

		$raw_query = str_replace('\'', '\'\'', $query);
		$raw_query =	preg_replace('/\s+/', ' ', trim($raw_query));

		return $raw_query;
	}

	public static function gen_postgresql_query($query)
	{

		$raw_query =	str_replace("*", ':*', $query);

		$array_aux = explode(" ", $raw_query);

		if (sizeof($array_aux) == 1) {
			return $raw_query;
		} else {
			$i = 0;
			foreach ($array_aux as $element) {
				if ($i == 0) {
					$aux = $element;
				} else {
					$aux .= "<->" . $element;
				}
				$i++;
			}
			return $aux;
		}
	}

	public static function gen_json_search_member($db_inp, $total)
	{


		$outp['total'] = $total[0]['count'];
		$house = "-";
		$url = "-";

		foreach ($db_inp as $entry) {
			foreach ($entry as $key => $value) {
				if ($key == "member") {
					$member = $value;
				} else if ($key == "url") {
					if (strpos($value, 'external.html?link') !== FALSE) {
						$url = explode("=", $value)[1];
					} else {
						$url = $value;
					}
				} else if ($key == "source") {
					if ($value == "Commons") {
						$house = "<span style='color: #016131; font-weight:bold;'>" . $value . "</span>";
					} else {
						$house = "<span style='color: #95060e; font-weight:bold;'>" . $value . "</span>";
					}
				}
			}

			$info = "<button class='spk-contrib btn btn-outline-info btn-sm'> Contributions</button> <button class='member-info btn btn-outline-info btn-sm'>More info </button>";
			$aux[] = array(
				'member' => "<span data-url='" . $url . "'>" . $member . "</span>",
				'house' => $house,
				'info' => $info,
			);
		}

		$outp['rows'] = $aux;
		return $outp;
	}

	public static function format_saveDocuments($db_inp, $offset)
	{

		$house = "-";
		$counter = 0 + $offset;
		$description = "-";



		$filename = '../../tmp/' . session_id() . '.zip';
		if (file_exists($filename)) {
			unlink($filename);
		}


		$zip = new ZipArchive();
		$zip->open($filename, ZipArchive::CREATE);

		foreach ($db_inp as $entry) {

			$counter += 1;

			foreach ($entry as $key => $value) {
				if ($key == "sittingday") {
					$sittingday = $value;
				} else if ($key == "contributiontext") {

					$pattern = '/([a-z]+) ([a-z]+)\. /';
					$value = preg_replace($pattern, "$1 $2.\r\n\r\n", $value);

					$pattern = '/hon\.\r\n\r\n/';
					$value = preg_replace($pattern, "hon. ", $value);


					$contributiontext = $value;
				} else if ($key == "member") {
					$member = $value;
				} else if ($key == "description") {
					$description = $value;
				} else if ($key == "source") {
					$house = $value;
				}
			}


			$my_file = '../../tmp/' . session_id() . '_' . $counter . '.txt';

			if (file_exists($my_file)) {
				unlink($my_file);
			}

			$handle = fopen($my_file, 'w') or die('Cannot open file:  ' . $my_file);

			if ($house != "-") {
				$data =
					"Member: " . $member . "\r\n\r\n" .
					"House: " . $house . "\r\n\r\n" .
					"Date: " . $sittingday . "\r\n\r\n" .
					"Contribution:\r\n" . " " . $contributiontext;

				if ($description != "-") {
					$data = $data .
						"\r\n\r\nDebate title: " . $description;
				}
			} else {
				$data =
					"Member: " . $member . "\r\n\r\n" .
					"Date: " . $sittingday . "\r\n\r\n" .
					"Contribution:\r\n" . " " . $contributiontext;

				if ($description != "-") {
					$data = $data .
						"\r\n\r\nDebate title: " . $description;
				}
			}

			fwrite($handle, $data);
			fclose($handle);

			$zip->addFile($my_file, $counter . '.txt');
		}

		$zip->close();
		echo session_id() . '.zip';
	}

	public static function isMWE($num_words, $matches_sequence, $index)
	{

		$loop_counter = 1;
		$i = $index;
		$flag_mwe = true;

		while (($loop_counter < $num_words) && ($flag_mwe)) {
			if (array_key_exists($i + 1, $matches_sequence)) {
				if ($matches_sequence[$i]["pos"] + 1 == $matches_sequence[$i + 1]["pos"]) {
					$loop_counter += 1;
					$i++;
				} else {
					$flag_mwe = false;
				}
			} else {
				$flag_mwe = false;
			}
		}
		return $flag_mwe;
	}
}

/*
	#delete
    #ts_headline(contributiontext,q, 'HighlightAll=TRUE') as contributiontext takes a lot of time
	public static function formatMatchedHits($text, $query, $context) {

		$query = preg_quote($query);
		$query=	str_replace("\*", '\w*[\p{P}]*',$query); //wildcard

		$query=	str_replace(" ", '[\p{P}]* ',$query); //spaces and punctuaction -> Postgresql search in this way Ireland, can

		$pattern1 = '/(?:\S+\s+){0,'.$context.'}\w*\W*\b'.$query.'\W*\b\s*(?:\S+\s*){0,'.$context.'}/i';
		preg_match_all ($pattern1, $text, $matches);
		$pattern2 = '/\b'.$query.'\W*\b/i';

		if (count($matches)==0){ // Error
			
			print_r("ERROR");
			print_r($query."\n\n");
			print_r($text);
			
			exit("error-0");

		};

		foreach($matches[0] as $aux){
          
			$concordance = preg_replace($pattern2, '#####<b>$0</b>#####', $aux);
			$result[] = explode("#####",$concordance);
		}
		return $result;

	}

	#delete
	public static function format_contributionOne($db_inp, $query){

		$myfile = fopen("../../tmp/".session_id().".txt", "w") or die("Unable to open file!");
		$txt = $db_inp[0]['contributiontext'];
		fwrite($myfile, $txt);
		fclose($myfile);

		$outp['id'] = $db_inp[0]['id'];
		$outp['member'] = $db_inp[0]['member'];

		if($query!="" && $query!=null){

			$query = preg_quote($query);
			$query=	str_replace("\*", '\w*',$query); //wildcard

			$pattern = '/\b'.$query.'\W*\b/ui';

			$outp['contributiontext'] = preg_replace($pattern,"$1<span style='background-color: #f3f315; font-weight:bold;'>$0</span>$2",$db_inp[0]['contributiontext']);	
		}else{
			$outp['contributiontext'] = $db_inp[0]['contributiontext'];
		}

		$pattern = '/([a-z]+)\.[ ]*([A-Z])+/';
		$outp['contributiontext'] = preg_replace($pattern,"$1.<br><br>$2",$outp['contributiontext']);

		
		$pattern = '/hon\.<br><br>/';
		$outp['contributiontext'] = preg_replace($pattern,"hon. ",$outp['contributiontext']);

		$pattern = '/Mr\.<br><br>/';
		$outp['contributiontext'] = preg_replace($pattern,"Mr. ",$outp['contributiontext']);

		$pattern = '/Dr\.<br><br>/';
		$outp['contributiontext'] = preg_replace($pattern,"Dr. ",$outp['contributiontext']);

		return $outp;
	}

*/
