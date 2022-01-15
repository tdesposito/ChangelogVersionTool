const config = require('../src/common/config').defaultConfig
for (const [key, entry] of Object.entries(config.sections)) {
  const p = entry.pattern.split('/')
  entry.regex = new RegExp(p[1], p[2])
}
config.showMessageBody = false
exports.config = config

exports.log = [
  '2274e7d21b4965ac1efab8b4516aa65d2a38fe0f##2274e7d##Todd Esposito## (HEAD -> main, tag: v2.0.0)##2021-11-05##this commit BREAKS old code',
  '5bbfc30330fdb4763337be51da390dcecfb043af##5bbfc30##Todd Esposito####2021-11-05##did misc work',
  'e19c0820c5a497a909289576c40d719981541b70##e19c082##Todd Esposito####2021-11-05##fixed a feature',
  'a1494e3bfe80828a7176e190fbe834f12a670e22##a1494e3##Todd Esposito####2021-11-05##deprecated a feature',
  'd16233dc39becd06f780245793711023b22f2cca##d16233d##Todd Esposito####2021-11-05##fixed a security bug',
  '4e6d082b5e982d7f4c96c1fd9e0e4be9de9eeca8##4e6d082##Todd Esposito## (tag: v1.1.0)##2021-11-05##change another feature',
  '4352f1b62d19c17e9ee690e528447bc230f64c4f##4352f1b##Todd Esposito####2021-11-05##add feature 3',
  '39679bfc17fe265089eb7d54853e5c7609de9a21##39679bf##Todd Esposito####2021-11-05##add another feature',
  '1cbe7d2c300a6bccd9452f62dac4fd95b37f442e##1cbe7d2##Todd Esposito## (tag: v1.0.0)##2021-11-05##add main feature',
  'ae87ba1dab5625c7eaf51d85e98ea0f1e2e2b9a1##ae87ba1##Todd Esposito####2021-11-05##update gitignore',
  'a1337e14e69fb17a047d30af6ce7a83226c7d13d##a1337e1##Todd Esposito####2021-11-05##init gitignore',
  '0ace208545337b4730a6bc57107b72dfab72dee1##0ace208##Todd Esposito####2021-11-05##cvbump - initialize configuration'
]

exports.logEntry = [
  '## 2.0.0 - 2021-11-01',
  '### BREAKING CHANGES: Be aware these changes may break older code.',
  '  * this commit BREAKS old code',
  '',
  '### Security Related Changes',
  '  * fixed a security bug',
  '',
  '### Deprecated: These features/functions will be removed in a future release.',
  '  * deprecated a feature',
  '',
  '### Fixed',
  '  * fixed a feature',
  '',
].join('\n')
