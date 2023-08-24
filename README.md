# niiskus
[[Eesti keel](./README.et.md) / [English](./README.md)]

A simple Discord.js bot, which replies with humidity and other relevant weather data every time a keyword(s) is mentioned in a channel.

The concept of the bot started as an inside joke on a server I frequent, where people tend to randomly post the relative humidity of their location, more often than not followed by a chain of similar replies. This became so commonplace that one day, I got the idea to automate it and create a bot that would reply for me.

The data is taken from the University of Tartu Institute of Physics' weather station, but more data sources may be added in the future.

## Setup

`npm` (or any other preferred JavaScript package manager) and NodeJS are required.

Create a `.env` file which will contain the token for your bot. The contents should look like this:
```bash
TOKEN=replace.me.pretty.please
```

The following commands install the dependencies and run the bot in developer mode:
```bash
npm ci
npm run dev
```
## Docker
A Docker image can be built as such:
```bash
docker build -t treierxyz/niiskus-bot .
```

`build-docker.sh` builds a Docker image file and requires the Docker `buildx` plugin. This generates `build/niiskus-bot.tar`, which can be loaded into Docker as such:
```bash
docker load < niiskus-bot.tar
```