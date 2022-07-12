<h1 align="center">DT-Stock-Tracker</h1>
<p align="center">DT-Stock-Tracker is an open source and fully self hosted system for automating the process of material ordering. It has been custom built using robust technologies.</p>

## Overview
* **Robust -** Built with well tested and trusted technologies such as Flask, jQuery, Bootstrap, and MongoDB.
* **Fully Self Hosted -** The application can be deployed wherever you choose - it doesn't rely on a single external hosting service.
* **Secure -** Authentication is handeled by google's trusted Auth APIs. Users will already be familiar with the login flow.
* **Simple -** A simple and sleek UI built on the latest version of bootstrap helps simplify the user experience.
## Requirements
* Python 3
* MongoDB Instance
* Dependencies from requirements.txt
* Google cloud application with oAuth app configured
* Domain
## Installation and Usage
1) Clone the project
```git
git clone https://github.com/ERieger/DT-Stock-Tracker.git
```
2) Create mongo_uri.py file in the root folder containing a valid database connection string.
```python
uri = [YOUR VALID CONNECTION STRING]
```
3) Install all required dependencies with
```bash
pip3 install -R requirements.txt
```
6) Start the server with:
```bash
python3 server.py
```
7) For testing navigate to `localhost:5500/login` (or the domain configured in your google oAuth flow.
