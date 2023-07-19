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

//Display movement method
const displayMovements = function (movements) {
  containerMovements.innerHTML = ""; //clear the older movements
  movements.forEach(function (mov, i) {

    const type = mov >0 ? `deposit` : `withdrawal`

    const html = `
        <div class="movements__row">
          <div class="movements__type movements__type--${type}">${i+1} ${type}</div>
          <div class="movements__value">${mov} EUR</div>
        </div>
        `;

    containerMovements.insertAdjacentHTML('afterbegin', html);
  });
};
//displayMovements(account1.movements)

const calcDisplayBalance = function (acc) {
  acc.balance = acc.movements.reduce((acc,mov)=>acc+mov, 0);//add the balance to the account object
  
  labelBalance.textContent = `${acc.balance} EUR`;
};
//calcDisplayBalance(account1.movements); //call the show balance method

const calcDisplaySummery = function (acc) {
  const income = acc.movements.filter(mov => mov>0).reduce((acc,mov ) => acc+mov, 0); //calculate the income
  labelSumIn.textContent = `${income} EUR`;

  const outcome = acc.movements.filter(mov => mov<0).reduce((acc,mov) => acc+mov, 0); //calculate the out going
  labelSumOut.textContent = `${Math.abs(outcome)} EUR`

  const interest = acc.movements.filter(mov => mov>0).map(deposit => (deposit * acc.interestRate)/100).filter((int,i,arr) => 
  {return int >=1;}).reduce((acc,int) => acc+int,0); //calculate the interest and remove all interest less than 1 EUR
  labelSumInterest.textContent = `${interest} EUR`;
};
//calcDisplaySummery(account1.movements); //call the show summery method

const createUsernames = function (accs) {
  accs.forEach(function (acc) {
    acc.username = acc.owner.toLowerCase().split(' ').map(name => name[0]).join('');
  });
};

createUsernames(accounts);
  
const updateUI = function (acc) { //Update the UI accoding to account u logged in 
  //Display movements
  displayMovements(acc.movements);

  //Display balance
  calcDisplayBalance(acc);

  //Display summery
  calcDisplaySummery(acc);
}


//Event handeler
let currentAccount; //to store the current account we logged in

btnLogin.addEventListener('click', function (e) {//add event to the login button
  e.preventDefault();//prevent form from submitting

  currentAccount = accounts.find(acc => acc.username === inputLoginUsername.value); 
  //find the account that match the username in the input field and store it in currentAccount
   
   console.log(currentAccount);

   if (currentAccount?.pin === Number(inputLoginPin.value)){//check if the pin is correct if account availbe
    //console.log(`login`);
    //Display UI and welcome message
    labelWelcome.textContent = `Welcome back, ${currentAccount.owner.split(' ')[0]}`; //show welcome message
    containerApp.style.opacity = 100; //show the UI

    //Clear input fields
    inputLoginUsername.value = inputLoginPin.value = ''; 
    inputLoginPin.blur(); //remove focus from the input field

    updateUI(currentAccount); //update the UI

   }
  
});

//Money Tranfer Method
btnTransfer.addEventListener('click',function (e) {
  e.preventDefault();
  const amount = Number (inputTransferAmount.value);
  const receiverAcc = accounts.find(acc => acc.username === inputTransferTo.value);
  //const senderAcc = currentAccount;
  
  inputTransferAmount.value = inputTransferTo.value = ''; //clear the input field
  
  if (amount > 0 && receiverAcc && currentAccount.balance >= amount && receiverAcc?.username !== currentAccount.username){

    //Doing the transfer
    currentAccount.movements.push(-amount);
    receiverAcc.movements.push(amount);

    //Update UI 
    updateUI(currentAccount);
  } 

});



/////////////////////////////////////////////////
/////////////////////////////////////////////////
// LECTURES
/*
const currencies = new Map([
  ['USD', 'United States dollar'],
  ['EUR', 'Euro'],
  ['GBP', 'Pound sterling'],
]);

const movements = [200, 450, -400, 3000, -650, -130, 70, 1300];

const firstwithdrawals = movements.find(mov => mov<0);
console.log(movements);
console.log(firstwithdrawals);

const account = accounts.find(acc => acc.owner === 'Jessica Davis');
console.log(account);

const max = movements.reduce((acc,mov) => {
  if (acc>mov) {
    return acc;}
    else {return mov;}
  }, movements[0]);

  console.log(max);
  */





/////////////////////////////////////////////////

