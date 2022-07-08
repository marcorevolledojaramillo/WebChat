const { response } = require("express")

const esAdminRole = (req, res = response, next) => {

    if (!req.usuario) {
        return res.status(500).json({
            msg: 'Se quiere verificar el role, sin validar el token primero'
        })
    }

    const { rol, nombre } = req.usuario.rol;
    if (!(rol == 'ADMIN_ROLE')) {
        return res.status(401).json({
            msg: `${nombre} no es administrador - No puede hacer esto`
        });
    }
    next();
}


const tieneRole = (...roles) => {
    return (req, res = response, next) => {

        if (!req.usuario) {
            return res.status(500).json({
                msg: 'Se quiere verificar el role, sin validar el token primero'
            })
        }

        const { rol, nombre } = req.usuario;
        const existeRol= roles.includes(rol);
        
        if (!existeRol) {
            return res.status(401).json({
                msg: `${nombre} no es administrador - No puede hacer esto`
            });
        }

        next();
    }
}
module.exports = {
    esAdminRole,
    tieneRole
}