from flask import Flask, request
from pymongo import MongoClient

app = Flask(__name__)
client = MongoClient('localhost', 27017)
db = client.greenhouse


def save_ctth(collection, time, temperature, humidity):
    db[collection].insert_one({"time": time, "temperature": temperature, "humidity": humidity})


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
