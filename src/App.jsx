import React, { useEffect } from 'react';
import { v7 } from 'uuid';
import estilos from'./App.module.css'
import { db } from './configuracion/indexedDb';
const {contenedorPadre} = estilos;




function App() {

    const crearPreguntas = async()=>{
      try {

      const lista = [
        {id:v7(),pregunta:'Donde vives?'},
        {id:v7(),pregunta:'Cual es tu color favorito?'},
        {id:v7(),pregunta:'Prefieres el invierno o verano?'},
        {id:v7(),pregunta:'Te gusto este formulario?'}
      ]
        
        await db.preguntas.bulkAdd(lista);
        console.log('logrado')
      } catch (error) {
        console.log(error)
      }
      
    }

   useEffect(() => {
    crearPreguntas();
  }, []);
   
    return (
      <>
      <div className={contenedorPadre}>
        <form>
        </form>
      </div>
      </>
    )
}

export default App
