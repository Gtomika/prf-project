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

A nodejs mapájában lévő **constants.json** fájlban a *isDebug* attribútumot 
át kell állítani *true*-ra (de ez így van alapértelmezetten).

## Production build

 - Angular app buildelése: *ng build --prod* (*dist* mappa létrejön)
 - A *dist* mappát át kell másolni a NodeJS szerver gyökér mappájába.
 
A nodejs mapájában lévő **constants.json** fájlban a *isDebug* attribútumot 
át kell állítani *false*-ra. 

 - Az így elkészült NodeJS mappába be kell rakni a **secrets.json** fájlt, ami tartalmazza a herokus URL-t és a MongoDB adatokat (ez a fájl nincs verziózva).

## Dokumentáció

Lásd a *docs* mappában.