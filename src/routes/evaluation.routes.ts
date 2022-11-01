import express, { NextFunction, Request, Response } from 'express'
import { query, ValidationChain, validationResult } from 'express-validator'
import { get } from '../controllers/evaluation/evaluation.controller'

const router = express.Router()
const urlRegex =
  '^(http://www.|https://www.|http://|https://)?[a-z0-9]+([-.]{1}[a-z0-9]+)*.[a-z]{2,5}(:[0-9]{1,5})?(/.*)?$'
const regexExpressionForUrl = new RegExp(urlRegex)

/**
 *
 * @param validations Validations for query param
 * @returns NextFunction
 */
const validate = (validations: ValidationChain[]) => {
  return async (req: Request, res: Response, next: NextFunction) => {
    for (let validation of validations) {
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
router.get(
  '/',
  validate([
    query('url').notEmpty(),
    query('url').custom(url => regexExpressionForUrl.test(url)),
    query('url').toArray(),
  ]),
  get,
)

export default router
