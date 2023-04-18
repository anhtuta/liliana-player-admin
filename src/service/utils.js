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

/**
 * kB,MB,GB,TB,PB,EB,ZB,YB
 * https://stackoverflow.com/a/20463021/7688028
 */
export function fileSizeSI(a, b, c, d, e) {
  return (
    ((b = Math), (c = b.log), (d = 1e3), (e = (c(a) / c(d)) | 0), a / b.pow(d, e)).toFixed(2) +
    ' ' +
    (e ? 'kMGTPEZY'[--e] + 'B' : 'Bytes')
  );
}

/**
 * KiB,MiB,GiB,TiB,PiB,EiB,ZiB,YiB
 * https://stackoverflow.com/a/20463021/7688028
 */
export function fileSizeIEC(a, b, c, d, e) {
  return (
    ((b = Math), (c = b.log), (d = 1024), (e = (c(a) / c(d)) | 0), a / b.pow(d, e)).toFixed(2) +
    ' ' +
    (e ? 'KMGTPEZY'[--e] + 'iB' : 'Bytes')
  );
}

export function arrayFromRange(start, end) {
  const res = [];
  if (start <= end) {
    for (let i = start; i <= end; i++) {
      res.push(i);
    }
    return res;
  } else {
    for (let i = start; i >= end; i--) {
      res.push(i);
    }
    return res;
  }
}
