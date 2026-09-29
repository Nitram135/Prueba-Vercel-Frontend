import React, { useEffect, useRef, useState } from 'react'
import estilos from '../css/vistasCss/VistaMiPerfil.module.css'
const {cont,ventana,carril,elemento}  = estilos;
export default function VistaMiPerfil() {


        const [mover, setMover] = useState(true);
        const [indice, setIndice] = useState(0);

        let despliegue = -100 * indice
       
   useEffect(()=>{

    const intervalo  = setInterval(()=>{
        setMover(true)
        setIndice(anterior => anterior +1)
    },1500)
    return()=>clearInterval(intervalo)
   },[])

   useEffect(()=>{
    let temporizador;
    if(indice === 3){
        temporizador = setTimeout(()=>{
            setMover(false);
            setIndice(0);
        },500)
    }

    return ()=>clearTimeout(temporizador)
   },[indice])


  return (
    <div className={cont}>

        <div className={ventana}>
            <div className={carril} style={{transform: `translateX(${despliegue}%)`,transition: mover? 'transform 0.5s ease': 'none'}}>
              <div className={elemento}></div>
              <div className={elemento}></div>
              <div className={elemento}></div>
              <div className={elemento}></div>  
           </div>
        </div>

    </div>
  )
}
