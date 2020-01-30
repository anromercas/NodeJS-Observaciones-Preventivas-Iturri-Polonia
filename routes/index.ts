import { Router, Request, Response } from "express";

const indexRoutes = Router();


indexRoutes.get('/', async (req: any, res: Response) => {

    res.json({
        ok: true,
        message: 'Api Rest IturriOPS'
    });
});


export default indexRoutes;