import { useEffect, useState } from 'react';
import estilos from '../css/vistasCss/VistaPrincipal.module.css';
import { useLiveQuery } from 'dexie-react-hooks';
import { db } from '../configuracion/indexedDb';
import { useFieldArray, useForm, useWatch } from 'react-hook-form';
import estiloBusqueda from '../css/componentesCss/FiltroBusqueda.module.css'
const {cont,contPedido,contPers,contBuscador,elPedido,contElP,el,contInput} = estilos;
import dayjs from 'dayjs';
import { v7 } from 'uuid';
import { zodResolver } from '@hookform/resolvers/zod';
import { recepcionSchema } from '../configuracion/validacionesZod';
import { useC } from '../configuracion/Contexto';

// aqui pondremos el formulario de ingreso de pacientes

function Busqueda ({register,campo,control, setValue,lista,append}){

    const[indice,setIndice] = useState(0);
    const[verLista,setVerLista]= useState(false);
    const[filtro, setFiltro]=useState(null);

    const busqueda = useWatch({control,name:campo,defaultValue:''}).toUpperCase();

      useEffect(()=>{

            if(!lista || lista.length <= 0)return;
            let temporizador;
            if(busqueda){
                temporizador =setTimeout(()=>{
                    const nuevaLista = lista.filter((i)=> i.nombre.startsWith(busqueda) || i.codigo.startsWith(busqueda));
                    setFiltro(nuevaLista)
                    setVerLista(true);
                },500)
            }else{
                setFiltro(null);
                setVerLista(false);
            } 
            return ()=>{
                clearTimeout(temporizador)
            }

      },[busqueda,lista])  


      const mover = (e)=>{
           if(e.key === 'ArrowDown'){
            e.preventDefault();
            setIndice(a=> a === filtro.length -1? 0: a +1)
           }else if(e.key === 'ArrowUp'){
            e.preventDefault();
            setIndice(a=> a === 0? filtro.length -1: a -1)
           } else if(e.key === 'Enter'){
            e.preventDefault();
            append({
                determinacion: filtro[indice]?.id,
                nombre: filtro[indice]?.nombre,
                resultado:''
            });
            setValue(campo,'');
            setIndice(0);
            setVerLista(false);
           }
      }


    return(
        <div className={estiloBusqueda.cont}>
            <input type="text" {...register(campo)} onKeyDown={(e)=> mover(e)} className={estiloBusqueda.entrada}/>
            <div className={estiloBusqueda.desplegable}>
              {
                (verLista && Array.isArray(filtro) && filtro.length > 0)?filtro.map((i,index)=>(
                    <div key={i.id}  className={(index === indice? estiloBusqueda.eleccion: estiloBusqueda.opcion)}>{`${i.codigo} - ${i.nombre}`}</div>
                )):(verLista && (!Array.isArray(filtro) || filtro.length <= 0))? 'no se encuentran coincidencias':''
              }  
            </div>
        </div>
    )
}



export default function VistaPrincipal() {


    const[keyForm,setKeyForm]= useState(0);
    const {datosMemo,cargando}= useC();



    
const {register,handleSubmit,formState:{errors},reset,control,setValue,watch}= useForm({
         resolver: zodResolver(recepcionSchema),
        defaultValues:{
            nombre:'',
            apellido:'',
            dni:'',
            fechaNaci:'',
            analisis:'',
            pedido:[]
        }
})


  const {fields,append,remove} = useFieldArray({
    control,
    name:'pedido',
    defaultValue:[{determinacion:'',resultado:''}]
  })

    const guardar = async(datos)=>{
        try {
            const {pedido,analisis,fechaNaci, ...resto} = datos; 
            const idPersona = v7();
            const idTurno = v7();
            const fechaIngreso = dayjs().toISOString();
            const fechaNaciISO = dayjs(fechaNaci).toISOString();
             const pedidoSinNombres = pedido.map((i)=>(
                {determinacion:i.determinacion, resultado:i.resultado}
             )) 
             const dPers = {
                 id:idPersona,
                 nombre: resto.nombre,
                 apellido:resto.apellido,
                 dni:resto.dni,
                 fechaNaci:fechaNaciISO,
             } 
              const dTurno = {
                  id:idTurno,
                  idPers:idPersona,
                  pedido: pedidoSinNombres,
                  fechaIngreso:fechaIngreso
              }
              await Promise.all([
                  db.datosPers.add(dPers),
                  db.turno.add(dTurno)
              ])
               alert('Exito');
               setKeyForm(a=> a +1)
               reset()  

        } catch (error) {
            console.log(error)
        }
    }


    const borrar = ()=>{
        reset();
        setKeyForm(a => a +1);
    }


if(!datosMemo || cargando){
   return <div>Esperando datos...</div>
 }


  return(
    <> 
        <form key={keyForm} className={cont} onSubmit={handleSubmit(guardar)} autoComplete='off'>
            <div className={contPers}>
              <div className={contInput}>
                <label>Nombre</label>
                <input type="text" {...register('nombre')} />
                {errors.nombre && <div>{errors.nombre?.message}</div>}
              </div> 
              <div className={contInput}>
                <label>Apellido</label>
                <input type="text" {...register('apellido')} />
                {errors.apellido && <div>{errors.apellido?.message}</div>}
              </div> 
              <div className={contInput}>
                <label>DNI</label>
                <input type="text" {...register('dni')} />
                {errors.dni && <div>{errors.dni?.message}</div>}
              </div>
              <div className={contInput}>
                <label>Fecha de Nacimiento</label>
                <input type="date" {...register('fechaNaci')} />
                {errors.fechaNaci && <div>{errors.fechaNaci?.message}</div>}
              </div>   

            </div>
            <div className={contPedido}>
                <div className={contBuscador}>
                <label>Buscador</label>    
                <Busqueda lista={datosMemo.arrayAnalisis} register={register} control={control} setValue={setValue} campo={'analisis'} append={append}/>
                </div>
            <div className={contElP}>
            <label>Pedido</label>
                { fields.map((i,index)=>(
                    <div key={i.id} className={elPedido}>
                        <div>{i.nombre}</div>
                        <div onClick={()=>remove(index)} className={el}>{'X'}</div>
                    </div>
                ))}
            </div>
            </div>
            <div>
                <button type="submit">Guardar</button>
                <button type="button" onClick={borrar}>Borrar</button>
            </div>
        </form>
    </>
  )
}