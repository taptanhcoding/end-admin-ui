import currencyFormatter from 'currency-formatter' 


function formatMoney(val) {
    return currencyFormatter.format(val, {
        symbol: 'đ',
        decimal: '.',
        thousand: '.',
        precision: 0,
        format: '%v %s' // %s is the symbol and %v is the value
      });
}

export default formatMoney