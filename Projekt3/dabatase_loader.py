import os
import re
import pymongo
import gzip

from datetime import datetime

conversion = {
    "price": lambda price: float(price) if price != "unknown" else price,
    "score": lambda score: float(score),
    "time": lambda time: datetime.fromtimestamp(float(time)).replace(microsecond=0)
}

def read_data(path):
  with gzip.open(path, 'r') as file:
    read_object = {}
    for data_line in file:
        textual = str(data_line, 'utf-8').strip()
        split_position = textual.find(':')
        if split_position == -1:
            yield(read_object)
            read_object={}
            continue
        slash_position = textual.find('/')

        category = textual[:slash_position]
        if category not in read_object:
            read_object[category] = {}

        field = textual[slash_position+1:split_position]
        value = textual[split_position + 2:]
        if field in conversion:
            try:
                value = conversion[field](value)
            except:
                print("value vas incorrect: ", value)
                exit(1)

        read_object[category][field] = value


def nullable_data(data, type):
    return '{0}'.format(data[type]) if type in data else None


def insert_into_collection(file_path, collection):
    to_insert = []
    for data in read_data(file_path):
        to_insert.append(data)
    collection.insert_many(to_insert)
    print("INSERTION FINISHED OF: " + file_path)

try:
    mongo_client = pymongo.MongoClient("mongodb://root:rootnmbp@localhost:27017")
    database = mongo_client["projekt3"]


    with os.scandir("data/") as entries:
        for entry in entries:
            m = re.match(r"(?P<category>.*).txt.gz", entry.name)
            if(entry.is_file() and m):
                collection = database[m.group('category').lower().replace("_", "-")]
                insert_into_collection(entry.path, collection)

except (Exception) as error:
    print(error)

