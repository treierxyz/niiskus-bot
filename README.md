# niiskus
Väike Discord bott mis vastab niiskusega iga kord kui mainitakse niiskust.

Dockerfile build:
```
docker build . -t treierxyz/niiskus-bot
```

Docker pildi salvestamiseks saab kasutada:
```
docker save treierxyz/niiskus-bot:latest > niiskus.tar
```

Laadimine käib suht sarnaselt:
```
docker load < niiskus.tar
```