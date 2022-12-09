# Standalone Python File to update the typeahead json files
import psycopg2
import json

conn = psycopg2.connect(
    host = "localhost",
    database = "hansard",
    user= "hansard",
    password = "hansard",
    port = "5433")


curs = conn.cursor()

curs.execute("SELECT DISTINCT member from hansard_commons.commons;")

rows = curs.fetchall()

lords = []
commons = []
both = []

for r in rows:
    commons.append(r[0])
    both.append(r[0])

curs.execute("SELECT DISTINCT member from hansard_lords.lords;")

rows = curs.fetchall()

for r in rows:
    lords.append(r[0])
    both.append(r[0])


with open('members_lords.json', 'w') as out:
    json.dump(lords, out)

with open('members_commons.json', 'w') as out:
    json.dump(commons, out)

with open('members_both.json', 'w') as out:
    json.dump(lords, out)
    json.dump(commons, out)

conn.close()