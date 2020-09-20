truffle compile
truffle migrate --network development
python scripts/clean.py
cd jsTest
jest YDV.test.js
jest SampleToken.test.js