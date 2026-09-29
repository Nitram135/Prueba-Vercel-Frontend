import { useEffect, useState } from 'react';
import estilos from '../css/vistasCss/VistaPrincipal.module.css'
import { useLiveQuery } from 'dexie-react-hooks';
import { db } from '../configuracion/indexedDb';
const {cont,cont1,cont2,texto,imagen}= estilos;

export default function VistaPrincipal() {



    const [src,setSrc] = useState(null);


    const datosTaller = useLiveQuery(async()=>{
        try {
            return await db.taller.toArray();
            
        } catch (error) {
            
        }
    })


    useEffect(()=>{

        if(!datosTaller){
            return;
        }

        const imagenSacada = datosTaller[0].imagen;
        let urlCreada;
        if(imagenSacada instanceof Blob || imagenSacada instanceof File){
            urlCreada = URL.createObjectURL(imagenSacada);
        }
        setSrc(urlCreada);

        return ()=>{
            URL.revokeObjectURL(urlCreada)
        }

    },[datosTaller])


    if(!datosTaller){
        return <div>Esperando datos...</div>
    }

  return (
    <div className={cont} >
        <div className={cont1}>
            <p className={texto}>
                Lorem ipsum, dolor sit amet consectetur adipisicing elit. Autem expedita nam iste impedit vero nostrum illo nobis ea placeat magni tempore, consequuntur nulla est nisi aliquam minima ratione. Voluptates, a!
                                
            </p>
        </div>
        <div className={cont2}>
            <div className={imagen}>
                 <img src={src} alt="Imagen mia" />
            </div>
        </div>
    </div>
  )
}
