import React, { useState } from 'react'
import  estilos from './App.module.css'
const {pregunta,boton,botonSi,botonNo} = estilos

export default function Pregunta1() {

const [respuesta,setRespuesta] = useState(null);


const parrafo = 'Eres mayor de edad?'


const primeraPregunta =(
    <>
      <div className={pregunta}>
           {parrafo} 
        </div>
        <div>
        <button className={`${boton} ${botonSi}`} onClick={()=>setRespuesta(1)} >SI</button>
        <button className={`${boton} ${botonNo}`} onClick={()=>setRespuesta(0)} >NO</button>
        </div>
        <div>{respuesta===1?'Tu respuesta es Si':respuesta===0?'Tu respuesta es No':''}</div>
    </>
    )

  return (
    <div>
       {primeraPregunta}
    </div>
  )
}
