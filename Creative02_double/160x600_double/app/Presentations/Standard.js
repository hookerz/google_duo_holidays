export default function (adKit, config, standardPanel) {
  return new Promise(function (resolve, reject) {
    let cPanel = new standardPanel();
    cPanel.preload()
      .then(function () {
        cPanel.ee.on('catchall', config.exits.catch_all);
        cPanel.ee.on('cta', config.exits.cta);
      })
      .then(cPanel.init)

  })
}