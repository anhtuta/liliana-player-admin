export const cleanWithHyphen = (str) => {
  return (
    str
      .trim()
      // replace all spaces with hyphen
      .replace(/\s+/g, '-')
      // remove all following special characters: ?,&%!@#$^*
      .replace(/[?,&%!@#$^*\\/]+/g, '')
      // remove multiple hyphens with single hyphen
      .replace(/[-]+/g, '-')
  );
};

export const getAbsoluteUrl = (uri) => {
  if (uri.startsWith('http')) return uri;
  return process.env.REACT_APP_HOST_API + uri;
};
