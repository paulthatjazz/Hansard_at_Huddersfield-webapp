# -*- coding: utf-8 -*-



import json
import sys
sys.path.append(
    '../../vendor/RAKE')
import rake



def main():

    if len(sys.argv) > 1:

        rake_object = rake.Rake(
            "../../vendor/RAKE/data/stoplists/SmartStoplist.txt", 5, 2, 4)
        sample_file = open(
            "../../tmp/"+sys.argv[1]+".txt", 'r', encoding="utf-8")
        text = sample_file.read()
        keywords = rake_object.run(text)

        l = []

        count = 1
        for aux in keywords[:20]:

            r = dict()
            r["#"] = count
            r["word"] = aux[0]
            r["score"] = aux[1]
            l.append(r)
            count += 1

        json_kw = json.dumps({'data': l, 'count': 20})

        print(json_kw)

    else:
        print(False)


if __name__ == "__main__":
    main()
