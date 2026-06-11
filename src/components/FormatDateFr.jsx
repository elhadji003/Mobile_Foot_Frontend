export const FormatDateFR = (dateString) => {
  const date = new Date(dateString);

  return new Intl.DateTimeFormat("fr-FR", {
    weekday: "long",
    day: "2-digit",
    month: "long",
    year: "numeric",
  }).format(date);
};
