import { useEffect, useState } from 'react';
import estilos from '../css/vistasCss/VistaPrincipal.module.css';
import { useLiveQuery } from 'dexie-react-hooks';
import { db } from '../configuracion/indexedDb';

const { cont, cont1, cont2, texto, imagen } = estilos;

export default function VistaPrincipal() {
  const [src, setSrc] = useState(null);

  // 1. Simplificamos la consulta Dexie
  const datosTaller = useLiveQuery(() => db.taller.toArray());

  useEffect(() => {
    // 2. Validamos que existan datos Y que el arreglo tenga al menos un registro
    if (!datosTaller || datosTaller.length === 0) {
      setSrc(null);
      return;
    }

    // Usamos Optional Chaining (?.) por seguridad
    const imagenSacada = datosTaller[0]?.imagen;
    let urlCreada = null;

    if (imagenSacada instanceof Blob || imagenSacada instanceof File) {
      urlCreada = URL.createObjectURL(imagenSacada);
    }
    setSrc(urlCreada);

    return () => {
      if (urlCreada) {
        URL.revokeObjectURL(urlCreada);
      }
    };
  }, [datosTaller]);

  // Si IndexedDB todavía está leyendo
  if (datosTaller === undefined) {
    return <div>Cargando datos...</div>;
  }

  // Si terminó de leer pero no hay ningún registro cargado
  if (datosTaller.length === 0) {
    return <div>No hay registros en el taller todavía.</div>;
  }

  return (
    <div className={cont}>
      <div className={cont1}>
        <p className={texto}>
          Lorem ipsum, dolor sit amet consectetur adipisicing elit. Autem
          expedita nam iste impedit vero nostrum illo nobis ea placeat magni
          tempore.
        </p>
      </div>
      <div className={cont2}>
        <div className={imagen}>
          {src ? (
            <img src={src} alt="Imagen taller" />
          ) : (
            <p>Sin imagen guardada</p>
          )}
        </div>
      </div>
    </div>
  );
}