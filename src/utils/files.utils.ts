const getFileNameFromUrl = (url: string) => {
  const arrayUrl = url.split('/')
  return arrayUrl.at(-1)
}

export { getFileNameFromUrl }
