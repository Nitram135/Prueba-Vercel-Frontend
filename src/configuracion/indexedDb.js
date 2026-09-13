import {Dexie} from "dexie";

const db = new Dexie('baseDatos');

db.version(1).stores({
    preguntas:'id, pregunta'
})


export {db};