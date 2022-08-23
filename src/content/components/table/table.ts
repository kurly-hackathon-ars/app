import { html, LitElement, TemplateResult, unsafeCSS } from 'lit'
import { customElement, property } from 'lit/decorators.js'

import tailwind from '../../../styles/tailwind.css?inline'
import { toPriceString } from '../../utils/toPriceString'

@customElement('kurly-table')
export class KurlyTable extends LitElement {
  static styles = [unsafeCSS(tailwind)]

  @property({ type: Array })
  columns = [chrome.i18n.getMessage('PRODUCT'), chrome.i18n.getMessage('SCORE')]

  @property({ type: Array })
  dataArray: KurlyTableData[] = []

  #renderTableRow(data: KurlyTableData): TemplateResult {
    if (data === null) return html``
    return html`
      <tr>
        <td>
          <div class="flex items-center space-x-3">
            <div class="avatar">
              <div class="mask mask-squircle w-12 h-12">
                <img src="${data.img_url}" alt="${data.name}" />
              </div>
            </div>
            <div>
              <div class="font-bold">${data.name}</div>
              <div class="text-sm opacity-50">${toPriceString(data.origin_price)}</div>
            </div>
          </div>
        </td>
        ${data?.score ? html`<td>${data.score}</td>` : null}
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
  category: string
  id: number
  img_url: string
  index: number
  name: string
  origin_price: number
  sale_price: number
  score?: number
}
