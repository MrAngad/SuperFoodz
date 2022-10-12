//SPDX-License-Identifier: MIT

pragma solidity 0.8.9;

import "@openzeppelin/contracts/access/Ownable.sol";
import "./OwnerWithdrawable.sol";
import "@chainlink/contracts/src/v0.8/interfaces/AggregatorV3Interface.sol";

contract Bridge is Ownable, OwnerWithdrawable {

  event PurchasedTokens(address _address, int256 _price, uint256 _wei);
  event RefundETH(address _address, uint256 _wei);
  AggregatorV3Interface internal priceFeed;

  bool saleActive;
  address immutable treasury;

  modifier ifSaleActive {
    require(saleActive == true , "Sale is not active");
    _;
  }

  constructor(address _priceFeed, address _treasury) {
    treasury = _treasury;
    priceFeed = AggregatorV3Interface(_priceFeed); // mainnet 0x5f4eC3Df9cbd43714FE2740f5E3616155c5b8419
  }

  function tokensReceived() external payable ifSaleActive {
    int256 _price;
    (, _price,,,) = priceFeed.latestRoundData();
    payable(treasury).transfer(msg.value);
    emit PurchasedTokens(msg.sender, _price, msg.value); // price - cost of ethereum in busd from pancakeswap

  }

  function refund(address _receiver) external payable onlyOwner {
    payable(treasury).transfer(msg.value);
    emit RefundETH(_receiver, msg.value); // price - cost of ethereum in busd from pancakeswap
  }

  function pauseSale() external onlyOwner {
    saleActive = false;
  }

  function unpauseSale() external onlyOwner {
    saleActive = true;
  }
  
  // Withdraw all the balance from the contract
  function withdrawAll() external onlyOwner {
    withdrawCurrency(address(this).balance);
  } 
}
