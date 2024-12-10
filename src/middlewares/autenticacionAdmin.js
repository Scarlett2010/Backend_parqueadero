import jwt from "jsonwebtoken"
import administrador from "../models/administrador.js"

const verificarAdmin = async(req, res, next)=>{
    
    const token = req.headers.authorization
    if(!token) return res.status(404).json({
        msg: "Lo sentimos primero debe proporcionar un token"
    })

    const {authorization} = req.headers

    try {
        const {id, rol} = jwt.verify(authorization.split(" ")[1], process.env.JWT_SECRET)
        if(rol === "administrador"){
            await administrador.findById(id).lean().select("-password")
            next()
        }else{
            return res.status(404).json({
                msg: "Esto es una ruta privada de administrador"
            })
        }
        
    } catch (error) {
        const e = new Error("Formato del token no válido")
        return res.status(404).json({msg: e.message})
    }


}


export default verificarAdmin