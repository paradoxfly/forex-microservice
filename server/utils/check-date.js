const { TooManyRequests } = require("http-errors")

/**
 * @description This function takes a date string and roughly makes sure it follows the convention yyyy-mm-dd
 * @param {String} date Date string
 * @returns {Boolean} returns true if date follows proper convention
 */
 module.exports = function checkDate(date){
  var dateArray = date.split("-");
  if(dateArray.length != 3) return false
  if((dateArray[0].length == 4)&&(dateArray[1].length == 2)&dateArray[2].length == 2){
    return true;
  } else{
    return false;
  }
}

