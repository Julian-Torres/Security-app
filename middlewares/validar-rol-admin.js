const validarRolAdmin=(req,res,next)=>{
    if (req.payload.rol!=='ADMIN'){
        return res.status(401).json({mensaje: 'Error de Autorizacion'})
    }next();
}
module.exports={validarRolAdmin}