# niiskus

> Discord.js weather bot

[![GitHub License](https://img.shields.io/github/license/treierxyz/niiskus-bot)](https://github.com/treierxyz/niiskus-bot/blob/main/LICENSE)
[![GitHub Workflow Status (with event)](https://img.shields.io/github/actions/workflow/status/treierxyz/niiskus-bot/docker-publish.yml)](https://github.com/treierxyz/niiskus-bot/actions/workflows/docker-publish.yml)
[![GitHub Container Registry](https://img.shields.io/badge/ghcr.io-latest-deepskyblue)](https://ghcr.io/treierxyz/niiskus-bot)

A Discord.js bot, which replies with relevant weather data according to keywords. "niiskus" is the Estonian word for "humidity".

The data is fetched from the University of Tartu Institute of Physics' weather station, but more data sources may be added in the future.

The concept of the bot started as an inside joke on a Discord server I frequent, which became so commonplace that one day, I got the idea to automate it and create a bot that would reply for me.

## Setup

`npm` and NodeJS (or any other compatible JavaScript package manager/runtime) are required.

Use this environment variable to supply the bot token, either in a `.env` file or otherwise:
```bash
TOKEN=replace.me.pretty.please
```

The following commands install the dependencies and run the bot in developer mode:
```bash
npm install
npm run dev
```
## Docker
You can pull the latest stable release from `ghcr.io/treierxyz/niiskus-bot:latest`

Alternatively you can use the provided Dockerfile to build an image:
```bash
docker build -t treierxyz/niiskus-bot .
```