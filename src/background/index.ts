const baseURI = 'http://3.34.222.139:8080'

init()

function init(): void {
  addBeforeSendHeadersHandler()
  addMainPageHandler()
  addProductDetailPageHandler()
  addSearchEventHandler()
}

function addBeforeSendHeadersHandler(): void {
  chrome.webRequest.onBeforeSendHeaders.addListener(
    function (details: any) {
      for (var i = 0; i < details.requestHeaders.length; ++i) {
        if (details.requestHeaders[i].name === 'Authorization') {
          chrome.storage.local.set({ authorization: details.requestHeaders[i].value })
          break
        }
      }

      return { requestHeaders: details.requestHeaders }
    },
    {
      urls: ['https://api.kurly.com/member/proxy/member-core/v1/member'],
    },
    ['requestHeaders'],
  )
}

function addMainPageHandler(): void {
  chrome.webRequest.onHeadersReceived.addListener(
    (_details: any) => {
      chrome.storage.local.get(['authorization'], async (result: any) => {
        const authorization = result.authorization

        if (authorization === null) return

        const response = await fetch('https://www.kurly.com/nx/api/session', {
          headers: { authorization },
        })
        const resJson = await response.json()

        // TODO: post request to server
        chrome.storage.local.set({ userInfo: resJson.userInfo || null })
        fetch(`${baseURI}/member`, {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({
            member_id: resJson.userInfo.id,
            name: resJson.userInfo.name,
            grade: resJson.userInfo.grade,
          }),
        })
      })
    },
    { urls: [`https://www.kurly.com/main`, 'https://www.kurly.com/main/beauty'] },
    [`responseHeaders`],
  )
}

function addProductDetailPageHandler(): void {
  chrome.webRequest.onHeadersReceived.addListener(
    (_details: any) => {
      console.log(_details)
    },
    { urls: [`https://www.kurly.com/goods/*`] },
    [`responseHeaders`],
  )
}

function addSearchEventHandler(): void {
  chrome.webRequest.onHeadersReceived.addListener(
    async (details: any) => {
      if (details.method !== `GET`) return
      const url = decodeURIComponent(details.url)
      const keyword = url.match(/keyword=(.*?)&/i)?.[1]
      if (!keyword) return
      const response = await fetch(
        `http://3.37.151.144:8000/recommend_by_keyword/${encodeURIComponent(keyword)}`,
      )
      const resJson = await response.json()

      chrome.storage.local.set({ searchText: keyword, searchResult: resJson })
    },
    { urls: [`https://api.kurly.com/search/v2/normal-search*`] },
    [`responseHeaders`],
  )
}

export {}
