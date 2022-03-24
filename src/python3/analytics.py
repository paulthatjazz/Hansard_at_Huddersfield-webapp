# python script which when given 2 dates as parameters returns a report of the searches between those two dates.

import psycopg2
import csv
import sys


args = sys.argv
target = 'result'
fields = ['term', 'member', 'description']


dateFrom = str(args[1]);
dateTo = str(args[2]);


conn = psycopg2.connect(
    host = "localhost",
    database = "hansard",
    user= "hansard",
    password = "hansard",
    port = "5433")

curs = conn.cursor()

for f in fields:

    curs.execute("SELECT * FROM (SELECT x."+f+", sum(x.n) as count FROM (SELECT " + f + ", count(*) as n FROM hansard_analytics.query WHERE searchdate BETWEEN '" +  dateFrom + "'::DATE AND '" + dateTo + "'::DATE AND "+f+" is not null GROUP BY id, "+f+") as x GROUP BY "+f+") as y ORDER BY count desc")

    rows = curs.fetchall()

    with open(f+"s_"+target+"_"+dateFrom+"-"+dateTo+".csv", mode='w', newline='') as csvfile:
        fieldNames = [f, "count"]
        writer = csv.DictWriter(csvfile, fieldnames=fieldNames)

        writer.writeheader()
        for r in rows:
            row = {f: str(r[0]), "count": int(r[1])}
            writer.writerow(row)


conn.close()