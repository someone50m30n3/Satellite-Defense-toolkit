#!/usr/bin/env python3
# app.py – Satellite Defense Toolkit Web GUI backend

from flask import Flask, request, jsonify, send_from_directory
from flask_cors import CORS
from flask_socketio import SocketIO, emit
import json
import os
import subprocess
import threading
import time
import uuid
from datetime import datetime

app = Flask(__name__, static_folder='.')
CORS(app)
socketio = SocketIO(app, cors_allowed_origins="*")

MODULES_PATH = "modules.json"
AGENTS_PATH = "agents.json"
AUDIT_LOG_PATH = "logs/audit.json"

os.makedirs("logs", exist_ok=True)
if not os.path.exists(AUDIT_LOG_PATH):
    with open(AUDIT_LOG_PATH, "w") as f:
        json.dump([], f)

# Load module metadata
def load_modules():
    if not os.path.exists(MODULES_PATH):
        return []
    with open(MODULES_PATH, "r") as f:
        return json.load(f)

# Load agent inventory
def load_agents():
    if not os.path.exists(AGENTS_PATH):
        return []
    with open(AGENTS_PATH, "r") as f:
        return json.load(f)

# Append audit event
def log_audit(event):
    now = datetime.utcnow().isoformat()
    with open(AUDIT_LOG_PATH, "r+") as f:
        data = json.load(f)
        data.append({"timestamp": now, "event": event})
        f.seek(0)
        json.dump(data, f, indent=2)

# WebSocket thread-safe emit
def stream_output(process):
    for line in iter(process.stdout.readline, b''):
        text = line.decode().strip()
        socketio.emit('log', text)
    process.stdout.close()

@app.route("/api/modules")
def api_modules():
    return jsonify(load_modules())

@app.route("/api/agents")
def api_agents():
    return jsonify(load_agents())

@app.route("/api/audit")
def api_audit():
    with open(AUDIT_LOG_PATH) as f:
        return jsonify(json.load(f))

@app.route("/api/run", methods=["POST"])
def api_run():
    data = request.json
    module = data.get("module")
    agent = data.get("agent")
    if not module or not agent:
        return jsonify({"success": False, "error": "Missing parameters"})

    cmd = f"python3 modules/{module}"
    log_audit(f"Executing {module} on agent {agent}")

    def execute():
        try:
            proc = subprocess.Popen(cmd, shell=True, stdout=subprocess.PIPE, stderr=subprocess.STDOUT)
            stream_output(proc)
        except Exception as e:
            socketio.emit('log', f"[error] {str(e)}")

    thread = threading.Thread(target=execute)
    thread.start()

    return jsonify({"success": True, "status": "Module running"})

@app.route("/api/copilot", methods=["POST"])
def api_copilot():
    prompt = request.json.get("prompt", "").strip().lower()
    if not prompt:
        return jsonify({"response": "Empty prompt."})

    # Dummy Copilot logic for now
    if "analyze telemetry" in prompt:
        response = "Telemetry analysis started: monitoring entropy and anomalies."
    elif "recommend defense" in prompt:
        response = "Recommended: Enable GNSS anti-spoofing filter + RF burst monitor."
    else:
        response = f"Received: {prompt}. No match found."

    log_audit(f"Copilot used: {prompt}")
    return jsonify({"response": response})

@socketio.on('connect')
def handle_connect():
    emit('log', "[Connected to Satellite Toolkit Dashboard]")

if __name__ == "__main__":
    socketio.run(app, host='0.0.0.0', port=5000)
