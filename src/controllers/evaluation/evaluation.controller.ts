import { NextFunction, Request, Response } from 'express'
import { getEvaluationByUrls } from '../../services/evaluation/evaluation.service'

async function get(req: Request, res: Response, next: NextFunction) {
  try {
    const evaluationQuerysUrls = req.query.url as string[]

    await getEvaluationByUrls(evaluationQuerysUrls)
    res.json('ok')
    //res.json(await getEvaluationByUrls(req.params))
  } catch (err) {
    next(err)
  }
}

export { get }
