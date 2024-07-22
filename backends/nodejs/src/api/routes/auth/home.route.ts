import express from 'express';
import passport from 'passport';
import { Router, Request, Response, NextFunction } from 'express';

const router = express.Router();


router.get('/',(req, res)=>{
    res.send(`Hello world`)
});


export default router;