export default function () {
  let api = {};
  api.process = function (string) {
    if (!window.previewData) return string;
    let result = string;
    for (let key in window.previewData) {
      let value = window.previewData[key];
      result = result.replace(new RegExp('{{' + key + '}}', 'g'), value);
    }
    return result;
  };
  return api;
}