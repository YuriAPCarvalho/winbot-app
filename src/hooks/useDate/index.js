import moment from "moment";

export function useDate() {
  function dateToClient(strDate) {
    if (moment(strDate).isValid()) {
      return moment(strDate).format("DD/MM/YYYY");
    }
    return strDate;
  }

  function datetimeToClient(strDate) {
    if (moment(strDate).isValid()) {
      return moment(strDate).format("DD/MM/YYYY HH:mm");
    }
    return strDate;
  }

  function dateToDatabase(strDate) {
    if (moment(strDate, "DD/MM/YYYY").isValid()) {
      return moment(strDate).format("YYYY-MM-DD HH:mm:ss");
    }
    return strDate;
  }

  function dateIsBeforeToday(strDate) {
    return moment(moment().format()).isBefore(strDate);
  }

  return {
    dateToClient,
    datetimeToClient,
    dateToDatabase,
  };
}
