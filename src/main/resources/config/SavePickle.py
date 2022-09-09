import pandas as pd
import numpy as np
import subprocess
import os
from functools import reduce
import pprint as pp
import pickle

column_names = ["Name", "fasta", "MSA", "AccSolRel", "AccSolAbs", "BindigPar", "SecStru"]

dictionary = {}

#work_dir = "./REMOVED/"
#work_dir = "./PHYSIO_Zinc/"

#work_dir = "./TRAINING_PHYSIO/"

work_dir = "./"


data = np.genfromtxt("file.csv", delimiter=",", dtype=None, skip_header=True)
# print(type(data))
# print(data.size)
# # print(data.shape)
# # print(data[11])
#k1 = file.split('.')[0]
#print(work_dir + k1 + ".hhm.pkl")
#pp.pprint(data)
k1="prova"
if (data.size > 0 ):

    dictionary = {}
    #dictionary[k1] = {}
    a = np.array(data, dtype='i4,S20,S1,f4,f4,i4,S1')
    name, fasta, acsr, acsa, bpar, secstru = [], [], [], [], [], []
    for a, b, c, d, e, f, g in data:
        name.append(b.decode())
        fasta.append(c.decode())
        acsr.append(d)
        acsa.append(e)
        bpar.append(f)
        secstru.append(g.decode())
    #dictionary[k1]["HHM"] = example_dict
    dictionary["name"] = name
    dictionary["fasta"] = fasta
    dictionary["accsolrel"] = acsr
    dictionary["AccSolAbs"] = acsa
    dictionary["bindigpar"] = bpar
    dictionary["secstru"] = secstru
    s = np.empty(0, dtype="float32")
    for i in fasta:
        r = np.zeros(20, dtype="float32")
        if i == "A":
            r[0] = 1.0
        elif i == "C":
            r[1] = 1.0
        elif i == "D":
            r[2] = 1.0
        elif i == "E":
            r[3] = 1.0
        elif i == "F":
            r[4] = 1.0
        elif i == "G":
            r[5] = 1.0
        elif i == "H":
            r[6] = 1.0
        elif i == "I":
            r[7] = 1.0
        elif i == "K":
            r[8] = 1.0
        elif i == "L":
            r[9] = 1.0
        elif i == "M":
            r[10] = 1.0
        elif i == "N":
            r[11] = 1.0
        elif i == "P":
            r[12] = 1.0
        elif i == "Q":
            r[13] = 1.0
        elif i == "R":
            r[14] = 1.0
        elif i == "S":
            r[15] = 1.0
        elif i == "T":
            r[16] = 1.0
        elif i == "V":
            r[17] = 1.0
        elif i == "W":
            r[18] = 1.0
        elif i == "Y":
            r[19] = 1.0
        s=np.append(s,r, axis=0)
    d=s.size
    #s.reshape(int(d/20), 20)
    dictionary["HHM"] = {'PSFM': s.reshape(int(d/20), 20)}



else:
    print("FILE NOT EXIST" +work_dir + k1 + ".hhm.pkl")
#print(dictionary.keys())

pickle_out = open("out.pkl", "wb")
pickle.dump(dictionary, pickle_out)
pickle_out.close()
#pp.pprint(dictionary);