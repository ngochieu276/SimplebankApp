'use strict';

/////////////////////////////////////////////////
/////////////////////////////////////////////////
// BANKIST APP

// Data
const account1 = {
  owner: 'Jonas Schmedtmann',
  movements: [200, 450, -400, 3000, -650, -130, 70, 1300],
  interestRate: 1.2, // %
  pin: 1111,
};

const account2 = {
  owner: 'Jessica Davis',
  movements: [5000, 3400, -150, -790, -3210, -1000, 8500, -30],
  interestRate: 1.5,
  pin: 2222,
};

const account3 = {
  owner: 'Steven Thomas Williams',
  movements: [200, -200, 340, -300, -20, 50, 400, -460],
  interestRate: 0.7,
  pin: 3333,
};

const account4 = {
  owner: 'Sarah Smith',
  movements: [430, 1000, 700, 50, 90],
  interestRate: 1,
  pin: 4444,
};

const accounts = [account1, account2, account3, account4];

// Elements
const labelWelcome = document.querySelector('.welcome');
const labelDate = document.querySelector('.date');
const labelBalance = document.querySelector('.balance__value');
const labelSumIn = document.querySelector('.summary__value--in');
const labelSumOut = document.querySelector('.summary__value--out');
const labelSumInterest = document.querySelector('.summary__value--interest');
const labelTimer = document.querySelector('.timer');

const containerApp = document.querySelector('.app');
const containerMovements = document.querySelector('.movements');

const btnLogin = document.querySelector('.login__btn');
const btnTransfer = document.querySelector('.form__btn--transfer');
const btnLoan = document.querySelector('.form__btn--loan');
const btnClose = document.querySelector('.form__btn--close');
const btnSort = document.querySelector('.btn--sort');

const inputLoginUsername = document.querySelector('.login__input--user');
const inputLoginPin = document.querySelector('.login__input--pin');
const inputTransferTo = document.querySelector('.form__input--to');
const inputTransferAmount = document.querySelector('.form__input--amount');
const inputLoanAmount = document.querySelector('.form__input--loan-amount');
const inputCloseUsername = document.querySelector('.form__input--user');
const inputClosePin = document.querySelector('.form__input--pin');

/////////////////////////////////////////////////
/////////////////////////////////////////////////
// LECTURES

const currencies = new Map([
  ['USD', 'United States dollar'],
  ['EUR', 'Euro'],
  ['GBP', 'Pound sterling'],
]);

const movements = [200, 450, -400, 3000, -650, -130, 70, 1300];

/////////////////////////////////////////////////;


const displayMovements = function(movements,sorted = false) {
  containerMovements.innerHTML = '';

  const movs = sorted ? movements.slice().sort((a,b) => a-b) :movements

  movs.forEach(function(mov,i) {
    const type = mov > 0 ? 'deposit' : 'withdrawal';
    const html = `
    <div class="movements__row">
          <div class="movements__type movements__type--${type}">${i+1} ${type}</div>
          <div class="movements__date">3 days ago</div>
          <div class="movements__value">${mov}€</div>
        </div>
    `
    containerMovements.insertAdjacentHTML('afterbegin', html)
  })
}

const displayUI = function(account) {
//display movements
    displayMovements(account.movements)
    //calc balance
    calcBalance(account)
    //calc summary
    calcSummary(account)
}

const userName = account1.owner.toLowerCase().split(' ').map(name => name[0]).join('');
const createUserName = function(accounts) {
  accounts.forEach((acc) => {
    acc.userName = acc.owner.toLowerCase().split(' ').map(name => name[0]).join('');
  })
  return accounts
}
console.log(createUserName(accounts));

const calcBalance = function(acc) {
  acc.balance = acc.movements.reduce((acc,cur) => {
    return acc + cur
  });
  labelBalance.textContent = `${acc.balance} EUR`;
}

const calcSummary = function(acc) {
  const surplus = acc.movements.filter(mov => mov > 0).reduce((acc,cur) => acc+cur,0);
  labelSumIn.textContent = surplus;
  
  const withdraw = acc.movements.filter(mov => mov < 0).reduce((acc,cur) => acc+cur, 0);
  labelSumOut.textContent = Math.abs(withdraw);
  
  
  const interest = acc.movements.filter(mov => mov > 0).map(mov => mov * acc.interestRate/100).
  reduce((acc,cur) => acc+cur,0);
  labelSumInterest.textContent = interest;
}

let currentUser;
btnLogin.addEventListener('click',function(e) {
  e.preventDefault();

  currentUser = accounts.find(acc => 
    acc.userName === inputLoginUsername.value);
  if (currentUser?.pin === Number(inputLoginPin.value)) {
    labelWelcome.textContent = `Welcomeback ${currentUser.owner.split(" ")[0]}`;
    containerApp.style.opacity = 100;
    //show login default
    inputCloseUsername.value = inputLoginPin.value = '';
    inputLoginPin.blur();
    displayUI(currentUser);
  }
})
// chuyển tiền cho tài khoản kháckhác
btnTransfer.addEventListener("click",function(e) {
  e.preventDefault();

  const amount = Number(inputTransferAmount.value);
  const receiveAcc = accounts.find(user => user.userName === inputTransferTo.value);
  //đặt mặc định cho input transferfer
  inputClosePin.value = inputTransferTo.value = '';
  
  

  if(amount < 0) {
    labelWelcome.textContent = `You must type positive number`
  }  else if (!receiveAcc) {
  labelWelcome.textContent = `Wrong receiver`
  } else if (amount >= currentUser.balance) {
    labelWelcome.textContent = `Over balance`
  } else if (receiveAcc?.userName === currentUser.userName) {
    labelWelcome.textContent = `Cannot transfer to yourself`
  } else if (amount > 0 &&
    receiveAcc &&
    amount <= currentUser.balance &&
    receiveAcc?.userName !== currentUser.userName)
    {
    //update cho movement arrayarray
    currentUser.movements.push(-amount);
    receiveAcc.movements.push(amount);
    displayUI(currentUser)
  }

})

// xóa tài khoản khỏi danh sáchsách

btnClose.addEventListener("click", function(e) {
 e.preventDefault();

 if (inputCloseUsername.value === currentUser.userName && Number(inputClosePin.value) === currentUser.pin) {

  const index = accounts.findIndex(user => user.userName === currentUser.userName);

  accounts.splice(index, 1);
  // hide UI
  containerApp.style.opacity = 0;
  
  inputCloseUsername.value = inputClosePin.value = ''
 }
})

// vay tiền

btnLoan.addEventListener("click", function(e) {
  e.preventDefault();

  const amount = Number(inputLoanAmount.value);

  if(amount > 0 && 
    currentUser.movements.some(mov => amount >= mov*0.1)) {
   currentUser.movements.push(amount);
   displayUI(currentUser);
   inputLoanAmount.value = '';
  }
})

//sort button
const sorted = false;
btnSort.addEventListener("click",function(e) {
  e.preventDefault();
  
  displayMovements(currentUser.movements, !sorted);
  sorted = !sorted;
})