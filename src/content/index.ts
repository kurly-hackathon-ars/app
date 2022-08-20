import WinBox from 'winbox/src/js/winbox.js'

import './components/table/table'

import 'winbox/dist/css/winbox.min.css'
import './index.css'

new WinBox({
  title: '마켓컬리 상품 추천',
  index: 5000,
  background: 'rgb(95, 0, 128)',
  x: document.body.scrollWidth - 700,
  y: 50,
  width: '640px',
  height: '300px',
  html: `<kurly-table></kurly-table>`,
})

export {}
