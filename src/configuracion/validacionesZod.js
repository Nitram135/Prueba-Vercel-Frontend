import {z} from 'zod';


const datosPersSchema = z.object({
    nombre: z.string().toUpperCase(),
    apellido: z.string().toUpperCase(),
    fechaNaci: z.date(),
    dni: z.coerce.number({message:'Debe ser un numero'})    
})


const turnoSchema = z.object({
    ingresoId: z.string(),
    pedido: z.array(
        z.object({
           analisis: z.string().uuid(),
           resultado: z.string()
        })
    )
})


const listaAnalisisSchema = z.object({
    codigo: z.coerce.number({message:'Debe ser un numero'}),
    nombre: z.string().toUpperCase(),
    metodo: z.string().uuid(),
    metodoVista: z.string().optional()
})


const metodosSchema = z.object({
    nombre: z.string({required_error:'El nombre es obligatorio'}).toUpperCase().trim().min(3,'Minimo 3 letras')
})


export{datosPersSchema,turnoSchema,listaAnalisisSchema,metodosSchema};