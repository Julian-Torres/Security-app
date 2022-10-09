const {Router} = require('express');
const {check, validationResult} = require('express-validator');
const Usuario=require('../models/Usuario')
const {generarJWT}=require('../helpers/jwt')
const bcrypt =require('bcryptjs');

const router= Router();

router.post('/',[

    check('email', 'Email Invalido').isEmail(),
    check('contrasena', 'Contraseña Invalida').not().isEmpty(),

    ], async function(req,res){
        try {
            console.log(req.body);
            //validar campos
            const errors =validationResult(req);
            if (!errors.isEmpty()){
                return res.status(400).json({mensaje: errors.array()});
            }

            //validar Email
            const usuario=await Usuario.findOne({email: req.body.email});
            if(!usuario){
                return res.status(400).json({mensaje: 'Datos Incorrectos'})
            }

            const esIgual =bcrypt.compareSync(req.body.contrasena, usuario.contrasena);
            if(!esIgual) {
                return res.status(400).json({mensaje: 'Datos Incorrectos'})
            }            
            
            //generar token
            const token=generarJWT(usuario);

            res.json({_id: usuario._id,
                nombre:usuario.nombre,
                rol:usuario.rol,
                email:usuario.email,
                acces_token:token});

        } catch (error) {
            console.log(error);
            res.status(500).json({mensaje: 'Error de servidor'})
        }
    });

    module.exports=router;