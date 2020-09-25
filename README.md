# yield-delegation

## The Concept
Proxy intended to wrap a yearn.finance vault and re-assign generated yield to a treasury address


## Development
### Building
This repo uses truffle. Ensure that you have truffle installed. Given the composability aspect of this

Then, to build the contracts run:
```
$ truffle compile
```

Update the workspace path in the clean.py to your own workspace.

To run tests, run against a single test package, i.e.:
```
$ sh startBlockchain.sh
$ truffle migrate --network development
$ python scripts/clean.py
$ cd jsTest
$ jest YDV
$ jest SampleToken
```
