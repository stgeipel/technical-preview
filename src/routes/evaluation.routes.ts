import express, { NextFunction, Request, Response } from 'express'
import { ValidationChain, validationResult } from 'express-validator'
import { get } from '../controllers/evaluation/evaluation.controller'
import { evaluationValidator } from '../validators/evaluation.validator'

const router = express.Router()

/**
 *
 * @param validations Validations for query param
 * @returns NextFunction
 */
const validate = (validations: ValidationChain[]) => {
  return async (req: Request, res: Response, next: NextFunction) => {
    for (const validation of validations) {
      const result = await validation.run(req)
      if (result.context.errors.length) break
    }

    const errors = validationResult(req)
    if (errors.isEmpty()) {
      return next()
    }

    res.status(400).json({ errors: errors.array() })
  }
}

/**
 * GET Route with validation
 * VALIDATION:
 * url query param should not be empty
 * url query param should match the regex expression
 * url sanitize to an array
 */
router.get('/', validate(evaluationValidator), get)

export default router
