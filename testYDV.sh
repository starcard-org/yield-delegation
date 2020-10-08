truffle compile
truffle migrate --network development
python scripts/clean.py
cd jsTest
jest RallyToken.test.js
jest SampleToken.test.js
jest SampleVault.test.js
jest YDVRewardsDistributor.test.js
jest SampleYDV.test.js
jest YDV.test.js