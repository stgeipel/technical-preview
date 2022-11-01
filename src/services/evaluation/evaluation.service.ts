/**
 * Evaluates urls and csv onformdata
 * @param {[string]} urls - The urls
 */
async function getEvaluationByUrls(urls: string[]) {
  urls.forEach(async url => {
    await downloadCsvFile(url)
  })
}

async function downloadCsvFile(url: string) {
  // WARNING: USAGE OF EXPERIMENTAL USAGE (FETCH API)
  fetch(url)
    .then(res => console.log(res))
    .then(buffer => {
      console.log(buffer)
    })
}

export { getEvaluationByUrls }
