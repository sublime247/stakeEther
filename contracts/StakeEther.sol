// SPDX-License-Identifier: UNLICENSED
pragma solidity ^0.8.24;


contract StakeEther{
    address owner;
     enum Duration {
        ONEMONTH,
        TWOMONTH,
        THREEMONTH,
        ONEYEAR
     }


     struct User{
        address _userAddress;
        uint256 _startTime;
        uint256 balance;
        bool hasStaked;
        Duration duration;

     }

    mapping(address=> User) users;
    // staking profit rate
    uint256 public constant MONTHLY_RATE = 5;
    uint256 public constant YEARLY=60;
    constructor(){
      owner= msg.sender;
    }
  error NotOwner();
event Deposited(address indexed _address, Duration _duration, uint balance);
event WithDrawalSucessful(address indexed _address, uint256 totalReward);


function onlyOwner() view private {
    if(msg.sender != owner){
        revert NotOwner();
    }
}

function stakeEther(Duration _duration) external payable{
    require(_duration == Duration.ONEMONTH ||
            _duration == Duration.THREEMONTH ||
             _duration == Duration.TWOMONTH || 
             _duration == Duration.ONEYEAR, 
             "Enter a valid Duration");
   User storage user = users[msg.sender];
   require(user.hasStaked==false, "You can't stake twice");
   user._startTime= block.timestamp;
   user.hasStaked=true;
   user.balance = msg.value;
   user.duration = _duration;


   
   emit Deposited(msg.sender, _duration, user.balance);
 
  
}


function rewardMechanism(User memory _user) private view returns(uint256){
 uint256 stakingTime = block.timestamp - _user._startTime;
 uint reward;
 uint256 durationInseconds;
  if(_user.duration==Duration.ONEMONTH){
    reward = MONTHLY_RATE;
    durationInseconds = 30 * 1 days;

  }
  if(_user.duration==Duration.TWOMONTH){
    reward = MONTHLY_RATE*2;
    durationInseconds = 60 * 1 days ;
  }
  if(_user.duration==Duration.THREEMONTH){
    reward = MONTHLY_RATE*3;
    durationInseconds = 90 * 1 days ; 
  }
  if(_user.duration == Duration.ONEYEAR){
    reward = YEARLY;
    durationInseconds = 365 * 1 days ;
  }
  
uint256 stakingReward = (_user.balance * reward * stakingTime)/(durationInseconds*100); 
return stakingReward;
}


function withdrawStaking() external  {
User storage _user = users[msg.sender];
require(_user.hasStaked ==true, "You have no stake");
uint256 stakeEndtime;
if(_user.duration==Duration.ONEMONTH){
  stakeEndtime = _user._startTime+ 30 *1 days;

}
if(_user.duration==Duration.TWOMONTH){
  stakeEndtime = _user._startTime+ 90 *1 days;

}
if(_user.duration==Duration.THREEMONTH){
  stakeEndtime = _user._startTime+ 60 *1 days;

}
if(_user.duration==Duration.ONEYEAR){
  stakeEndtime = _user._startTime+ 365 *1 days;

}

uint reward = rewardMechanism(_user);
require(block.timestamp>=_user._startTime, "You can't withdraw your stake yet");
uint256 totalReward = _user.balance + reward;

_user.balance =0;
_user.hasStaked= false;


(bool success, ) = msg.sender.call{value: totalReward}("");
require(success, "Transaction Error");

emit WithDrawalSucessful(msg.sender, totalReward);

}




receive() external payable {

}

}