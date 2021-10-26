/* config-overrides.js */
/* eslint-disable react-hooks/rules-of-hooks */
/* eslint-disable import/no-extraneous-dependencies */
const { useBabelRc, override } = require('customize-cra');

module.exports = override(useBabelRc());
