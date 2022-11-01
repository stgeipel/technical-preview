import { NextFunction, Request, Response } from 'express'

async function get(req: Request, res: Response, next: NextFunction) {
  try {
    const evaluationQuerysUrls = req.query.url as string[]

    console.log(evaluationQuerysUrls)

    res.json('ok')
    //res.json(await getEvaluationByUrls(req.params))
  } catch (err) {
    console.error(`Error while getting Evaluations`, err)
    next(err)
  }
}

export { get }
