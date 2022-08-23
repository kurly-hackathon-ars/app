import WinBox from 'winbox/src/js/winbox.js'

import './components/table/table'
import './components/user-info/user-info'

import 'winbox/dist/css/winbox.min.css'
import './index.css'
import './components/card/card'
import './components/card-group/card-group'
import { html, render } from 'lit-html'
import { equals } from './utils/equal'
import { sleep } from './utils/sleep'

init()

async function init(): Promise<void> {
  const userInfo = document.createElement('user-info')
  const recentGoodsTable = document.createElement('kurly-table')
  const pickedItemsTable = document.createElement('kurly-table')
  const cartItemsTable = document.createElement('kurly-table')

  await chrome.storage.local.remove('recentProduct')
  await chrome.storage.local.remove('pickedItems')
  await chrome.storage.local.remove('cartItems')

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
    title: chrome.i18n.getMessage('RECENT_PRODUCT'),
    slotElement: recentGoodsTable,
    x: document.body.scrollWidth - 700,
    y: 50,
    width: '640px',
    height: '300px',
    callbackChangedStorage: (changes: any, winbox: WinBox) => {
      if ('recentProduct' in changes) {
        const value = changes.recentProduct.newValue
        recentGoodsTable.dataArray = value
        winbox && winbox.mount(recentGoodsTable)
      }
    },
  })
  initWinbox({
    key: 'showPickedItemsWindow',
    title: chrome.i18n.getMessage('PICKED_ITEMS'),
    slotElement: pickedItemsTable,
    x: document.body.scrollWidth - 700,
    y: 350,
    width: '640px',
    height: '300px',
    callbackChangedStorage: (changes: any, winbox: WinBox) => {
      if ('pickedItems' in changes) {
        const value = changes.pickedItems.newValue
        pickedItemsTable.dataArray = value
        winbox && winbox.mount(pickedItemsTable)
      }
    },
  })
  initWinbox({
    key: 'showCartItemsWindow',
    title: chrome.i18n.getMessage('CART_ITEMS'),
    slotElement: cartItemsTable,
    x: document.body.scrollWidth - 700,
    y: 650,
    width: '640px',
    height: '300px',
    callbackChangedStorage: (changes: any, winbox: WinBox) => {
      if ('cartItems' in changes) {
        const value = changes.cartItems.newValue
        cartItemsTable.dataArray = value
        winbox && winbox.mount(cartItemsTable)
      }
    },
  })

  addSearchEventHandler()
  addChangedUrlHandler()
}

function initWinbox({
  key,
  title,
  slotElement,
  x,
  y,
  width,
  height,
  callbackChangedStorage,
}: {
  key: string
  title: string
  slotElement: HTMLElement
  x: number
  y: number
  width: string
  height: string
  callbackChangedStorage?: Function
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
    callbackChangedStorage && callbackChangedStorage(changes, winbox)
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
    if (area === 'local' && 'searchResult' in changes) {
      const searchData: Product[] = changes.searchResult.newValue

      await sleep(200)
      const headerElement = document.querySelector(`h3`)

      if (!headerElement) return

      render(
        html`
          <kurly-card-group>
            ${searchData.map((item) => {
              return html`<kurly-card
                .categoryString=${item.category}
                .imgSrc=${item.img_url}
                .name=${item.name}
                .price=${item.origin_price}
                .no=${item.no}
              ></kurly-card>`
            })}
          </kurly-card-group>
        `,
        headerElement,
      )
    }
  })
}

async function addChangedUrlHandler(): Promise<void> {
  let previousGoodsRecent: any[] = []

  saveRecentProduct({
    skipCompareEqual: true,
  })

  chrome.storage.onChanged.addListener(async (changes: any, area: 'local' | 'sync') => {
    if (area === 'local' && 'onChangedUrl' in changes) {
      saveRecentProduct()
    }
  })

  async function saveRecentProduct({ skipCompareEqual = false } = {}): Promise<void> {
    if (!window.localStorage) return

    const goodsRecentString = localStorage.getItem('goodsRecent')

    if (!goodsRecentString) return

    const goodsRecent: any[] = JSON.parse(goodsRecentString)

    if (skipCompareEqual === false && equals(previousGoodsRecent, goodsRecent)) return

    previousGoodsRecent = goodsRecent

    const ids = goodsRecent.map((item) => item.no)
    const idsString = ids.join(`,`)

    const response = await fetch(
      `https://8eoluopi8h.execute-api.ap-northeast-2.amazonaws.com/items/batch/${idsString}`,
      {
        method: 'GET',
      },
    )
    const resJson = await response.json()
    chrome.storage.local.set({ recentProduct: resJson })
  }
}

export {}

export interface Product {
  item_id: number
  img_url: string
  name: string
  origin_price: number
  sale_price: number
  category: string
  no: number
}
