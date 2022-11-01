import express from 'express'
import { get } from '../controllers/evaluation.controller'

const router = express.Router()

// GET Evaluations
router.get('/', get)

export default router
