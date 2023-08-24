#!/bin/sh

IMAGE_NAME="treierxyz/niiskus-bot"
BUILDER_NAME="niiskus-bot-builder"

mkdir -p build
docker buildx create --use --name "$BUILDER_NAME"
docker buildx build -t $IMAGE_NAME -o type=docker,dest=build/niiskus-bot.tar .
docker buildx rm "$BUILDER_NAME"
