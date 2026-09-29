import React, { useEffect } from 'react'
import { useForm } from 'react-hook-form'
import { useC } from '../configuracion/Contexto'
import { db } from '../configuracion/indexedDb';
import { replace, useNavigate } from 'react-router';
import estilos from '../css/vistasCss/VistaInicio.module.css'
const {cont,contForm,inputs,titulo,boton}= estilos

export default function VistaInicio() {

    const {setCargando,setUsuario} = useC();
    const navigate = useNavigate();

    const {register,handleSubmit,reset,setFocus}=useForm({
        defaultValues:{
            nombre:'',
            contraseña:''
        }
    })



    useEffect(()=>{
        setFocus('nombre')
    },[])



    const enviar = async(datos)=>{
        try {
            
            const usuariEncontrado = await db.usuario.where('nombre').equals(datos.nombre).first();
            if(usuariEncontrado && usuariEncontrado.contraseña === datos.contraseña){
                setCargando(false);
                setUsuario({
                    id: usuariEncontrado.id,
                    nombre: usuariEncontrado.nombre,
                    rol:usuariEncontrado.rol
                });
                navigate('/',replace)
                return;
            }
            
            alert('Datos incorrectos')
            reset();

        } catch (error) {
            console.log(error)
        }
    }




  return (
    <div className={cont}>
        <form className={contForm} onSubmit={handleSubmit(enviar)} autoComplete='off'>
            <label className={titulo}>Nombre</label>
            <input type="text"  className={inputs}{...register('nombre')} />
            <label className={titulo}> Contraseña</label>
            <input type="password" className={inputs} {...register('contraseña')} />
            <button type='submit' className={boton}>Entrar</button>
        </form>
    </div>
  )
}
