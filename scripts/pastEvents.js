module.exports = async function main(callback) {
  try {
    const ERC20 =  artifacts.require("ERC20");
    let token = new web3.eth.Contract(ERC20.abi, '0xf1f955016EcbCd7321c7266BccFB96c68ea5E49b');//mainnet RLY token

    let block = await web3.eth.getBlockNumber();


    //from rewards distributor to the YFI YDV
    let events = await token.getPastEvents("Transfer", {filter:{from:'0xFb467828778a6747011c467e1B346D08491Ae353', to:'0x16Ea160214795A67b66a82dbd45161b0b2cBE566'}, fromBlock:block-100000});

    console.log(events);
    callback(0);
  } catch (error) {
    console.error(error);
    callback(1);
  }
}
