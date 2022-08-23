const baseURI = 'https://o88aye9z6i.execute-api.ap-northeast-2.amazonaws.com'

init()

function init(): void {
  addBeforeSendHeadersHandler()
  addMainPageHandler()
  addProductDetailPageHandler()
  addSearchEventHandler()
  addChangedUrlHandler()
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
    (details: any) => {
      chrome.storage.local.get(['userInfo'], async (result: any) => {
        const userInfo = result.userInfo
        const itemId = details.url.includes('.json')
          ? details.url.split('/goods/')[1].split(`.json`)[0]
          : details.url.split('/goods/')[1].split(`?`)[0]
        if (userInfo === null) return
        const userId = userInfo.id

        fetch('https://o88aye9z6i.execute-api.ap-northeast-2.amazonaws.com/activities', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({
            user_id: userId,
            item_id: Number(itemId),
            activity_type: 2,
          }),
        })
      })
    },
    { urls: [`https://www.kurly.com/goods/*`, `https://www.kurly.com/_next/data/**/goods/*`] },
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
        `https://8eoluopi8h.execute-api.ap-northeast-2.amazonaws.com/recommend_by_keyword/`,
        {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({
            keyword: keyword,
          }),
        },
      )
      const resJson = await response.json()

      chrome.storage.local.set({ searchText: keyword, searchResult: resJson })
    },
    { urls: [`https://api.kurly.com/search/v2/normal-search*`] },
    [`responseHeaders`],
  )
}

function addChangedUrlHandler(): void {
  chrome.webRequest.onHeadersReceived.addListener(
    async (_details: any) => {
      chrome.storage.local.get([`onChangedUrl`], (result: any) => {
        const { onChangedUrl } = result
        chrome.storage.local.set({ onChangedUrl: !onChangedUrl })
      })
    },
    { urls: [`https://www.kurly.com/*`] },
    [`responseHeaders`],
  )
}

export {}
