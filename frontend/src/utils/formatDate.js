export function formatDate(date) {
  let formatedDate = new Date(date).toLocaleDateString();
  return formatedDate;
}
