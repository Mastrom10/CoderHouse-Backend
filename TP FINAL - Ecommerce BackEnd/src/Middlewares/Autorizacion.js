export default function OnlyAdminsPrivilege(req, res, next){
    if (req.header('esAdmin') == 'true') {
        next();
    } else {
        res.status(403).json({ 'error': -1, 'descripcion': `No tiene acceso a ${req.originalUrl}` })
    }
}


