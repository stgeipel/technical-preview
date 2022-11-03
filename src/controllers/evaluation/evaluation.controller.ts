import { NextFunction, Request, Response } from 'express'
import { getEvaluationByUrls } from '../../services/evaluation/evaluation.service'

async function get(req: Request, res: Response, next: NextFunction) {
  try {
    const evaluationQuerysUrls = req.query.url as string[]

    res.json(await getEvaluationByUrls(evaluationQuerysUrls))
  } catch (err) {
    next(err)
  }
}

export { get }
