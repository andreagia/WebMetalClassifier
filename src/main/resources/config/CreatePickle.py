import pickle
import numpy
import pprint as pp

#with open("7fis_A_7fis_5_OK.dict.pkl", 'rb') as inpickle:
with open("out.pkl", 'rb') as inpickle:
    e = pickle.load(inpickle)

#print(e["PSFM"].shape)
#pp.pprint(e)
pp.pprint(e["HHM"])