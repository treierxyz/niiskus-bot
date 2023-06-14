# niiskus
Väike Discord bott mis vastab niiskusega iga kord kui mainitakse niiskust.

VSCodei task Docker konteineri ehitamiseks on olemas, aga manuaalselt ehitamiseks:

```
docker build . -t treierxyz/niiskus-bot
docker save treierxyz/niiskus-bot:latest > niiskus-bot.tar
```
Lae salvestatud pilt serveris nii:
```
docker load < niiskus-bot.tar
```