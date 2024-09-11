/** @type {import("./src/types/global").ConfigOptions[]} */
export default [
  {
    input: './demo/example.xlsx',
    outputDir: './demo/output',
    keys: ['section', 'element', 'child', 'modifier'],
    values: ['en-us', 'zh-cn', 'zh-hk']
  },
  {
    input: './demo/YFLife SIS Language Sheet.xlsx',
    outputDir: './demo/yf',
    keys: ['Key'],
    values: ['en_US', 'zh_CN', 'zh_HK'],
    ignores: {
      sheets: ['Azure Login']
    },
    options: {
      caseConversion: false,
      fallbackValue: false,
      overwriteDuplicateKey: false
    }
  }
  // {
  //   ignores: {
  //     rows: [],
  //     sheets: []
  //   },
  //   input: './demo/example.xlsx',
  //   keys: ['epic', 'feature', 'scenario', 'given', 'when', 'then'],
  //   options: {
  //     // caseConversion: 'camelCase',
  //     // enableSheetGroup: false,
  //     // fallbackValue: 'VALUE_NOT_FOUND',
  //     // flattenOutput: false,
  //     // separator: '.'
  //   },
  //   outputDir: './demo/output',
  //   values: ['en-us', 'zh-cn', 'zh-hk']
  // },
  // {
  //   ignores: {
  //     rows: [],
  //     sheets: []
  //   },
  //   input: './demo/example.xlsx',
  //   keys: ['epic', 'feature', 'scenario', 'given', 'when', 'then'],
  //   options: {
  //     caseConversion: 'constantCase',
  //     enableSheetGroup: true,
  //     fallbackValue: 'VALUE_NOT_FOUND',
  //     flattenOutput: true,
  //     separator: '_-_'
  //   },
  //   outputDir: './demo/output2',
  //   values: ['en-us', 'zh-cn', 'zh-hk']
  // }
  // // {
  // //   ignores: {
  // //     rows: [],
  // //     sheets: []
  // //   },
  // //   input: './demo/example.xlsx',
  // //   keys: ['epic', 'feature', 'scenario', 'given', 'when', 'then'],
  // //   options: {
  // //     overwriteDuplicateKey: false
  // //   },
  // //   outputDir: './demo/output3',
  // //   values: ['en-us', 'zh-cn', 'zh-hk']
  // // }
];
