import React, { forwardRef, useEffect, useRef, useState } from 'react'
import estilos from '../../css/vistasCss/VistaAdministrador.module.css'
const {cont,ventana,carril,elemento,boton,contenedor,titulo, cuadro,columna,inputFecha,contEtiqueta,textoEtiqueta,inputExc,contExc}= estilos;
import { IoMdArrowDropleftCircle,IoMdArrowDroprightCircle } from 'react-icons/io';
import dayjs, { Dayjs } from 'dayjs';
import 'dayjs/locale/es'
import { useForm } from 'react-hook-form';
import Barcode from 'react-barcode';
import { v7 } from 'uuid';
import { useReactToPrint } from 'react-to-print';






function NavegacionDeslizador(){
     const navRef = useRef(null);

    const [mover,setMover]= useState(false);
    const [direccion,setDireccion]= useState(null)



    const moverDerecha = ()=>{
        navRef.current.scrollBy({left:50,behavior: 'smooth'});
    }

    

    const moverIzquierda = ()=>{
        navRef.current.scrollBy({left:-50,behavior: 'smooth'});
    }


    useEffect(()=>{
        let intervalo;

        if(mover){
            intervalo = setInterval(()=>{
                  if(direccion === 'derecha'){
                    moverDerecha();
                  } 
                  if(direccion === 'izquierda'){
                    moverIzquierda();
                  } 
            },100)
        }

        return()=>{
            clearInterval(intervalo)
        }

    },[mover,direccion])


    const cambio = (direccion)=>{
        setMover(true)
        setDireccion(direccion)
    }

    const cambio2 = ()=>{
        setMover(false)
        setDireccion(null)
    }




  return (
    <div className={cont}>
       <div className={ventana} >
          <button className={boton} onClick={moverIzquierda} onMouseDown={()=>cambio('izquierda')} onMouseUp={cambio2}><IoMdArrowDropleftCircle/></button>  
          <div className={carril} ref={navRef}>
            <div className={elemento}>link</div>
            <div className={elemento}>link</div>
            <div className={elemento}>link</div>
            <div className={elemento}>link</div>
            <div className={elemento}>link</div>
            <div className={elemento}>link</div>
            <div className={elemento}>link</div>
            <div className={elemento}>link</div>
            <div className={elemento}>link</div>
            <div className={elemento}>link</div>
          </div>
          <button className={boton} onClick={moverDerecha} onMouseDown={()=> cambio('derecha')} onMouseUp={cambio2}><IoMdArrowDroprightCircle/></button>
       </div>
    </div>
  )

}

function TablaAgarrarSoltar (){

const [lista,setLista] = useState([
  {id:1,nombre:'martin', estado:'pendiente'},
  {id:2,nombre:'martin', estado:'pendiente'},
  {id:3,nombre:'martin', estado:'terminado'}
])

const [tarea,setTarea] = useState(null);


const manejoDragStart = (e, tarea)=>{
    setTarea(tarea)
};
const manejoDragOver= (e)=>{
  e.preventDefault();
};

const manejoDragoDrop = (e, nuevaEstado)=>{
  if(!tarea) return;
  e.preventDefault();
  setLista((anterior)=>(
      anterior.map((item)=>(
        item.id === tarea.id
        ? {...item, estado:nuevaEstado}
        : item
      ))
  ))
  setTarea(null);
}



return(
<div className={contenedor}>
    <div className={columna} onDragOver={(e)=>manejoDragOver(e)} onDrop={(e)=>manejoDragoDrop(e,'pendiente')}>
      <h1 className={titulo}>Tareas pendientes</h1>
      {lista?.filter((t)=>t.estado === 'pendiente').map((item)=>(
        <div key={item.id} onDragStart={(e)=> manejoDragStart(e,item)} className={cuadro} draggable>{item.nombre}</div>
      ))}
    </div>
    <div className={columna} onDragOver={(e)=>manejoDragOver(e)} onDrop={(e)=>manejoDragoDrop(e,'terminado')}>
        <h1 className={titulo}>Tareas terminadas</h1>
        {lista?.filter((t)=> t.estado === 'terminado').map((item)=>(
           <div key={item.id} onDragStart={(e)=> manejoDragStart(e,item)} className={cuadro} draggable>{item.nombre}</div> 
        ))}
    </div>
</div>

) 

}



function Daysss (){

  const {register,watch} = useForm({
    defaultValues:{
      fechaN:'',
      fechaM:''
    }
  })
  const diajs = dayjs().locale('es');

const fechaNacimiento =  watch('fechaN');
const fechaMuerte = watch('fechaM')

const edad =  fechaNacimiento? dayjs(fechaMuerte).diff(fechaNacimiento,'year'): '';





  return(
    <>
      <div>
        <h2>Nacimiento</h2>
        <input type="date" {...register('fechaN')} className={inputFecha} title='hola papi' />
        <h2>Muerte</h2>
        <input type="date" {...register('fechaM')} className={inputFecha} />
      </div>
      <div>{edad}</div>
    </>
  )

}

const CodigoBarra = forwardRef(({muestras}, ref)=>{

  if(muestras.length <= 0) return;

  return(
    <>
      <div ref={ref} className={contEtiqueta}>
        {
           muestras.map((item,index)=>(
            <div key={index}>
              <Barcode value={item.codigo} displayValue={false} format='CODE128' />
            </div>
           )) 
        }
     </div>
    </>
  )

})

function ReactPrint(){
     const array = [
     {codigo:'022-0666'},
     {codigo:'022-0666'}
   ]

  const impresionRef = useRef(null);
 

  const imprimir = useReactToPrint({
    contentRef: impresionRef,
    documentTitle: 'Impresion'
  })
  

  return (

    <div>
      <div>
        <CodigoBarra ref={impresionRef} muestras={array} />
      </div>

        <button onClick={imprimir}>Ver impresion</button>
    </div>
 
  );
}


export default function VistaAdministrador() {

  
  
const datos = [
  ['id',['a1','a2','a3']],
  ['turno',[1,2,3]],
  ['glucemia',[120,null,84]]
]


return(

  <>
    <div className={contExc}>
      {
        datos.map(([clave,valor],index)=>(
          <div key={index}>
            <div>{clave}</div>
            {valor.map((resultado,index)=>(
              <div key={index}>{resultado === null? '*  ':resultado}</div>
            ))}
          </div>
        ))
      }
    </div>
  
  </>
)
  
 
}
