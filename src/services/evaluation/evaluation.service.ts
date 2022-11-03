import { parse } from 'csv-parse'
import fs from 'fs'
import https from 'https'
import { IEvaluationResponse } from '../../controllers/evaluation/evaluation.response.model'
import { getFileNameFromUrl } from '../../utils/files.utils'
import { IEvaluationRow } from './evaluation.csv.model'

enum Evaluates {
  Speaker,
  Topic,
  Date,
  Words,
}

/**
 * Evaluates urls and csv onformdata
 * @param {[string]} urls - The urls
 * @returns {Promise<IEvaluationResponse>}
 */
async function getEvaluationByUrls(urls: string[]): Promise<IEvaluationResponse> {
  let evaluations = new Array<IEvaluationRow>()
  const promises = new Array<Promise<string>>()

  urls.forEach(url => {
    const filename = getFileNameFromUrl(url)
    promises.push(downloadFile(url, `./docs/tmp/${filename}`))
  })

  const files = await Promise.all(promises)
  for (const filepath of files) {
    evaluations = [...evaluations, ...(await readFileContent(filepath))]
  }
  console.log(evaluations)
  return {
    MostSpeeches: getMostSpeechesInYearFromArray(evaluations, 2013),
    MostSecurity: getMostSecurityInTopicFromArray(evaluations, 'Internal Security'),
    LeastWordy: getLeastWordsFromArray(evaluations),
  }
}

/**
 * gets the most speeches in year
 * @param evaluation all evaluations
 * @param year filter in year
 * @returns {string | null} Speaker
 */
function getMostSpeechesInYearFromArray(evaluations: IEvaluationRow[], year: number): string | null {
  const dictonary: { [key: string]: number } = {}
  const evaluationCopy = evaluations.filter(e => e.Date.getFullYear() === year)

  // early return
  if (evaluationCopy.length === 0) {
    return null
  }

  evaluationCopy.forEach(evaluation => {
    dictonary[evaluation.Speaker] = dictonary[evaluation.Speaker] != null ? dictonary[evaluation.Speaker] + 1 : 1
  })

  return getMaxValueFromDictonary(dictonary)
}

function getMostSecurityInTopicFromArray(evaluations: IEvaluationRow[], topic: string): string | null {
  const dictonary: { [key: string]: number } = {}
  const evaluationCopy = evaluations.filter(e => e.Topic == topic)

  // early return
  if (evaluationCopy.length === 0) {
    return null
  }

  evaluationCopy.forEach(evaluation => {
    dictonary[evaluation.Speaker] = dictonary[evaluation.Speaker] != null ? dictonary[evaluation.Speaker] + 1 : 1
  })
  return getMaxValueFromDictonary(dictonary)
}

function getLeastWordsFromArray(evaluations: IEvaluationRow[]): string | null {
  const dictonary: { [key: string]: number } = {}

  evaluations.forEach(evaluation => {
    dictonary[evaluation.Speaker] =
      dictonary[evaluation.Speaker] != null ? dictonary[evaluation.Speaker] + evaluation.Words : evaluation.Words
  })

  return getMaxValueFromDictonary(dictonary)
}

function getMaxValueFromDictonary(dictonary: { [key: string]: number }): string {
  return Object.keys(dictonary).reduce((a, b) => (dictonary[a] > dictonary[b] ? a : b))
}

/**
 * opens a File with an File string and reads Content. The Content would be parsed into @see IEvaluationRow
 * @param filepath
 * @returns {Promise<IEvaluationRow[]>}
 */
async function readFileContent(filepath: string): Promise<IEvaluationRow[]> {
  const evaluationsFromCsv = new Array<IEvaluationRow>()

  return await new Promise((resolve, reject) => {
    fs.createReadStream(filepath)
      .pipe(parse({ fromLine: 2, trim: true }))
      .on('data', (data: string[]) => {
        evaluationsFromCsv.push({
          Speaker: data[Evaluates.Speaker],
          Topic: data[Evaluates.Topic],
          Date: new Date(data[Evaluates.Date]),
          Words: Number.parseInt(data[Evaluates.Words]),
        } as IEvaluationRow)
      })
      .on('end', () => {
        resolve(evaluationsFromCsv)
      })
      .on('error', err => reject(err))
  })
}

/**
 * Download a file from the given `url` into the `targetFile`.
 *
 * @param {String} url
 * @param {String} targetFile
 *
 * @returns {Promise<void>}
 */
async function downloadFile(url: string, targetFile: string): Promise<string> {
  return await new Promise((resolve, reject) => {
    https
      .get(url, response => {
        const code = response.statusCode ?? 0

        if (code >= 400) {
          return reject(new Error(response.statusMessage))
        }

        // handle redirects
        if (code > 300 && code < 400 && !!response.headers.location) {
          return downloadFile(response.headers.location, targetFile)
        }

        // save the file to disk
        const fileWriter = fs.createWriteStream(targetFile).on('finish', () => {
          resolve(targetFile)
        })

        response.pipe(fileWriter)
      })
      .on('error', error => {
        reject(error)
      })
  })
}

export { getEvaluationByUrls }
