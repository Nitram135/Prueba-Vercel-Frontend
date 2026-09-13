import {z} from 'zod';


const preguntasSchema = z.object({
   
    id: z.uuid(),
    pregunta: z.string(),
    respuesta: z.string()
    
})


export{preguntasSchema};