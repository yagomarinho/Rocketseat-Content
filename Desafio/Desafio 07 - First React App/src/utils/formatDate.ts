const formatDate = (value: Date): string =>
  new Date(value).toLocaleDateString();

export default formatDate;
