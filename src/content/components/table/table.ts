import { html, LitElement, TemplateResult, unsafeCSS } from 'lit'
import { customElement, property } from 'lit/decorators.js'

import tailwind from '../../../styles/tailwind.css?inline'

@customElement('kurly-table')
export class KurlyTable extends LitElement {
  static styles = [unsafeCSS(tailwind)]

  @property({ type: Array })
  columns = [
    chrome.i18n.getMessage('PRODUCT'),
    chrome.i18n.getMessage('SCORE'),
    chrome.i18n.getMessage('DIFF_PERCENT'),
  ]

  @property({ type: Array })
  dataArray: KurlyTableData[] = [
    {
      name: '[스킨푸드] 블랙슈가 퍼펙트 에센셜 스크럽2X 210g',
      imgSrc:
        'https://img-cf.kurly.com/cdn-cgi/image/width=400,format=auto/shop/data/goods/1655473008977l0.jpg',
      price: '11,400 원',
      score: '78.5',
      diff: '-1.5%',
    },
    {
      name: '[CNP 차앤박] 프로폴리스 에너지 앰플 미스트 250ml',
      imgSrc:
        'https://img-cf.kurly.com/cdn-cgi/image/width=400,format=auto/shop/data/goods/1646720198252l0.jpg',
      price: '22,500 원',
      score: '68.5',
      diff: '-2.5%',
    },
  ]

  #renderTableRow(data: KurlyTableData): TemplateResult {
    return html`
      <tr>
        <td>
          <div class="flex items-center space-x-3">
            <div class="avatar">
              <div class="mask mask-squircle w-12 h-12">
                <img src="${data.imgSrc}" alt="${data.name}" />
              </div>
            </div>
            <div>
              <div class="font-bold">${data.name}</div>
              <div class="text-sm opacity-50">${data.price}</div>
            </div>
          </div>
        </td>
        <td>${data.score}</td>
        <td>${data.diff}</td>
      </tr>
    `
  }

  render() {
    const columns = this.columns.map((column) => html`<th>${column}</th>`)
    const tableRows = this.dataArray.map((row) => this.#renderTableRow(row))

    return html`
      <div class="overflow-x-auto w-full" data-theme="fantasy">
        <table class="table w-full">
          <!-- head -->
          <thead>
            <tr>
              ${columns}
            </tr>
          </thead>
          <tbody>
            <!-- row 1 -->
            ${tableRows}
          </tbody>
        </table>
      </div>
    `
  }
}

declare global {
  interface HTMLElementTagNameMap {
    'kurly-table': KurlyTable
  }
}

export interface KurlyTableData {
  name: string
  imgSrc: string
  price: string
  score: string
  diff: string
}
