import React, { useEffect, useState } from 'react'
import { FaArrowRight } from 'react-icons/fa6';
import estilos from '../css/vistasCss/VistaTalleres.module.css'
import { useLiveQuery } from 'dexie-react-hooks';
import { db } from '../configuracion/indexedDb';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { listaAnalisisSchema } from '../configuracion/validacionesZod';
import FiltroBusqueda from '../componentes/FiltroBusqueda';
import { v7 } from 'uuid';
    const {cont, formulario}=estilos; 


// aqui pondremos el formulario de ingreso de analisis





export default function VistaTalleres() {


    const [keyForm,setKeyForm] = useState(0); 


  const {register,handleSubmit,reset,formState:{errors},control, setValue}= useForm({
    resolver:zodResolver(listaAnalisisSchema),
    defaultValues:{
        codigo:'',
        nombre:'',
        metodo:'',
        metodoVista:''
    }
  })




    const enviar = async (datos)=>{
        try {   
            
            const { metodoVista, ...resto} = datos;
            resto.id = v7();
            await db.listaAnalisis.add(resto);
            alert('Exito al crear el analisis')
            setKeyForm(a=> a +1)
            reset()
        } catch (error) {
            console.log(error)
        }

    }


    return (
            <>
                <div className={cont}>
                    <form className={formulario} key={keyForm} onSubmit={handleSubmit(enviar)} autoComplete='off'>
                        <label>Codigo</label>
                        <input type="text" {...register('codigo')} />
                        <label>Nombre de Analisis</label>
                        <input type="text" {...register('nombre')} />
                        <label>Metodo</label>
                        <FiltroBusqueda control={control} register={register} setValue={setValue} campo={'metodo'}/>
                        <button type="submit">Enviar</button>
                        <button  type='button' onClick={()=> reset()}>Borrar</button>
                    </form>
                </div>
            </>
    )
    }
