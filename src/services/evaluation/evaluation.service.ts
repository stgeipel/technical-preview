import { parse } from 'csv-parse'
import fs from 'fs'
import https from 'https'
import { getFileNameFromUrl } from '../../utils/files.utils'
import { IEvaluationRow } from './evaluation.csv.model'

/**
 * Evaluates urls and csv onformdata
 * @param {[string]} urls - The urls
 */
async function getEvaluationByUrls(urls: string[]) {
  let evaluations = new Array<IEvaluationRow>()
  const promises = new Array<Promise<string>>()

  urls.forEach(url => {
    const filename = getFileNameFromUrl(url)
    promises.push(downloadFile(url, `./docs/tmp/${filename}`))
  })

  const files = await Promise.all(promises)
  for (const filepath of files) {
    evaluations = [...(await readFileContent(filepath))]
  }
  console.log(evaluations)
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
      .pipe(parse({ fromLine: 2 }))
      .on('data', (data: string[]) => {
        evaluationsFromCsv.push({
          Speaker: data[0],
          Topic: data[1],
          Date: new Date(data[2]),
          Words: Number.parseInt(data[3]),
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
