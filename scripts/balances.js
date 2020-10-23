module.exports = async function main(callback) {
  try {
    const YDV = artifacts.require("YieldDelegatingVault");

    console.log ('reading balances');
    let usdc = new web3.eth.Contract(YDV.abi, '0x399ccE5797C2Aa3eA96A72074e0626f92a96c1aD');
    console.log ("usdc available yield = " + (await usdc.methods.availableYield().call()).toString());
    console.log ("usdc total deposits = " + (await usdc.methods.totalDeposits().call()).toString());


    let ycrv = new web3.eth.Contract(YDV.abi, '0x0513125C4ffDF276c6Bb9B67DbB532a9BA9804eD');
    console.log ("ycrv available yield = " + (await ycrv.methods.availableYield().call()).toString());
    console.log ("ycrv total deposts = " + (await ycrv.methods.totalDeposits().call()).toString());

    let tusd = new web3.eth.Contract(YDV.abi, '0x2b8f3badc786f38C5c44cA44541D1460b1c8468D');
    console.log ("tusd available yield = " + (await tusd.methods.availableYield().call()).toString());
    console.log ("tusd total deposts = " + (await tusd.methods.totalDeposits().call()).toString());


    let dai = new web3.eth.Contract(YDV.abi, '0x83919C38950b21c8B5170f95Bb2D8Ca02CAefc51');
    console.log ("dai available yield = " + (await dai.methods.availableYield().call()).toString());
    console.log ("dai total deposts = " + (await dai.methods.totalDeposits().call()).toString());

    let yfi = new web3.eth.Contract(YDV.abi, '0x16Ea160214795A67b66a82dbd45161b0b2cBE566');
    console.log ("yfi available yield = " + (await yfi.methods.availableYield().call()).toString());
    console.log ("yfi total deposts = " + (await yfi.methods.totalDeposits().call()).toString());


    let crvbusd = new web3.eth.Contract(YDV.abi, '0x7992652e1C9bA634bC26B978a44F736C94120D06');
    console.log ("crvbusd available yield = " + (await crvbusd.methods.availableYield().call()).toString());
    console.log ("crvbusd total deposts = " + (await crvbusd.methods.totalDeposits().call()).toString());

    let crvbtc = new web3.eth.Contract(YDV.abi, '0x8F412B4822c593aDcc01B2708229c7cB26c35725');
    console.log ("crvbtc available yield = " + (await crvbtc.methods.availableYield().call()).toString());
    console.log ("crvbtc total deposts = " + (await crvbtc.methods.totalDeposits().call()).toString());
    callback(0);
  } catch (error) {
    console.error(error);
    callback(1)
  }
};
