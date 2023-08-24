# niiskus
[[Eesti keel](./README.et.md) / [English](./README.en.md)]

Lihtne Discord.js-il põhinev bott, mis vastab niiskuse ja muu ilmateatega iga kord kui kanalis mainitakse sobivat märksõna/sõnu.

Boti põhimõte sai alguse sõpradevahelise naljana ühes serveris milles pesitsen tihti, kus inimestel on kombeks kirjutada suvalisel hetkel oma asukoha õhuniiskuse ning tihti tekib ahel mitme sarnase vastusega. See muutus nii tihedaks juhtumiks, et üks päev tuli mul mõte seda automatiseerida ning teha bott, kes vastaks minu eest.

Andmed on võetud Tartu Ülikooli füüsika instituudi ilmajaamast, kuid allikaid võib tulevikus juurde tulla.

## Üles seadmine

Vajalik on `npm` (või muu eelistatud JavaScripti paketihaldur) ning NodeJS.

Lisa `.env` fail, mis sisaldab boti tookenit. Sisu peaks välja nägema selline:
```bash
TOKEN=replace.me.pretty.please
```

Valmista ette sõltuvused ja käivita bott arendaja režiimis järgnevalt:
```bash
npm ci
npm run dev
```
## Docker
Docker pilti saab ehitada nii:
```bash
docker build -t treierxyz/niiskus-bot .
```

`build-docker.sh` ehitab Docker pildi faili ning selleks on vaja Docker `buildx` pluginat. See valmistab `build/niiskus-bot.tar` ja selle saab laadida Dockerisse nii:
```bash
docker load < build/niiskus-bot.tar
```