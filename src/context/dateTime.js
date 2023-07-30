// convert epochtime to JavaScripte Date object
function epochToJsDate(epochTime) {
    return new Date(epochTime * 1000);
  }
  
  // convert time to sen2an-readable format YYYY/MM/DD HH:MM:SS
  function epochToDateTime(epochTime) {
    var epochDate = new Date(epochToJsDate(epochTime));
    var dateTime = epochDate.getFullYear() + "/" +
      ("00" + (epochDate.getMonth() + 1)).slice(-2) + "/" +
      ("00" + epochDate.getDate()).slice(-2) + " " +
      ("00" + epochDate.getHours()).slice(-2) + ":" +
      ("00" + epochDate.getMinutes()).slice(-2) + ":" +
      ("00" + epochDate.getSeconds()).slice(-2);
  
    return dateTime;
  }

  export {
    epochToDateTime
  }