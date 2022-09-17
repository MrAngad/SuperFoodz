//SPDX-License-Identifier: MIT

pragma solidity 0.8.9;

import "@openzeppelin/contracts/token/ERC20/extensions/IERC20Metadata.sol";
import "@openzeppelin/contracts/access/Ownable.sol";
import "@openzeppelin/contracts/token/ERC20/utils/SafeERC20.sol";
import "@openzeppelin/contracts/security/Pausable.sol";
import "@openzeppelin/contracts/utils/math/SafeMath.sol";

import "./OwnerWithdrawable.sol";

contract Croudsale is Ownable, OwnerWithdrawable {
  using SafeMath for uint256;
  using SafeERC20 for IERC20Metadata;

  address public immutable saleTokenAddress;  // Address of SF Token
  uint256 public immutable saleTokenDecimals; // Decimals in SF Token

  uint256 public preSaleStartTime;   // Time when PreSale starts
  uint256 public preSaleEndTime;     // Time when PreSale ends
  uint256 public totalTokensforSale; // Total tokens to be sold in the presale
  uint256 public totalTokensSold;    // Total tokens sold to the public in the ICO
  uint256 public rate;               // Rate wrt to Native Currency of the chain

  address[] public buyers;         // List of Buyers
  address[] public tokenSupported; // List of tokens supported

  mapping(address => uint256) public buyersAmount; // Amounts of SF Tokens bought by buyers
  mapping(address => bool) public tokenWL;         // Whitelist of tokens to buy from
  mapping(address => uint256) public tokenPrices;  // 1 Token price in terms of WL tokens
  
  // Modifier to check if the sale has already started
  modifier saleNotStarted(){
    if(preSaleStartTime != 0){
        require(block.timestamp < preSaleStartTime || block.timestamp > preSaleEndTime, "PreSale: Sale has already started!");
    }
    _;
  }

  // Modifier to check if the sale is active or not
  modifier saleDuration(){
    require(block.timestamp > preSaleStartTime, "Presale: Sale hasn't started");
    require(block.timestamp < preSaleEndTime, "PreSale: Sale has already ended");
    _;
  }

  constructor(address _token) {
    saleTokenAddress  = _token;
    saleTokenDecimals = IERC20Metadata(saleTokenAddress).decimals();
  }

  /*************
      Getters
  *************/

  // Public view function to calculate amount of sale tokens returned if you buy using "amount" of "token"
  function getTokenAmount(address token, uint256 amount) public view returns (uint256) {
    uint256 amtOut;
    if(token != address(0)){
      require(tokenWL[token] == true, "Presale: Token not whitelisted");
      // uint tokenDec = IERC20(token).decimals();
      uint256 price = tokenPrices[token];
      amtOut = amount.mul(10**saleTokenDecimals).div(price);
    }
    else{
      amtOut = amount.mul(10**saleTokenDecimals).div(rate);
    }
    return amtOut;
  }

  /*************
      Setters
  *************/

  // Public Function to buy tokens. APPROVAL needs to be done first
  function buyToken(address _token, uint256 _amount) external payable saleDuration {
    uint256 saleTokenAmt;
    if(_token != address(0)){
      require(_amount > 0, "Presale: Cannot buy with zero amount");
      require(tokenWL[_token] == true, "Presale: Token not whitelisted");

      saleTokenAmt = getTokenAmount(_token, _amount);
      require((totalTokensSold + saleTokenAmt) <= totalTokensforSale, "PreSale: Total Token Sale Reached!");
      IERC20Metadata(_token).safeTransferFrom(msg.sender, address(this), _amount);
    }
    else{
        saleTokenAmt = getTokenAmount(address(0), msg.value);
        require((totalTokensSold + saleTokenAmt) < totalTokensforSale, "PreSale: Total Token Sale Reached!");
    }
    // Update Stats
    totalTokensSold = totalTokensSold.add(saleTokenAmt);
    buyersAmount[msg.sender] = buyersAmount[msg.sender].add(saleTokenAmt);
    // bytes memory data = abi.encodeWithSignature("transfer(address,uint256)", msg.sender, saleTokenAmt);
    // (bool success, bytes memory returnData) = address(saleTokenAddress).call(data);
    // require(success, string(returnData));
  }

  // Function to set information of Token sold in Pre-Sale and its rate in Native currency
  function setSaleTokenParams(uint256 _totalTokensforSale, uint256 _rate) external onlyOwner saleNotStarted {
    require(_rate != 0, "PreSale: Invalid Native Currency rate!");
    rate = _rate;
    totalTokensforSale = _totalTokensforSale;
    IERC20Metadata(saleTokenAddress).safeTransferFrom(msg.sender, address(this), totalTokensforSale);
  }

  // Function to set Pre-Sale duration
  function setSalePeriodParams(uint256 _preSaleStartTime, uint256 _preSaleEndTime) external onlyOwner saleNotStarted {
    require(block.timestamp < _preSaleStartTime, "PreSale: Invalid PreSale Date!");
    require(_preSaleStartTime < _preSaleEndTime, "PreSale: Invalid PreSale Dates!");

    preSaleStartTime = _preSaleStartTime;
    preSaleEndTime   = _preSaleEndTime;
  }

  // Function to add payment tokens
  function addWhiteListedToken(address[] memory _tokens, uint256[] memory _prices) external onlyOwner saleNotStarted {
    require(_tokens.length == _prices.length, "Presale: tokens & prices arrays length mismatch");

    for (uint256 i = 0; i < _tokens.length; i++) {
      require(_prices[i] != 0, "Presale: Cannot set price to 0");
      tokenWL[_tokens[i]]     = true;
      tokenPrices[_tokens[i]] = _prices[i];
    }
  }

  // Function to update token rate
  function updateTokenRate(address[] memory _tokens, uint256[] memory _prices, uint256 _rate) external onlyOwner {
    require(_tokens.length == _prices.length, "Presale: tokens & prices arrays length mismatch");

    if(_rate != 0) {
      rate = _rate;
    }

    for(uint256 i = 0; i < _tokens.length; i++) {
      require(tokenWL[_tokens[i]] == true, "Presale: Token not whitelisted");
      require(_prices[i] != 0, "PreSale: Cannot set rate as 0");
      tokenPrices[_tokens[i]] = _prices[i];
    }
  }

  // Stop the Sale 
  function stopSale() external onlyOwner saleDuration {
    preSaleEndTime = block.timestamp;
  }

  // Withdraw all the balance from the contract
  function withdrawAll() external onlyOwner {
    for(uint256 i = 0; i < tokenSupported.length; i++) {
      address token = tokenSupported[i];
      uint256 amt = IERC20(token).balanceOf(address(this));
      withdraw(token, amt);
      withdrawCurrency(address(this).balance);
    }
  } 

}