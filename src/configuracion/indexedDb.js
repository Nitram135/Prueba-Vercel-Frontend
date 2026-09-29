import {Dexie} from "dexie";

const db = new Dexie('baseDatos');

db.version(1).stores({
    usuario: 'id, nombre, contraseña, rol'
})

db.version(2).stores({
    usuario: 'id, nombre, contraseña, rol',
    taller: 'id, texto, posicion'
})


export {db};