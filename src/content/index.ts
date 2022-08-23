import WinBox from 'winbox/src/js/winbox.js'

import './components/table/table'
import './components/user-info/user-info'

import 'winbox/dist/css/winbox.min.css'
import './index.css'
import './components/card/card'
import './components/card-group/card-group'
import { html, render } from 'lit-html'

init()

async function init(): Promise<void> {
  await chrome.storage.local.clear()

  const userInfo = document.createElement('user-info')
  const table = document.createElement('kurly-table')

  initWinbox({
    key: 'showUserWindow',
    title: chrome.i18n.getMessage('USER_DATA'),
    slotElement: userInfo,
    x: 50,
    y: 50,
    width: '320px',
    height: '150px',
  })
  initWinbox({
    key: 'showRecentProductWindow',
    title: '테스트',
    slotElement: table,
    x: document.body.scrollWidth - 700,
    y: 50,
    width: '640px',
    height: '300px',
  })

  addSearchEventHandler()
}

function initWinbox({
  key,
  title,
  slotElement,
  x,
  y,
  width,
  height,
}: {
  key: string
  title: string
  slotElement: HTMLElement
  x: number
  y: number
  width: string
  height: string
}): void {
  let winbox: WinBox | null = null
  const table = slotElement

  chrome.storage.local.get([key], (result: any) => {
    const storageValue = result[key]

    if (storageValue === true) {
      winbox = new WinBox({
        title: title,
        index: 5000,
        background: 'rgb(95, 0, 128)',
        x,
        y,
        width,
        height,
        mount: table,
        onclose: () => {
          chrome.storage.local.set({ [key]: false })
          winbox.hide()
          return true
        },
      })
      return
    }
  })

  chrome.storage.onChanged.addListener((changes: any, area: 'local' | 'sync') => {
    if (area === 'local' && changes[key]) {
      const storageValue = changes[key]?.newValue

      if (storageValue === true) {
        if (winbox !== null) {
          winbox.show()
          return
        }
        winbox = new WinBox({
          title: title,
          index: 5000,
          background: 'rgb(95, 0, 128)',
          x,
          y,
          width,
          height,
          mount: table,
          onclose: () => {
            chrome.storage.local.set({ [key]: false })
            winbox.hide()
            return true
          },
        })
        return
      }
      winbox?.hide()
    }
  })
}

function addSearchEventHandler(): void {
  chrome.storage.onChanged.addListener(async (changes: any, area: 'local' | 'sync') => {
    if (area === 'local' && 'searchText' in changes) {
      const searchText = changes.searchText.newValue
      const searchData = [
        {
          item_id: 1000000548,
          img_url:
            'https://3p-image.kurly.com/product-image/0e24ded0-d9f2-4ff9-8bda-325e15a4acd7/8cf7ff06-2f6c-4cf5-aad9-febe162f219d.jpg',
          name: '[서울한정 예약딜리버리] 형제상회 프리미엄 모듬회(소)(8/27(토))',
          origin_price: 50000,
          sale_price: null,
          category: '수산/해산/건어물',
        },
        {
          item_id: 1000000549,
          img_url:
            'https://3p-image.kurly.com/product-image/0e24ded0-d9f2-4ff9-8bda-325e15a4acd7/8cf7ff06-2f6c-4cf5-aad9-febe162f219d.jpg',
          name: '상품B',
          origin_price: 40000,
          sale_price: 30000,
          category: '수산/해산/건어물',
        },
      ]
      // TODO: dev searchResult api
      // use dummy data
      // {
      //   "item_id": 1000000548,
      //   "img_url": "https://3p-image.kurly.com/product-image/0e24ded0-d9f2-4ff9-8bda-325e15a4acd7/8cf7ff06-2f6c-4cf5-aad9-febe162f219d.jpg",
      //   "name": "[서울한정 예약딜리버리] 형제상회 프리미엄 모듬회(소)(8/27(토))",
      //   "origin_price": 50000,
      //   "sale_price": null,
      //   "category": "수산/해산/건어물"
      // }
      await sleep(100)
      const headerElement = document.querySelector(`h3`)
      if (!headerElement) return

      render(
        html`
          <kurly-card-group>
            ${new Array(10).fill(0).map((item) => {
              return html`<kurly-card>Test</kurly-card>`
            })}
          </kurly-card-group>
        `,
        headerElement,
      )
    }
  })
}

async function sleep(ms: number) {
  return new Promise((resolve) => setTimeout(resolve, ms))
}

export {}
