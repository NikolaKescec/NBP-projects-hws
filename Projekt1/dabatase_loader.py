import os
import re
import psycopg2
import configparser
import gzip

from datetime import date

def retrieve_connection_data(path="./database.ini", config_section="postgresql"):
    parser = configparser.ConfigParser()
    parser.read(path)

    db_connection = {}
    if parser.has_section(config_section):
        params = parser.items(config_section)
        for param in params:
            db_connection[param[0]] = param[1]

    return db_connection


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
        read_object[textual[slash_position+1:split_position]] = textual[split_position + 2:]


def nullable_data(data, type):
    return '{0}'.format(data[type]) if type in data else None


def insert_category(cursor, file_path, description):
    insertion_string = 'INSERT INTO musical_instrument_review(category, reviewed_product_title, reviewer_name, review_time, review_summary, review_text) VALUES(%s, %s, %s, %s, %s, %s)'
    to_insert = []
    for data in read_data(file_path):
        to_insert.append((description, data["title"], data["profileName"], data["time"], data["summary"], data["text"]))
    cursor.executemany(insertion_string, to_insert)
    print("INSERTION FINISHED OF: " + description)

try:
    connection = psycopg2.connect(**retrieve_connection_data())

    cursor = connection.cursor()

    with os.scandir("data/") as entries:
        for entry in entries:
            m = re.match(r"(?P<category>.*).txt.gz", entry.name)
            if(entry.is_file() and m):
                insert_category(cursor, entry.path, m.group('category').replace("_", " "))
        connection.commit()

except (Exception) as error:
    print(error)
finally:
    if (connection):
        cursor.close()
        connection.close()
