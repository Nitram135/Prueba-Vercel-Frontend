import {z} from 'zod';



const tamañoArchvio = 5*1024*1024;
const archviosAceptado = ["image/jpeg", "image/jpg", "image/png", "image/webp"];

const usuarioSchema = z.object({
    id: z.string().uuid(),
    nombre: z.string().min(5,'Minimo 5 letras'),
    contraseña: z.string().min(5,'Minimo 5 letras'),
    rol: z.string()
})

const tallerSchema = z.object({
    id: z.string().uuid({message:'Debe ser fromate uuidv7'}),
    texto:z.string(),
    posicion:z.coerce.number().max(5,'Solo se puede elejeir hasta la posicion 5'),
    imagen: z.any()
    // imagen: z.instanceof(File,{message:'Debe ser un archivo valido'})
    //          .refine((archivo)=> archivo.size<= tamañoArchvio,{message:'Elarchvio no puede superar los 5MB'})
    //          .refine((archivo)=> archviosAceptado.includes(archivo.type),{message:'Solo puede ser formato imagen'})

})
export{usuarioSchema,tallerSchema};