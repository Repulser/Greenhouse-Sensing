import pymongo
from flask import Flask, request, jsonify

app = Flask(__name__)
client = pymongo.MongoClient('localhost', 27017)
db = client.greenhouse


def save_ctth(collection, time, temperature, humidity):
    db[collection].insert_one({"time": time, "temperature": temperature, "humidity": humidity})


def get_ctth(collection, ammount):
    return db[collection].find().sort("time", pymongo.DESCENDING).limit(ammount)


def generate_json(cursor):
    object = []
    for document in cursor:
        object.append(dict(
            time=document["time"],
            temperature=document["temperature"],
            humidity=document["humidity"]
        )
        )
    return jsonify(object)


# Get routes
@app.route("/current", methods=["GET"])
def current():
    current = get_ctth("minutely", 1)[0]
    return jsonify(
        temperature=current["temperature"],
        humidity=current["humidity"],
        time=current["time"]
    )


@app.route("/hourly", methods=["GET"])
def hourly():
    return generate_json(get_ctth("minutely", 60))


@app.route("/daily", methods=["GET"])
def dailyget():
    return generate_json(get_ctth("daily", 96))


@app.route("/weekly", methods=["GET"])
def weeklyget():
    return generate_json(get_ctth("weekly", 42))


@app.route("/monthly", methods=["GET"])
def monthlyget():
    return generate_json(get_ctth("monthly", 30))


# Post routes
@app.route("/ctth", methods=['POST'])
def minutely():
    time = request.args["time"]
    temperature = request.args["temperature"]
    humidity = request.args["humidity"]
    save_ctth("minutely", time, temperature, humidity)
    return "Success"


@app.route("/dtth", methods=['POST'])
def daily():
    time = request.args["time"]
    temperature = request.args["temperature"]
    humidity = request.args["humidity"]
    save_ctth("daily", time, temperature, humidity)
    return "Success"


@app.route("/wtth", methods=['POST'])
def weekly():
    time = request.args["time"]
    temperature = request.args["temperature"]
    humidity = request.args["humidity"]
    save_ctth("weekly", time, temperature, humidity)
    return "Success"


@app.route("/mtth", methods=['POST'])
def monthly():
    time = request.args["time"]
    temperature = request.args["temperature"]
    humidity = request.args["humidity"]
    save_ctth("monthly", time, temperature, humidity)
    return "Success"


app.run(host="0.0.0.0", port=6723)
