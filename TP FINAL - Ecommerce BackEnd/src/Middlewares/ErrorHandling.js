export default function ErrorHandling(req, res, next) {
    res.status(500).json({error:-2,descripcion:`Ruta ${req.originalUrl} no implementado.`});
}
