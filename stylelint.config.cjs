module.exports = {
  customSyntax: 'postcss-scss',
  plugins: ['stylelint-declaration-strict-value'],
  rules: {
    'scale-unlimited/declaration-strict-value': [
      [
        '/color/',
        'font-size',
        'line-height',
        'letter-spacing',
        'margin',
        'margin-top',
        'margin-right',
        'margin-bottom',
        'margin-left',
        'padding',
        'padding-top',
        'padding-right',
        'padding-bottom',
        'padding-left',
        'gap'
      ],
      {
        ignoreValues: ['transparent', 'inherit', 'currentColor', 'none', '0', 'auto']
      }
    ]
  }
};
