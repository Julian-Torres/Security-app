const {Router} = require('express');
const {check, validationResult} = require('express-validator');
const Usuario=require('../models/Usuario')
const bcrypt =require('bcryptjs');
const {validarJWT}=require('../middlewares/validar-jwt');
const{validarRolAdmin}=require('../middlewares/validar-rol-admin');

const router= Router();

//crear usuario
router.post('/',[
    check('nombre', 'Nombre Invalido').not().isEmpty(),
    check('email', 'Email Invalido').isEmail(),
    check('rol', 'Rol Invalido').isIn(['ADMIN','OBSERVADOR']),
    check('contrasena', 'Contraseña Invalida').not().isEmpty(),
    validarJWT,
    validarRolAdmin
    ], async function(req,res){
        try {
            console.log(req.body);
            //validar campos
            const errors =validationResult(req);
            if (!errors.isEmpty()){
                return res.status(400).json({mensaje: errors.array()});
            }

            //validar Email unico
            const existeEmail=await Usuario.findOne({email: req.body.email});
            if(existeEmail){
                return res.status(400).json({mensaje: 'Email ya existe'})
            }

            let usuario=new Usuario();
            usuario.nombre=req.body.nombre;
            usuario.email=req.body.email;
            usuario.rol=req.body.rol;

            const salt=bcrypt.genSaltSync();
            const contrasena =bcrypt.hashSync(req.body.contrasena,salt);
            usuario.contrasena=contrasena;

            usuario.fechaCreacion=new Date();
            usuario.fechaActualizacion=new Date();

            usuario =await usuario.save();
            res.send(usuario);

        } catch (error) {
            console.log(error);
            res.status(500).json({mensaje: 'Error de servidor'})
        }
    }
);

//listar usuarios
router.get('/',[validarJWT],async function(req,res){
    try {
        const usuarios= await Usuario.find();
        res.send(usuarios);
        
    } catch (error) {
        console.log( error);
        res.status(500).send({menseaje:'Error de servidor'})
    }
})
    module.exports=router;