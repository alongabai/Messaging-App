import os
import requests

from flask import Flask, render_template, redirect, url_for, request, jsonify
from flask_socketio import SocketIO, emit

app = Flask(__name__)
app.config["SECRET_KEY"] = os.getenv("SECRET_KEY")
socketio = SocketIO(app)
socketio.init_app(app, cors_allowed_origins="*")

i=0
channelsName = []
channels = []
channels.append([])
channelsName.append({"name": "family", "index": i})
i+=1
channels.append([])
channelsName.append({"name": "work", "index": i})
i+=1
channels.append([])
channelsName.append({"name": "tennis", "index": i})
i+=1

input = "family"
for group in channelsName:
    if group["name"] is input:
        channels[group["index"]].append({"name": "Ashley", "Message":"Hi guys what's up?"})
        channels[group["index"]].append({"name": "Eden", "Message":"Great! Wanna catch a dinner tonight?"})
        channels[group["index"]].append({"name": "Alice", "Message":"Can't really... I have a rehearsal tonight, BTW Are you guys coming to my show?"})
        channels[group["index"]].append({"name": "Ashley", "Message":"Hi guys what's up?"})
        channels[group["index"]].append({"name": "Eden", "Message":"Great! Wanna catch a dinner tonight?"})
        channels[group["index"]].append({"name": "Alice", "Message":"Can't really... I have a rehearsal tonight, BTW Are you guys coming to my show?"})
        channels[group["index"]].append({"name": "Ashley", "Message":"Hi guys what's up?"})
        channels[group["index"]].append({"name": "Eden", "Message":"Great! Wanna catch a dinner tonight?"})
        channels[group["index"]].append({"name": "Alice", "Message":"Can't really... I have a rehearsal tonight, BTW Are you guys coming to my show?"})
        channels[group["index"]].append({"name": "Ashley", "Message":"Hi guys what's up?"})
        channels[group["index"]].append({"name": "Eden", "Message":"Great! Wanna catch a dinner tonight?"})
        channels[group["index"]].append({"name": "Alice", "Message":"Can't really... I have a rehearsal tonight, BTW Are you guys coming to my show?"})
        channels[group["index"]].append({"name": "Ashley", "Message":"Hi guys what's up?"})
        channels[group["index"]].append({"name": "Eden", "Message":"Great! Wanna catch a dinner tonight?"})
        channels[group["index"]].append({"name": "Alice", "Message":"Can't really... I have a rehearsal tonight, BTW Are you guys coming to my show?"})
        channels[group["index"]].append({"name": "Ashley", "Message":"Hi guys what's up?"})
        channels[group["index"]].append({"name": "Eden", "Message":"Great! Wanna catch a dinner tonight?"})
        channels[group["index"]].append({"name": "Alice", "Message":"Can't really... I have a rehearsal tonight, BTW Are you guys coming to my show?"})

input = "work"
for group in channelsName:
    if group["name"] is input:
        channels[group["index"]].append({"name": "Chloe", "Message":"Are you coming to work tomorrow?"})
        channels[group["index"]].append({"name": "Naomi", "Message":"Yes! WBU?"})
        channels[group["index"]].append({"name": "Emma", "Message":"I don't think I can"})
        channels[group["index"]].append({"name": "Chloe", "Message":"Are you coming to work tomorrow?"})
        channels[group["index"]].append({"name": "Naomi", "Message":"Yes! WBU?"})
        channels[group["index"]].append({"name": "Emma", "Message":"I don't think I can"})
        channels[group["index"]].append({"name": "Chloe", "Message":"Are you coming to work tomorrow?"})
        channels[group["index"]].append({"name": "Naomi", "Message":"Yes! WBU?"})
        channels[group["index"]].append({"name": "Emma", "Message":"I don't think I can"})
        channels[group["index"]].append({"name": "Chloe", "Message":"Are you coming to work tomorrow?"})
        channels[group["index"]].append({"name": "Naomi", "Message":"Yes! WBU?"})
        channels[group["index"]].append({"name": "Emma", "Message":"I don't think I can"})
        channels[group["index"]].append({"name": "Chloe", "Message":"Are you coming to work tomorrow?"})
        channels[group["index"]].append({"name": "Naomi", "Message":"Yes! WBU?"})
        channels[group["index"]].append({"name": "Emma", "Message":"I don't think I can"})
        channels[group["index"]].append({"name": "Chloe", "Message":"Are you coming to work tomorrow?"})
        channels[group["index"]].append({"name": "Naomi", "Message":"Yes! WBU?"})
        channels[group["index"]].append({"name": "Emma", "Message":"I don't think I can"})


@app.route("/")
def index():
    return render_template('layout.html')

@socketio.on("setup")
def setup(currentChannel):
    emit("setup", {"channel": channels[int(currentChannel["channel"])]})

@socketio.on("submit message")
def postmessage(data):
    if len(channels[int(data["channel"])]) > 100:
        channels[int(data["channel"])].remove(0)
    channels[int(data["channel"])].append({"name": data["name"], "Message": data["Message"]})
    emit("all messages", {"name": data["name"], "Message": data["Message"], "channel": data["channel"]}, broadcast=True)

@socketio.on("change channel")
def changechannel(data):
    index = 0
    input = data["name"]
    for group in channelsName:
        if group["name"] == input:
            index = group["index"]
    emit("change the channel", {"index": index, "channel": channels[index]})

@socketio.on("add channel")
def addchannel(data):
    global i
    name = data["ChannelName"]
    for group in channelsName:
        if group["name"] == name:
            emit("Error-Channel-Name", {"channelName": name})
            break

    channels.append([])
    channelsName.append({"name": name, "index": i})
    i+=1
    emit("add channel", {"channelName": name})