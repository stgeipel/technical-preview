import { query } from 'express-validator'
import { getFileNameFromUrl } from '../utils/files.utils'
const urlRegex =
  '^(http://www.|https://www.|http://|https://)?[a-z0-9]+([-.]{1}[a-z0-9]+)*.[a-z]{2,5}(:[0-9]{1,5})?(/.*)?$'
const regexExpressionForUrl = new RegExp(urlRegex)

const evaluationValidator = [
  // santinze to an Array
  query('url').toArray(),
  // check if URL not empty
  query('url').notEmpty(),
  // check is valid URL @Regex
  query('url').custom((urls: string[]) => {
    for (const url of urls) {
      const filename = getFileNameFromUrl(url)
      if (!regexExpressionForUrl.test(url) || !filename?.includes('.csv')) {
        return false
      }
    }
    return true
  }),
]

export { evaluationValidator }
