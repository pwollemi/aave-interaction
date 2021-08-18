// SPDX-License-Identifier: MIT

pragma solidity ^0.6.9;

import "./interfaces/IMyContract.sol";
import "./interfaces/ILendingPool.sol";
import "@openzeppelin/contracts-upgradeable/access/OwnableUpgradeable.sol";
import "@openzeppelin/contracts-upgradeable/proxy/Initializable.sol";
import "@openzeppelin/contracts/token/ERC20/IERC20.sol";
import "@openzeppelin/contracts/token/ERC20/SafeERC20.sol";
import "@openzeppelin/contracts/math/SafeMath.sol";

contract MyContract is IMyContract, Initializable, OwnableUpgradeable {
    using SafeERC20 for IERC20;
    using SafeMath for uint256;

    /// @notice lending pool of aave
    address public lendingPool;

    event Deposit(uint256 amount);
    event Withdraw(uint256 amount);

    function initialize(address _lendingPool) external initializer {
        __Ownable_init();

        lendingPool = _lendingPool;
    }

    /// @dev Deposit ERC20 tokens on behalf of msg.sender to Aave Protocol
    /// @param _erc20Contract The address fo the underlying asset to deposit to Aave Protocol v2
    /// @param _amount The amount of the underlying asset to deposit
    /// @return success Whether the deposit operation was successful or not
    function deposit(address _erc20Contract, uint256 _amount)
        external
        override
        onlyOwner
        returns (bool success)
    {
        IERC20(_erc20Contract).safeTransferFrom(
            msg.sender,
            address(this),
            _amount
        );
        IERC20(_erc20Contract).safeApprove(lendingPool, _amount);

        ILendingPool(lendingPool).deposit(
            _erc20Contract,
            _amount,
            address(this),
            0
        );
        ILendingPool(lendingPool).setUserUseReserveAsCollateral(
            _erc20Contract,
            true
        );

        emit Deposit(_amount);

        return true;
    }

    /// @dev Withdraw ERC20 tokens on behalf of msg.sender from Aave Protocol
    /// @param _erc20Contract The address of the underlyng asset being withdrawn
    /// @param _amount The amount to be withdrawn
    /// @return amountWithdrawn The actual amount withdrawn from Aave
    function withdraw(address _erc20Contract, uint256 _amount)
        external
        override
        onlyOwner
        returns (uint256 amountWithdrawn)
    {
        ILendingPool(lendingPool).setUserUseReserveAsCollateral(
            _erc20Contract,
            false
        );
        ILendingPool(lendingPool).withdraw(
            _erc20Contract,
            _amount,
            address(this)
        );
        amountWithdrawn = IERC20(_erc20Contract).balanceOf(address(this));
        IERC20(_erc20Contract).safeTransfer(msg.sender, amountWithdrawn);

        emit Withdraw(amountWithdrawn);
    }

    /// @dev Read only function
    /// @return amountInEth Returns the value locked as collateral posted by msg.sender
    function checkCollateralValueInEth()
        public
        view
        override
        returns (uint256 amountInEth)
    {
        (amountInEth, , , , , ) = ILendingPool(lendingPool).getUserAccountData(
            address(this)
        );
        return amountInEth;
    }
}
