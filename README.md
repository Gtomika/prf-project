## Programrendszerek fejlesztése projektmunka

A projektmunka témája egy sakk "bolt", ahol a bábukat lehet 
megvásárolni.

## Angular

Ez az angular-frontend mappában található.

## NodeJS + MongoDB

Ez a nodejs-backend mappában található.

## Java EE + PostgreSQL

Ez a javaee-backend mappában található.

## Fejleszői build

 - Angular app indítása: *ng serve* (**localhost:4200**)
 - NodeJS szerver indítása: *npm start* (**localhost:3080**)

Az angularos **proxy.conf.json** fájlbna van megadva, hogy 
minden API hívást továbbítania kell a NodeJS szervernek.

## Production build

 - Angular app buildelése: *ng build --prod* (*dist* mappa létrejön)
 - A *dist* mappát át kell másolni a NodeJS szerver mappájába.
 
Ha a NodeJS szerver látja, hogy létezik a *dist* mappa, akkor a root URL-en 
az Angular alkalmazást fogja visszaadni.
 

## Dokumentáció

Lásd a *docs* mappában.