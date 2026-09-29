    import React, { useEffect, useState } from 'react'
    import { FaArrowRight } from 'react-icons/fa6';
    import estilos from '../css/vistasCss/VistaTalleres.module.css'
    import { useLiveQuery } from 'dexie-react-hooks';
    import { db } from '../configuracion/indexedDb';
    const {cont,contGrid1,contGrid2,contImagen,contTexto,contBoton,botonReservar}=estilos; 




    function Seccion ({indice,texto,imagen}){

            const [srcImagen, setSrcImagen] = useState(null);
            useEffect(()=>{

                if(!imagen){
                 setSrcImagen(null);
                 return; 
                }                
                const archivo = (imagen instanceof FileList || Array.isArray(imagen))? imagen[0]: imagen;
                let urlCreada = null;
                if(archivo instanceof Blob || archivo instanceof File){
                     urlCreada = URL.createObjectURL(archivo);
                    setSrcImagen(urlCreada);
                }else if ( typeof archivo === 'string'){
                    setSrcImagen(archivo);
                }

                return ()=>{
                    if(urlCreada){
                        URL.revokeObjectURL(urlCreada);
                    }
                }
            },[imagen]) 

        return (
            <div className={(indice%2 === 0)? contGrid1: contGrid2}>
                <div className={contImagen}>
                    {srcImagen &&   
                    <img src={srcImagen} alt="imagen" />
                    }
                </div>
                <div className={contTexto}>
                <p>{texto}</p> 
                </div>
                <div className={contBoton}>
                    <button className={botonReservar}>Reservar Taller <FaArrowRight/></button>
                </div>
            </div>
        )
        

    }



    export default function VistaTalleres() {


        const datosTaller = useLiveQuery(async()=>{

           const datos =  await db.taller.toArray();
           console.log(datos)
            return datos;
        })


       if(!datosTaller){
        return <div>Esperando datos...</div>
       }

    return (
        <div className={cont}>
            {
                datosTaller.map((item,index)=>(
                <Seccion key={index} indice={item.posicion} texto={item.texto} imagen={item.imagen}/>
                ))
            }
        </div>
    )
    }
