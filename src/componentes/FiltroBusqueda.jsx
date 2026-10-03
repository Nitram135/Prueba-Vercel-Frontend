import { useLiveQuery } from 'dexie-react-hooks'
import React, { useEffect, useMemo, useState } from 'react'
import { db } from '../configuracion/indexedDb'
import { useWatch } from 'react-hook-form';
import estilos from '../css/componentesCss/FiltroBusqueda.module.css'
const {cont,entrada,eleccion,desplegable,opcion}= estilos; 

export default function FiltroBusqueda({control,register,setValue,campo}) {

       const [lista,setLista] = useState(null);
       const [indice,setIndice] = useState(0);
       const [seleccion,setSeleccion]= useState(null);
       const [verLista, setVerLista] = useState(false);

    const metodosTodos = useLiveQuery(async()=>{
        const datos  =  await db.metodos.toArray();
        return  datos;
    });
    const busqueda = useWatch({control,name:`${campo}Vista`, defaultValue:''})



    useEffect(()=>{

            if(!metodosTodos) return;
            let temporizador;
            if(busqueda && seleccion !== busqueda){
                temporizador = setTimeout(()=>{
                    const nuevaLista = metodosTodos.filter((i)=> i.nombre.startsWith(busqueda));
                    setLista(nuevaLista);
                    setVerLista(true)
                },300)
            }else{
                setLista(null);
                setVerLista(false)
            }

            return()=>{
                clearTimeout(temporizador)
            }


    },[metodosTodos,busqueda])

       const moverLista = (e)=>{
            if(e.key === 'ArrowDown'){
                e.preventDefault();
                setIndice((a)=> a === lista.length -1? 0 : a +1)
            }else if(e.key === 'ArrowUp'){
                e.preventDefault();
                setIndice((a)=> a === 0 ? lista.length -1: a -1)
            }else if(e.key === 'Enter'){
                e.preventDefault();
                setSeleccion(lista[indice].nombre)
                setValue(`${campo}`,lista[indice].id)
                setValue(`${campo}Vista`,lista[indice].nombre)
                setVerLista(false)
            }else if (e.key === 'Esc'){
                e.preventDefault();
            }
       } 


    if(!metodosTodos){
        return <div>Esperando datos...</div>
    }
  return (
    <div className={cont}>
        <input type="text" {...register(`${campo}`)} hidden/>
        <input type="text" {...register(`${campo}Vista`)}  onKeyDown={(e)=>moverLista(e)} className={entrada}/>
        <div className={desplegable}>
            {
              (lista && lista.length > 0 && verLista) && lista.map((i,index)=>(
                  <div key={i.id} className={indice === index? eleccion: opcion}>{i.nombre}</div>  
              ))      
            }
        </div>    
    </div>
  )
}
