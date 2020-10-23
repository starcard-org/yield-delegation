import json
from pprint import pprint
networkId = "1"
networkId2 = "1001"
from os import listdir
from os.path import isfile, join
inpath = "./build/contracts/"
outpath = "./build/clean/"
onlyfiles = [f for f in listdir(inpath) if isfile(join(inpath, f))]
onlyfiles

for file in onlyfiles:
    with open(inpath+file, "r") as f:
        if "json" in file:
            try:
                cleaned = {}
                a = json.loads(f.read())
                cleaned["abi"] = a["abi"]
                cleaned["networks"] = {}
                if (networkId in a["networks"].keys()):
                    cleaned["networks"][networkId] = {}
                    cleaned["networks"][networkId]["links"] = a["networks"][networkId]["links"],
                    cleaned["networks"][networkId]["address"] = a["networks"][networkId]["address"],
                    cleaned["networks"][networkId]["address"] = cleaned["networks"][networkId]["address"][0]
                    cleaned["networks"][networkId]["transactionHash"] = a["networks"][networkId]["transactionHash"]
                if (networkId2 in a["networks"].keys()):
                    cleaned["networks"][networkId2] = {}
                    cleaned["networks"][networkId2]["links"] = a["networks"][networkId2]["links"],
                    cleaned["networks"][networkId2]["address"] = a["networks"][networkId2]["address"],
                    cleaned["networks"][networkId2]["address"] = cleaned["networks"][networkId2]["address"][0]
                    cleaned["networks"][networkId2]["transactionHash"] = a["networks"][networkId2]["transactionHash"]
                with open(outpath+file, "w+") as c:
                    c.write(json.dumps(cleaned))
            except Exception as e:
                print(e)
                print(file)
