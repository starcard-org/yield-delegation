module.exports = async function main(callback) {
  try {
    const LM =  artifacts.require("NoMintLiquidityRewardPools");
    let pools = new web3.eth.Contract(LM.abi, '0x9cf178df8ddb65b9ea7d4c2f5d1610eb82927230');//liquidity reward pools

    let block = await web3.eth.getBlockNumber();

    //from rewards distributor to the YFI YDV
    let events = await pools.getPastEvents("Deposit", {fromBlock:11000000});
    let depositors = events.map(a => a.returnValues.user);

    var uniqueHolders = [new Set(), new Set(), new Set(), new Set(), new Set()];
    for (var depositor of depositors) {
     /*console.log(depositor); 
     for (var i = 0; i < 5; i++) {
        let amount = (await pools.methods.userInfo(0,depositor).call()).amount;
        if (i > 0) {
          uniqueHolders[i].add(depositor);
        }
      }*/
     uniqueHolders[0].add(depositor);
    }
    console.log("set 1 size" + uniqueHolders[0].size);
    console.log("set 2 size" + uniqueHolders[1].size);
    console.log("set 3 size" + uniqueHolders[2].size);
    console.log("set 4 size" + uniqueHolders[3].size);
    console.log("set 5 size" + uniqueHolders[4].size);

    callback(0);
  } catch (error) {
    console.error(error);
    callback(1);
  }
}
