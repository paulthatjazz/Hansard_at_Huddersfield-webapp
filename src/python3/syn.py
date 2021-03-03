# -*- coding: utf-8 -*-
"""
Created on Fri Oct  5 10:02:14 2018

@author: smushs5
"""
import json
import sys
import gensim
import warnings
warnings.filterwarnings(action='ignore', category=UserWarning, module='gensim')


def main():

    if len(sys.argv) > 1:

        model = gensim.models.KeyedVectors.load(
            '../../config/models/google_news_test.bin', mmap='r')
        #model = gensim.models.KeyedVectors.load('/site/models/google_news_test.bin', mmap='r')
        model.vectors_norm = model.vectors

        related_terms = model.most_similar(positive=sys.argv[1], topn=5)
        l = []

        for i in related_terms:
            l.append(i[0])

        json_syn = json.dumps({'data': l})

        print(json_syn)

    else:
        print(False)


if __name__ == "__main__":
    main()
