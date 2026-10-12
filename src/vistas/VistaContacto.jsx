import React, { useEffect, useState } from 'react'
import estilos from '../css/vistasCss/VistaContacto.module.css'
import {FaInstagram,FaFacebook,FaWhatsapp,} from 'react-icons/fa6'
import { MdEmail } from "react-icons/md";
import { useFieldArray, useForm } from 'react-hook-form';
import { useLiveQuery } from 'dexie-react-hooks';
import { db } from '../configuracion/indexedDb';
const {cont,columna1,columna2,contPers,contResult,contOpciones,contBtnAS,btnAS}= estilos;
import dayjs from 'dayjs';
import { useC } from '../configuracion/Contexto';


//aqui veremos la carga de resultados



export default function VistaContacto() {

  const {datosMemo, cargando} = useC();
   const {objAnalisis} = datosMemo;

   const [actualP,setActualP] = useState(null);
   const [indiceP, setIndiceP] = useState(0);
   const [pasar,setPasar] = useState(true);
   const [fechaActual,setFechaActual] = useState(null);
   const [fechas,setFechas] = useState(null);
   const [finalAtras,setFinalAtras] = useState(false);
   const [finalSiguiente,setFinalSiguiente] = useState(true);
   const [pacientesD,setPacientesD] = useState(null);


   const {register,handleSubmit,reset,formState:{errors},setFocus,setValue,control,watch}= useForm({
     defaultValues:{
       resultados:[]
     }
   })
   const {fields,append,remove}= useFieldArray({
     control,
     name:'resultados'
   })

  
    useEffect(()=>{
     if(!datosMemo || cargando)return;
     const cargarP = async()=>{
       const paciente0 = await db.turno.reverse().limit(1).toArray();
       const paciente0Pedido = paciente0[0].pedido.map((i)=>({determinacion:objAnalisis[i.determinacion],resultado:i.resultado}));
       const inicioHoy = dayjs(paciente0[0].fechaIngreso).startOf('day').toISOString()
       const finHoy = dayjs(paciente0[0].fechaIngreso).endOf('day').toISOString()
       const inicioHoyForm = dayjs(inicioHoy).format('DD/MM/YYYY');
       const paciente1 = await db.turno.where('fechaIngreso').below(inicioHoy).reverse().limit(1).toArray()
       const inicioAyer = dayjs(paciente1[0].fechaIngreso).startOf('day').toISOString();
       const finAyer = dayjs(paciente1[0].fechaIngreso).endOf('day').toISOString();
       const inicioAyerForm = dayjs(inicioAyer).format('DD/MM/YYYY');
       const pacientesHoy = await db.turno.where('fechaIngreso').between(inicioHoy,finHoy).reverse().toArray();
       const pacientesAyer = await db.turno.where('fechaIngreso').between(inicioAyer,finAyer).reverse().toArray();
       const [pacientesHoyDefinitivos,pacientesAyerDefinitivos] = await Promise.all([
         Promise.all(pacientesHoy.map(async(i)=>{
           const persona = await db.datosPers.get(i.idPers);
           return{
             ...i,
             idPers:persona
            }})),
            Promise.all(pacientesAyer.map(async(i)=>{
              const persona = await db.datosPers.get(i.idPers);
              return{
                ...i,
                idPers:persona
              }}))
            ])
            setPacientesD({
              [inicioAyerForm]: pacientesAyerDefinitivos ,
              [inicioHoyForm]: pacientesHoyDefinitivos
            })
            setActualP({
              ...pacientesHoyDefinitivos[indiceP],
              pedido: paciente0Pedido
            })
            setFechaActual(inicioHoyForm);
            setFechas([inicioHoyForm,inicioAyerForm])
       reset({resultados:paciente0Pedido})
     }  
     cargarP();
    },[])


    useEffect(()=>{
       if(!datosMemo || cargando || pasar)return;
         const pacienteI = pacientesD[fechaActual][indiceP];
       if(Array.isArray(pacienteI.pedido) && pacienteI.pedido.length >= 0){  
         let pedidoI = pacienteI.pedido.map((i)=> ({determinacion:objAnalisis[i.determinacion],resultado:i.resultado}))
         setActualP({
           ...pacienteI,
           pedido:pedidoI 
         })
         reset({resultados:pedidoI});
        }
         !pasar && setPasar(true);
    },[pacientesD,fechaActual,indiceP]);



   const anteriorP = ()=>{
    if(!pacientesD && !fechas)return;
     const fechaAhora = fechas.indexOf(fechaActual);
     const indiceFinal = pacientesD[fechaActual].length -1;
    if(indiceP === indiceFinal && fechaAhora === fechas.length -1){
      return;
    }
    if(indiceP === indiceFinal && fechaAhora < fechas.length -1){
      setPasar(false)
      setFechaActual(fechas[fechaAhora +1])
      setIndiceP(0);
      return;
    }
    if(indiceP === indiceFinal -1 && fechaAhora === fechas.length -1){
      setFinalAtras(true);
      setPasar(false);
      setIndiceP(a=> a +1);
      return;
    } 
    setPasar(false);
    setIndiceP(a=> a +1);
    finalSiguiente && setFinalSiguiente(false);
   }
   const siguienteP = ()=>{
    if(!pacientesD && !fechas)return;
      const fechaAhora = fechas.indexOf(fechaActual);
    if(indiceP === 0 && fechaAhora === 0){
      return;
    }
    if(indiceP === 1 && fechaAhora === 0){
        setFinalSiguiente(true);
        setPasar(false);
        setIndiceP(a=> a -1);
        return
    }
    if(indiceP === 0 && fechaAhora > 0){
       setPasar(false);
       setFechaActual(fechas[fechaAhora -1]);
       setIndiceP(pacientesD[fechas[fechaAhora -1]].length -1);
       return;
    }  
    setPasar(false);
    setIndiceP(a=> a -1);
    finalAtras && setFinalAtras(false);
   }

   const inicioDiaP = ()=>{
     if(!pacientesD && !fechas)return;
     const fechaAhora = fechas.indexOf(fechaActual);
     const indiceFinal = pacientesD[fechaActual].length -1;
     if(indiceP === indiceFinal && fechaAhora === fechas.length -1){
      return;
     }
     if(indiceP < indiceFinal && fechaAhora === fechas.length -1){
       setPasar(false);
       setIndiceP(indiceFinal);
       setFinalAtras(true);
       return; 
     }
     if(indiceP === indiceFinal && fechaAhora === fechas.length -2){
       const siguienteFecha = fechas[fechaAhora +1];
       setPasar(false);
       setFechaActual(siguienteFecha);
       setIndiceP(pacientesD[siguienteFecha].length -1);
       setFinalAtras(true);
       return; 
     }
     if(indiceP === indiceFinal && fechaAhora < fechas.length -1){
      const siguienteFecha = fechas[fechaAhora +1];
       setPasar(false);
       setFechaActual(siguienteFecha);
       setIndiceP(pacientesD[siguienteFecha].length -1);
       return; 
     }
    setPasar(false);
    setIndiceP(pacientesD[fechaActual].length -1)
    finalSiguiente && setFinalSiguiente(false)
   }

    const finalDiaP = ()=>{
        if(!pacientesD && !fechas) return;
        const fechaAhora = fechas.indexOf(fechaActual);
        if(indiceP === 0 && fechaAhora === 0){
          return;
        }
        if(indiceP > 0 && fechaAhora === 0){
          setPasar(false);
          setIndiceP(0);
          setFinalSiguiente(true);
          return;
        }
        if(indiceP === 0 && fechaAhora === 1){
            setPasar(false);
            setFechaActual(fechas[0]);
            setIndiceP(0);
            setFinalSiguiente(true);
            return;
        }
       setPasar(false);
       setIndiceP(0);
       finalAtras && setFinalAtras(false);
    }



   const guardar = async(datos)=>{
     try {
        console.log(actualP)
     } catch (error) {
       console.log(error)
     }
   }

  

   if(!datosMemo || !actualP){
     return <div>Esperando datos...</div>
   }


return(
  <>
    <form  className={cont} onSubmit={handleSubmit(guardar)} >
        <div className={columna1}> 
          <div className={contPers}>
            <div>
              <label>Nombre</label>
              <div>{actualP.fechaIngreso}</div>
            </div>
              <div>
              <label>Apellido</label>
              <div>{actualP.idPers.apellido}</div>
            </div>
              <div>
              <label>DNI</label>
              <div>{actualP.idPers.dni}</div>
            </div>
              <div>
              <label>Fehca Nacimiento</label>
              <div>{dayjs(actualP.idPers.fechaNaci).format('DD/MM/YYYY')}</div>
            </div>
          </div>
           <div className={contResult}>
              {fields?.map((field,index)=>(
                  <div key={field.id}>
                      <div>{field.determinacion.nombre}</div>
                      <input type="text" {...register(`resultados[${index}].resultado`)} /> 
                  </div>
              ))}
          </div> 
          <div>
            <button type="submit">Guardar</button>
          </div>
        </div>
        <div className={columna2}>
          <div className={contOpciones}>
           <div className={contBtnAS}>
            <button type="button" className={btnAS} onClick={inicioDiaP} disabled={(!pasar || finalAtras)&& true}>{'<<inicioHoy Dia'}</button>
            <button type='button' className={btnAS} onClick={anteriorP}disabled={(!pasar || finalAtras)&& true}>{'<Anterior'}</button>
            <button type='button' className={btnAS} onClick={siguienteP} disabled={(!pasar ||finalSiguiente) && true}>{'Siguiente>'}</button>
            <button type="button" className={btnAS} onClick={finalDiaP} disabled={(!pasar || finalSiguiente)&& true}>{'finHoy Dia>>'}</button>
            </div> 
          </div>
        </div>
    </form>
  </>
)
   
}
