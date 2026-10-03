import { useEffect, useState } from 'react';
import estilos from '../css/vistasCss/VistaPrincipal.module.css';
import { useLiveQuery } from 'dexie-react-hooks';
import { db } from '../configuracion/indexedDb';
import { useFieldArray, useForm, useWatch } from 'react-hook-form';
import estiloBusqueda from '../css/componentesCss/FiltroBusqueda.module.css'
const {cont,contPedido,contPers,contBuscador,elPedido,contElP,el,contInput} = estilos;
import dayjs from 'dayjs';
import { v7 } from 'uuid';

// aqui pondremos el formulario de ingreso de pacientes

function Busqueda ({register,campo,control, setValue,lista,append}){

    const[indice,setIndice] = useState(0);
    const[verLista,setVerLista]= useState(false);
    const[filtro, setFiltro]=useState(null);

    const busqueda = useWatch({control,name:campo,defaultValue:''});

      useEffect(()=>{

            if(!lista || lista.length <= 0)return;
            let temporizador;
            if(busqueda){
                temporizador =setTimeout(()=>{
                    const nuevaLista = lista.filter((i)=> i.nombre.startsWith(busqueda));
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
                id: filtro[indice].id,
                nombre: filtro[indice].nombre
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
                    <div key={i.id}  className={(index === indice? estiloBusqueda.eleccion: estiloBusqueda.opcion)}>{i.nombre}</div>
                )):(verLista && (!Array.isArray(filtro) || filtro.length <= 0))? 'no se encuentran coincidencias':''
              }  
            </div>
        </div>
    )
}



export default function VistaPrincipal() {


    const[keyForm,setKeyForm]= useState(0);


 const base = useLiveQuery(async()=>{
       const [listaMetodos, listaA] = await Promise.all([
                db.metodos.toArray(),
                db.listaAnalisis.toArray() 
       ])
       const ultimaLista = listaA.map((i,index)=>(
            {
                ...i,
                metodo: listaMetodos.find(u=> u.id === i.metodo)?.nombre
            }
       )) 
        return ultimaLista;
 })


const {register,handleSubmit,formState:{errors},reset,control,setValue,watch}= useForm({
        defaultValues:{
            nombreP:'',
            apellidoP:'',
            dniP:'',
            fechaNacimientoP:'',
            analisis:'',
            pedido:[]
        }
})


  const {fields,append,remove} = useFieldArray({
    control,
    name:'pedido'
  })

    const guardar = async(datos)=>{
        try {
            
            const {pedido,analisis, ...resto} = datos; 
            const dPers = {
                id:v7(),
                nombre: resto.nombreP,
                apellido:resto.apellidoP,
                dni:resto.dniP,
                fechaNaci:resto.fechaNacimientoP,
            } 
            const dTurno = {
                id: v7(),
                ingresoId:dPers.id,
                pedido
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


if(!base){
   return <div>Esperando datos...</div>
 }



  return(
    <> 
        <form key={keyForm} className={cont} onSubmit={handleSubmit(guardar)} autoComplete='off'>
            <div className={contPers}>
              <div className={contInput}>
                <label>Nombre</label>
                <input type="text" {...register('nombreP')} />
              </div> 
              <div className={contInput}>
                <label>Apellido</label>
                <input type="text" {...register('apellidoP')} />
              </div> 
              <div className={contInput}>
                <label>DNI</label>
                <input type="text" {...register('dniP')} />
              </div>
              <div className={contInput}>
                <label>Fecha de Nacimiento</label>
                <input type="date" {...register('fechaNacimientoP')} />
              </div>   

            </div>
            <div className={contPedido}>
                <div className={contBuscador}>
                <label>Buscador</label>    
                <Busqueda lista={base} register={register} control={control} setValue={setValue} campo={'analisis'} append={append}/>
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
                <button type="button" onClick={()=>reset()}>Borrar</button>
            </div>
        </form>
    </>
  )
}