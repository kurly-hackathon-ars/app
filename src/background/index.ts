init()

function init(): void {
  addBeforeSendHeadersHandler()
  addMainPageHandler()
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
      })
    },
    { urls: [`https://www.kurly.com/main`, 'https://www.kurly.com/main/beauty'] },
    [`responseHeaders`],
  )
}

export {}
