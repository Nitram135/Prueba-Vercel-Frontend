import {Dexie} from "dexie";

const db = new Dexie('baseDatos');

db.version(1).stores({
    datosPers: 'id, nombre, apellido, fechaNaci, dni',
    turno: 'id, ingresoId',
    listaAnalisis: 'id, codigo, nombre, metodo',
    metodos: 'id, nombre'
})


export {db};