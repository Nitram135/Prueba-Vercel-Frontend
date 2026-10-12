import {z} from 'zod';


const recepcionSchema = z.object({
    nombre: z.string().toUpperCase().min(2,'Minimo 2 letras'),
    apellido:z.string().toUpperCase().min(2,'Minimo 2 letras'),
    fechaNaci:z.string().date('Debe ser una fecha valida'),
    dni:z.string().min(6,'Minimo 6 numeros'),
    analisis: z.string().optional(),
    pedido: z.array(
        z.object({
            determinacion:z.string().uuid('Debe ser uuid'),
            nombre:z.string().toUpperCase(),
            resultado:z.string().optional()
        })
    )
})

const listaAnalisisSchema = z.object({
    codigo: z.string('Debe ser un numero'),
    nombre: z.string('Debe ser texto').toUpperCase(),
    metodo: z.string('Debe ser texto').uuid(),
    metodoVista: z.string('Debe ser texto').optional()
})


const metodosSchema = z.object({
    nombre: z.string('Debe ser texto').toUpperCase().trim().min(3,'Minimo 3 letras')
})


const verValidarResultSchema = z.object({
    resultados: z.array(
        z.object({
            resultado: z.string().optional()
        })
    )
})


export{recepcionSchema,listaAnalisisSchema,metodosSchema};