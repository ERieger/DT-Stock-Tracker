<h1 align="center">DT-Stock-Tracker</h1>
<p align="center">DT-Stock-Tracker is an open source and fully self hosted system for automating the process of material ordering. It has been custom built using robust technologies.</p>

## Overview
* **Robust -** Built with well tested and trusted technologies such as Flask, jQuery, Bootstrap, and MongoDB.
* **Fully Self Hosted -** The application can be deployed wherever you choose - it doesn't rely on a single external hosting service.
* **Secure -** Authentication is handeled by google's trusted Auth APIs. Users will already be familiar with the login flow.
* **Simple -** A simple and sleek UI built on the latest version of bootstrap helps simplify the user experience.
## Requirements
* NodeJS Server
* MongoDB Instance
* Dependencies as defined in the `package.json` file developer dependencies are optional
* Google cloud application with oAuth app configured
* Domain for a production deployment
## Installation and Usage
1) Clone the project
```git
git clone https://github.com/ERieger/DT-Stock-Tracker.git
```
2) Create a `/src/config/.env` file and fill in the appropriate varibles.
* `MONGO_DATABASE` - The name of the application database.
* `MONGO_USER` - The database username.
* `MONGO_PASSWORD` - The database password.
* `MONGO_HOST` - The hostname/ip/domain of the mongo database.
* `MONGO_PORT` - The port of the database (mongo default is 27017).
* `GOOGLE_CLIENT_ID` - The client ID available in your google app console.
* `GOOGLE_CLIENT_SECRET` - The client secret available in your google app console.
* `COOKIE_KEY` - A secure key used to generate the auth cookies.
3) Install all required dependencies with
```bash
npm i
```
6) Start the development server with:
```bash
npm run start-dev
```
7) For testing navigate to `localhost:3000/login` (or the domain configured in your google oAuth flow.
