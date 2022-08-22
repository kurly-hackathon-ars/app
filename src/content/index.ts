import WinBox from 'winbox/src/js/winbox.js'

import './components/table/table'
import './components/user-info/user-info'

import 'winbox/dist/css/winbox.min.css'
import './index.css'

init()

function init(): void {
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

export {}
