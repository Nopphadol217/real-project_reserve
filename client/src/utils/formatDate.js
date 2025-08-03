import moment from "moment/min/moment-with-locales";

export const formatDate = (check, locale) => {
  return moment(check).locale(locale).format("ll");
};
