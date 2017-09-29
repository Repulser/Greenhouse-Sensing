import requests
from datetime import datetime
import Adafruit_DHT
import sys

ip = "ip"
sensor = Adafruit_DHT.DHT22
pin = 23

humidity, temperature = Adafruit_DHT.read_retry(sensor, pin)
if humidity and temperature:
    requests.post("http://" + ip + "/" + sys.argv[1],
                  params={"time": str(datetime.now()), "humidity": humidity, "temperature": temperature},
                  timeout=5)
