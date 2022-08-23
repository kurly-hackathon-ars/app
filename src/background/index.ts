import { sleep } from '../content/utils/sleep'

const baseURI = 'https://o88aye9z6i.execute-api.ap-northeast-2.amazonaws.com'

init()

function init(): void {
  addBeforeSendHeadersHandler()
  addMainPageHandler()
  addProductDetailPageHandler()
  addSearchEventHandler()
  addChangedUrlHandler()
  addPickedEventHandler()
  addCartEventHandler()
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

        // 멤버 정보 저장
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

        // 찜한 목록 로드
        fetch('https://api.kurly.com/member/proxy/pick/v1/picks/products?ver=1', {
          method: 'GET',
          headers: {
            'Content-Type': 'application/json',
            authorization: authorization,
          },
        }).then(async (response) => {
          const resJson = await response.json()
          const ids: any[] = resJson.data.map((item: any) => item.no)
          const idsString = ids.join(`,`)

          const batchResponse = await fetch(
            `https://8eoluopi8h.execute-api.ap-northeast-2.amazonaws.com/items/batch/${idsString}`,
            {
              method: 'GET',
            },
          )
          const batchJson = await batchResponse.json()
          // FIXME: 원래 Request 받은 이후, 동작하게 해야하는데 시간이 없으므로 생략
          await sleep(1000)
          chrome.storage.local.set({ pickedItems: batchJson })
        })

        // 장바구니 로드
        fetch('https://api.kurly.com/carts/v1/refresh', {
          method: 'GET',
          headers: {
            'Content-Type': 'application/json',
            authorization: authorization,
          },
        }).then(async (response) => {
          const resJson = await response.json()
          const ids: any[] = resJson.data.cartItems.map((item: any) => item.dealProductNo)

          const detailResponse = await fetch('https://api.kurly.com/carts/v1/detail', {
            method: 'POST',
            headers: {
              'Content-Type': 'application/json',
              authorization: authorization,
            },
            body: JSON.stringify({
              address: '',
              addressDetail: '',
              cartItems: ids.map((id) => {
                return { dealProductNo: id, quantity: 1 }
              }),
            }),
          })

          const detailJson = await detailResponse.json()
          const detailIds: any[] = detailJson.data.dealProducts.map(
            (item: any) => item.contentsProductNo,
          )

          const batchResponse = await fetch(
            `https://8eoluopi8h.execute-api.ap-northeast-2.amazonaws.com/items/batch/${detailIds}`,
            {
              method: 'GET',
            },
          )
          const batchJson = await batchResponse.json()
          // FIXME: 원래 Request 받은 이후, 동작하게 해야하는데 시간이 없으므로 생략
          await sleep(1000)
          chrome.storage.local.set({ cartItems: batchJson })
        })
      })
    },
    {
      urls: ['https://www.kurly.com/*'],
      types: ['main_frame'],
    },
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

        fetch('https://o88aye9z6i.execute-api.ap-northeast-2.amazonaws.com/actions', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({
            member_id: userId,
            product_id: Number(itemId),
            action_type: 2,
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
      chrome.storage.local.get([`enableSearchAPI`], async (result: any) => {
        const { enableSearchAPI } = result

        if (enableSearchAPI === false) return

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
      })
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

function addPickedEventHandler(): void {
  chrome.webRequest.onBeforeRequest.addListener(
    function (details: any) {
      if (details.method !== `PUT`) return

      const body = JSON.parse(
        decodeURIComponent(
          String.fromCharCode.apply(null, new Uint8Array(details.requestBody.raw[0].bytes) as any),
        ),
      )
      chrome.storage.local.get(['userInfo', 'authorization'], async (result: any) => {
        const userInfo = result.userInfo
        const authorization = result.authorization
        const itemId = details.url.split(`/products/`)[1].split(`?`)[0]
        const userId = userInfo.id

        if (body.is_pick) {
          await fetch('https://o88aye9z6i.execute-api.ap-northeast-2.amazonaws.com/actions', {
            method: 'POST',
            headers: {
              'Content-Type': 'application/json',
            },
            body: JSON.stringify({
              member_id: userId,
              product_id: Number(itemId),
              action_type: 3,
            }),
          })
        }

        // FIXME: 원래 Request 받은 이후, 동작하게 해야하는데 시간이 없으므로 생략
        await sleep(1000)

        fetch('https://api.kurly.com/member/proxy/pick/v1/picks/products?ver=1', {
          method: 'GET',
          headers: {
            'Content-Type': 'application/json',
            authorization: authorization,
          },
        }).then(async (response) => {
          const resJson = await response.json()
          const ids: any[] = resJson.data.map((item: any) => item.no)
          const idsString = ids.join(`,`)

          const batchResponse = await fetch(
            `https://8eoluopi8h.execute-api.ap-northeast-2.amazonaws.com/items/batch/${idsString}`,
            {
              method: 'GET',
            },
          )
          const batchJson = await batchResponse.json()
          chrome.storage.local.set({ pickedItems: batchJson })
        })
      })
    },
    {
      urls: ['https://api.kurly.com/member/proxy/pick/v1/picks/products/*'],
    },
    ['requestBody'],
  )
}

function addCartEventHandler(): void {
  chrome.webRequest.onBeforeRequest.addListener(
    function (details: any) {
      if (details.method !== `POST`) return

      const body = JSON.parse(
        decodeURIComponent(
          String.fromCharCode.apply(null, new Uint8Array(details.requestBody.raw[0].bytes) as any),
        ),
      )
      chrome.storage.local.get(['userInfo', 'authorization'], async (result: any) => {
        const userInfo = result.userInfo
        const authorization = result.authorization
        const itemId = body.cartItems[0].dealProductNo
        const userId = userInfo.id

        if (body.is_pick) {
          await fetch('https://o88aye9z6i.execute-api.ap-northeast-2.amazonaws.com/actions', {
            method: 'POST',
            headers: {
              'Content-Type': 'application/json',
            },
            body: JSON.stringify({
              member_id: userId,
              product_id: Number(itemId),
              action_type: 4,
            }),
          })
        }

        // FIXME: 원래 Request 받은 이후, 동작하게 해야하는데 시간이 없으므로 생략
        await sleep(1000)

        fetch('https://api.kurly.com/carts/v1/refresh', {
          method: 'GET',
          headers: {
            'Content-Type': 'application/json',
            authorization: authorization,
          },
        }).then(async (response) => {
          const resJson = await response.json()
          const ids: any[] = resJson.data.cartItems.map((item: any) => item.dealProductNo)

          const detailResponse = await fetch('https://api.kurly.com/carts/v1/detail', {
            method: 'POST',
            headers: {
              'Content-Type': 'application/json',
              authorization: authorization,
            },
            body: JSON.stringify({
              address: '',
              addressDetail: '',
              cartItems: ids.map((id) => {
                return { dealProductNo: id, quantity: 1 }
              }),
            }),
          })

          const detailJson = await detailResponse.json()
          const detailIds: any[] = detailJson.data.dealProducts.map(
            (item: any) => item.contentsProductNo,
          )

          const batchResponse = await fetch(
            `https://8eoluopi8h.execute-api.ap-northeast-2.amazonaws.com/items/batch/${detailIds}`,
            {
              method: 'GET',
            },
          )
          const batchJson = await batchResponse.json()
          chrome.storage.local.set({ cartItems: batchJson })
        })
      })
    },
    {
      urls: ['https://api.kurly.com/carts/v1/add'],
    },
    ['requestBody'],
  )
}

export {}
