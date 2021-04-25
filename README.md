## Programrendszerek fejlesztése projektmunka

A projektmunka témája egy sakk "bolt", ahol a bábukat lehet 
megvásárolni.

## Angular

Ez az *angular-frontend* mappában található.

## NodeJS + MongoDB

Ez a *nodejs-backend* mappában található.

## Java EE + PostgreSQL

Ez a *javaee-backend* mappában található. Spring Boot alapú.

## Fejleszői build

 - Angular app indítása: *ng serve* (**http://localhost:4200**)
 - NodeJS szerver indítása: *npm start* (**http://localhost:3080**)

A nodejs mapájában lévő **constants.json** fájlban a *isDebug* attribútumot 
át kell állítani *true*-ra (de ez így van alapértelmezetten).

 - JavaEE szerver indítása: *mvn spring-boot:run* (**http://localhost:8080**)

## Production build

NodeJS + Angular esetén:

 - Angular app buildelése: *ng build --prod* (*dist* mappa létrejön)
 - A *dist* mappa tartalmát át kell másolni a NodeJS szerver *public* mappájába.
 - A nodejs mapájában lévő **constants.json** fájlban a *isDebug* attribútumot át kell állítani *false*-ra. 
 - Az így elkészült NodeJS mappába be kell rakni a **secrets.json** fájlt, ami tartalmazza a herokus URL-t és a MongoDB adatokat (ez a fájl nincs verziózva).

A JavaEE szerver esetén:

 - A főosztályában a DEBUG konstants-t át kell állítani *false*-ra
 - A szerver erőforrásmappájába be kell rakni a **secrets.json**-t, ami a heroku-s URL-t és a PostgreSQL adatokat tartalmazza. Ez nincs verziózva.

## Dokumentáció

Lásd a *docs* mappában.