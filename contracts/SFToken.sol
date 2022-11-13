//SPDX-License-Identifier: MIT

pragma solidity 0.8.9;

import "@openzeppelin/contracts/token/ERC20/ERC20.sol";
import "@openzeppelin/contracts/access/Ownable.sol";
import "@openzeppelin/contracts/token/ERC20/utils/SafeERC20.sol";
import "@openzeppelin/contracts/token/ERC20/extensions/ERC20Capped.sol";
import "@openzeppelin/contracts/token/ERC20/extensions/ERC20Burnable.sol";
import "@openzeppelin/contracts/security/Pausable.sol";

contract SFToken is ERC20, Pausable, Ownable, ERC20Capped {
  using SafeERC20 for ERC20;

  constructor(string memory _name, string memory _symbol, uint256 _initialSupply, uint256 _maxSupply) 
  ERC20(_name, _symbol) 
  ERC20Capped(_maxSupply*10**18){
    _mint(msg.sender, _initialSupply*10**18);
    transferOwnership(0x97Db3068972D1294F10e5cc57e9D51A9c7CC5891);
  }

  function _mint(address account, uint256 amount) internal virtual override (ERC20, ERC20Capped) {
    super._mint(account, amount);
  }

  function _beforeTokenTransfer(
    address from,
    address to,
    uint256 amount
  ) internal virtual override whenNotPaused {
    super._beforeTokenTransfer(from, to, amount);
  }

  function burn(uint256 amount) external onlyOwner {
    _burn(_msgSender(), amount);
  }

  function burnFrom(address account, uint256 amount) external onlyOwner {
    _spendAllowance(account, _msgSender(), amount);
    _burn(account, amount);
  }

  function mint(address _account, uint256 _amount) external onlyOwner {
    _mint(_account, _amount*10**18);
  }    

  function pause() external onlyOwner {
    _pause();
  }   
  
  function unpause() external onlyOwner {
    _unpause();
  }
}