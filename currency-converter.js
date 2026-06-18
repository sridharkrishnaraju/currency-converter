/**
 * <currency-converter> — live currency converter (USD, SGD, MYR, INR, EUR, GBP, …).
 * Rates from the free, no-key frankfurter.app API (ECB reference rates). Zero dependencies.
 * Built & maintained by SGBP — Singapore Build Partners (https://sgbp.tech). MIT.
 */
class CurrencyConverter extends HTMLElement {
  constructor() { super(); this.attachShadow({ mode: "open" }); this.amount = 100; this.from = "USD"; this.to = "SGD"; this._t = null; }
  connectedCallback() { this.render(); this._convert(); }
  async _convert() {
    const $ = (s) => this.shadowRoot.querySelector(s);
    const res = $("#result");
    if (!(this.amount > 0)) { res.textContent = "—"; return; }
    if (this.from === this.to) { res.innerHTML = `${this.amount} ${this.from} = <b>${this.amount.toFixed(2)} ${this.to}</b>`; return; }
    res.textContent = "…";
    try {
      const r = await fetch(`https://api.frankfurter.dev/v1/latest?base=${this.from}&symbols=${this.to}`);
      if (!r.ok) throw new Error();
      const d = await r.json();
      const rate = d.rates[this.to];
      if (rate == null) throw new Error();
      const v = this.amount * rate;
      res.innerHTML = `${this.amount} ${this.from} = <b>${v.toFixed(2)} ${this.to}</b><span class="rate">1 ${this.from} = ${rate.toFixed(4)} ${this.to} · ECB ${d.date}</span>`;
    } catch (e) { res.innerHTML = `<span class="err">Couldn't fetch live rates — check your connection and try again.</span>`; }
  }
  _debounced() { clearTimeout(this._t); this._t = setTimeout(() => this._convert(), 300); }
  render() {
    const CUR = ["USD", "SGD", "MYR", "INR", "EUR", "GBP", "AUD", "JPY", "CNY", "HKD", "IDR", "THB", "PHP", "KRW", "CAD", "CHF", "NZD"];
    const opts = (sel) => CUR.map((c) => `<option value="${c}"${c === sel ? " selected" : ""}>${c}</option>`).join("");
    this.shadowRoot.innerHTML = `
      <style>
        *,*::before,*::after{box-sizing:border-box}
        :host{display:block;width:100%;max-width:480px;font-family:system-ui,-apple-system,Segoe UI,Roboto,sans-serif}
        .card{border:1px solid #e2e2e2;border-radius:12px;background:#fff;box-shadow:0 1px 3px rgba(0,0,0,.06);padding:16px}
        .row{display:flex;gap:10px;align-items:flex-end;flex-wrap:wrap}
        .fld{flex:1;min-width:120px}
        label{display:block;font-size:12px;font-weight:600;color:#555;margin-bottom:5px}
        input,select{width:100%;padding:10px;border:1px solid #ccc;border-radius:8px;font:inherit;font-size:16px;background:#fff}
        .swap{flex:0 0 auto;height:42px;width:42px;border:1px solid #ccc;border-radius:8px;background:#fafafa;cursor:pointer;font-size:16px;color:#555}
        .result{margin-top:16px;padding:14px;background:#fafafa;border:1px solid #eee;border-radius:10px;font-size:18px;color:#333;text-align:center}
        .result b{color:#EB0028;font-size:22px}
        .rate{display:block;font-size:12px;color:#888;margin-top:6px;font-weight:400}
        .err{color:#c5221f;font-size:14px}
        .foot{display:flex;justify-content:flex-end;margin-top:10px}
        .reset{font:inherit;font-size:12px;font-weight:700;color:#EB0028;background:none;border:0;cursor:pointer}
      </style>
      <div class="card">
        <div class="row">
          <div class="fld"><label>Amount</label><input type="number" id="amt" value="${this.amount}" min="0" step="any" inputmode="decimal"></div>
        </div>
        <div class="row" style="margin-top:10px">
          <div class="fld"><label>From</label><select id="from">${opts(this.from)}</select></div>
          <button class="swap" id="swap" title="Swap" aria-label="Swap currencies">&#8644;</button>
          <div class="fld"><label>To</label><select id="to">${opts(this.to)}</select></div>
        </div>
        <div class="result" id="result">—</div>
        <div class="foot"><button class="reset" id="reset">Reset</button></div>
      </div>`;
    const $ = (s) => this.shadowRoot.querySelector(s);
    $("#amt").addEventListener("input", (e) => { this.amount = parseFloat(e.target.value) || 0; this._debounced(); });
    $("#from").addEventListener("change", (e) => { this.from = e.target.value; this._convert(); });
    $("#to").addEventListener("change", (e) => { this.to = e.target.value; this._convert(); });
    $("#swap").addEventListener("click", () => { [this.from, this.to] = [this.to, this.from]; $("#from").value = this.from; $("#to").value = this.to; this._convert(); });
    $("#reset").addEventListener("click", () => { this.amount = 100; this.from = "USD"; this.to = "SGD"; this.render(); this._convert(); });
  }
}
if (!customElements.get("currency-converter")) customElements.define("currency-converter", CurrencyConverter);
