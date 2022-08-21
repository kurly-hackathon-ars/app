import WinBox from 'winbox/src/js/winbox.js'

import './components/table/table'

import 'winbox/dist/css/winbox.min.css'
import './index.css'

init()

function init(): void {
  initStorage()
}

function initStorage(): void {
  let searchWinbox: WinBox | null = null
  chrome.storage.local.get(['showWindowSearch'], (result: any) => {
    const showWindowSearch = result.showWindowSearch

    if (showWindowSearch === true) {
      searchWinbox = new WinBox({
        title: '검색 결과',
        index: 5000,
        background: 'rgb(95, 0, 128)',
        x: document.body.scrollWidth - 700,
        y: 50,
        width: '640px',
        height: '300px',
        html: `<kurly-table></kurly-table>`,
        onclose: () => {
          chrome.storage.local.set({ showWindowSearch: false })
          searchWinbox.hide()
          return true
        },
      })
      return
    }
  })

  chrome.storage.onChanged.addListener((changes: any, area: 'local' | 'sync') => {
    console.log(changes)
    if (area === 'local' && changes.showWindowSearch) {
      const showWindowSearch = changes.showWindowSearch?.newValue

      if (showWindowSearch === true) {
        if (searchWinbox !== null) {
          searchWinbox.show()
          return
        }
        searchWinbox = new WinBox({
          title: '검색 결과',
          index: 5000,
          background: 'rgb(95, 0, 128)',
          x: document.body.scrollWidth - 700,
          y: 50,
          width: '640px',
          height: '300px',
          html: `<kurly-table></kurly-table>`,
          onclose: () => {
            chrome.storage.local.set({ showWindowSearch: false })
            searchWinbox.hide()
            return true
          },
        })
        return
      }
      searchWinbox?.hide()
    }
  })
}

export {}
