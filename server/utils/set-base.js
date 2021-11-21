/**
 * @description Takes a base currency and a forex data object then sets the base currency to be the passed one
 * @param {String} base: The currency to be set as base currency
 * @param {Boolean} includesEuro: Is true if Euros is among the specified rates
 * @param {Object} object: The data object containing the rates, date and base currency
 * @returns {Object} Returns a domain object with the specified base currency
 */
module.exports = function setBase(base, includesEuro, object){
  if(base == object.base){
    return {
      "base": base,
      "date": object.date,
      "rates": object.rates
    }
  } else{
    const domainObject = {
      "base": base,
      "date": object.date,
      "rates": {}
    };
    const divisor = object["rates"][base];
    const rateKeys = Object.keys(object.rates);
    for(let currency of rateKeys){
      if(currency != base){
        domainObject["rates"][currency] = (object["rates"][currency]/divisor).toFixed(6);
      }
    }
    if(includesEuro) domainObject["rates"]["EUR"] = (1 / divisor).toFixed(6);
    return domainObject;
  }
}
