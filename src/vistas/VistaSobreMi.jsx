import React, { useState } from 'react'
import estilos from '../css/vistasCss/VistaSobreMi.module.css'
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { metodosSchema } from '../configuracion/validacionesZod';
import { v7 } from 'uuid';
import { db } from '../configuracion/indexedDb';
const {cont, contForm,contBotones,boton,input} = estilos;



// aqui pondremos el formulario de ingreso de metodos


export default function VistaSobreMi() {

  const [keyForm,setKeyForm] = useState(0)

  const {register,reset,handleSubmit,formState:{errors}}= useForm({
    resolver:zodResolver(metodosSchema),
    defaultValues:{
      nombre:''
    }

  })


  const guardar = async (datos)=>{
      try {
        const nuevosDatos = {
          ...datos,
          id:v7()
        }
        console.log(keyForm)
         await db.metodos.add(nuevosDatos);
         alert('Metodo creado con exito');
         setKeyForm(anterior => anterior +1);
         reset();
      } catch (error) {
          console.log(error)
      }
  }
  const borrar = ()=>{
          setKeyForm(anterior => anterior +1);
         reset();
  }

    

  return (
    <div className={cont}>
        <form key={keyForm} className={contForm} onSubmit={handleSubmit(guardar)} autoComplete='off'>
          <label>Nombre del Metodo</label>
          <input type="text" {...register('nombre')} className={input}/>
          {errors && <div>{errors.nombre?.message}</div>}
          <div className={contBotones}>
          <button className={boton} type="submit">Guardar</button>
          <button className={boton} type='button' onClick={borrar}>Borrar</button>
          </div>
        </form>
    </div>
  )
}
