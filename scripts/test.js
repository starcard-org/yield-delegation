module.exports = async function main(callback) {
  try {
    const vault = artifacts.require("Vault");
    //let busd = new web3.eth.Contract(vault.abi, '0x2994529C0652D127b7842094103715ec5299bBed');
    let ycrv = new web3.eth.Contract(vault.abi, '0x5dbcF33D8c2E976c6b560249878e6F1491Bca25c');

    const YDV =  artifacts.require("YieldDelegatingVault");
    //let ydv = new web3.eth.Contract(YDV.abi, '0x7992652e1C9bA634bC26B978a44F736C94120D06');
    let ydv = new web3.eth.Contract(YDV.abi, '0x0513125C4ffDF276c6Bb9B67DbB532a9BA9804eD');

    let block = 11082164; //await web3.eth.getBlockNumber();
    console.log("block,timestamp,pricePerFullShare,totalDeposits,balanceOfYdv");
//    for (var i = 11070000; i < block; i+=250) {
  //   let timestamp = (await web3.eth.getBlock(i)).timestamp

    // let price = await ycrv.methods.getPricePerFullShare().call({}, i);
//     let totalDeposits = await ydv.methods.totalDeposits().call({}, i);
  //   let busd_shares = await busd.methods.balanceOf('0x7992652e1C9bA634bC26B978a44F736C94120D06').call({}, i);

     //console.log(i + ", " + timestamp + ", " + price + ", " + totalDeposits + ", " + busd_shares);

      //console.log(i + ", " + timestamp + ", " + price);
   // }
    let timestamp = (await web3.eth.getBlock(block)).timestamp
    let price = await ycrv.methods.getPricePerFullShare().call({}, block);
    let totalDeposits = await ydv.methods.totalDeposits().call({}, block);
    let busd_shares = await ycrv.methods.balanceOf('0x0513125C4ffDF276c6Bb9B67DbB532a9BA9804eD').call({}, block);
    console.log(block + ", " + timestamp + ", " + price);
    console.log(busd_shares);
    console.log(totalDeposits);
    callback(0);
  } catch (error) {
    console.error(error);
    callback(1);
  }
}
