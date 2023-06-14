# niiskus
Väike Discord bott mis vastab niiskusega iga kord kui mainitakse niiskust.

Dockerfile build ja salvestamine build/ kausta: 
##### (see käsk on ka taskina VSCodei kasutajate jaoks olemas)
```
mkdir -p build; sudo docker build -t treierxyz/niiskus-bot -o - . > build/niiskus-bot.tar
```


Laadimine serveris:
```
docker load < niiskus.tar
```