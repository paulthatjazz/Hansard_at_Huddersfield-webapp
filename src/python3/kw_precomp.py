import psycopg2
import sys
import re
import math

from kw_periods_config import periods, stoplist


def count_words(commons, lords, period_data, pid):
    word_count_commons = 0
    word_count_lords = 0

    word_arr = []
    word_count_arr = []

    l = len(commons)
    i = 0

    for row in commons:
        
        words = row[0].split()

        word_count_commons += len(words)

        for word in words:
            word = re.sub('-', '133ac340', word)
            word = re.sub(r'[^\w\s]','', word)
            word = re.sub('133ac340','-', word)
            word = word.lower()
            
            if word in word_arr:
                word_count_arr[word_arr.index(word)][0] += 1
                word_count_arr[word_arr.index(word)][2] += 1
            else:
                if len(word) > 2 and word not in stoplist and not word.isnumeric():
                    word_arr.append(word)
                    word_count_arr.append([1,0,1])

        #print("{0}/{1} ({2}%)".format(i, l, round((i/l)*100)))

        i += 1

    for row in lords:
        
        words = row[0].split()

        word_count_lords += len(words)

        for word in words:
            word = re.sub(r'[^\w\s]','', word)
            word = word.lower()
            
            if word in word_arr:
                word_count_arr[word_arr.index(word)][1] += 1
                word_count_arr[word_arr.index(word)][2] += 1
            else:
                if len(word) > 2 and word not in stoplist and not word.isnumeric():
                    word_arr.append(word)
                    word_count_arr.append([0,1,1])

        #print("{0}/{1} ({2}%)".format(i, l, round((i/l)*100)))

        i += 1
    
    
    sql = "INSERT INTO hansard_precomp.hansard_kw_period VALUES ({0}, '{1}', '{2}', '{3}', {4}, '{5}'::DATE, '{6}'::DATE, {7}, {8} )".format(pid, period_data['title'], period_data['desc'], period_data['type'], (word_count_commons+word_count_lords), period_data['dateFrom'], period_data['dateTo'], word_count_commons, word_count_lords)

    curs.execute(sql)

    for x in range(0, len(word_arr)):

        freq = (word_count_arr[x][2] * 1000000) / (word_count_commons+word_count_lords)

        if word_count_commons == 0:
            freq_commons = 0
        else:
            freq_commons = (word_count_arr[x][0] * 1000000) / word_count_commons

        if word_count_lords == 0:
            freq_lords = 0
        else:
            freq_lords = (word_count_arr[x][1] * 1000000) / word_count_lords

        sql = "INSERT INTO hansard_precomp.hansard_kw_word VALUES ('{0}', {1}, {2}, {3}, {4}) ".format(word_arr[x], freq_commons, pid, freq, freq_lords)

        curs.execute(sql)




conn = psycopg2.connect(
    host = "localhost",
    database = "hansard",
    user= "hansard",
    password = "hansard",
    port = "5433")


curs = conn.cursor()

p_id = 0

for period in periods:

    print("{0} gov, {1} to {2}".format(period["title"], period["dateFrom"], period["dateTo"]))

    sql = "SELECT contributiontext FROM hansard_commons.commons WHERE sittingday BETWEEN '{0}'::DATE AND '{1}'::DATE LIMIT 20".format(period["dateFrom"], period["dateTo"])
    
    sql2 = "SELECT contributiontext FROM hansard_lords.lords WHERE sittingday BETWEEN '{0}'::DATE AND '{1}'::DATE LIMIT 20".format(period["dateFrom"], period["dateTo"])

    curs.execute(sql)

    rows = curs.fetchall()

    curs.execute(sql2)

    rows2 = curs.fetchall()

    count_words(rows, rows2, period, p_id)

    p_id += 1


conn.commit()
curs.close()
conn.close()