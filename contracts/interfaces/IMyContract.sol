// SPDX-License-Identifier: MIT

pragma solidity ^0.6.9;

interface IMyContract {
    /// @dev Deposit ERC20 tokens on behalf of msg.sender to Aave Protocol
    /// @param _erc20Contract The address fo the underlying asset to deposit to Aave Protocol v2
    /// @param _amount The amount of the underlying asset to deposit
    /// @return success Whether the deposit operation was successful or not
    function deposit(address _erc20Contract, uint256 _amount)
        external
        returns (bool success);

    /// @dev Withdraw ERC20 tokens on behalf of msg.sender from Aave Protocol
    /// @param _erc20Contract The address of the underlyng asset being withdrawn
    /// @param _amount The amount to be withdrawn
    /// @return amountWithdrawn The actual amount withdrawn from Aave
    function withdraw(address _erc20Contract, uint256 _amount)
        external
        returns (uint256 amountWithdrawn);

    /// @dev Read only function
    /// @return amountInEth Returns the value locked as collateral posted by msg.sender
    function checkCollateralValueInEth()
        external
        view
        returns (uint256 amountInEth);
}
