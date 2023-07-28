'use strict';

/////////////////////////////////////////////////
/////////////////////////////////////////////////
// BANKIST APP

// Data
/*
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
*/


// DIFFERENT DATA! Contains movement dates, currency and locale

const account1 = {
  owner: 'Jonas Schmedtmann',
  movements: [200, 455.23, -306.5, 25000, -642.21, -133.9, 79.97, 1300],
  interestRate: 1.2, // %
  pin: 1111,

  movementsDates: [
    '2019-11-18T21:31:17.178Z',
    '2019-12-23T07:42:02.383Z',
    '2020-01-28T09:15:04.904Z',
    '2020-04-01T10:17:24.185Z',
    '2023-07-24T14:11:59.604Z',
    '2023-07-23T17:01:17.194Z',
    '2023-07-22T23:36:17.929Z',
    '2023-07-21T10:51:36.790Z',
  ],
  currency: 'EUR',
  locale: 'pt-PT', // de-DE
};

const account2 = {
  owner: 'Jessica Davis',
  movements: [5000, 3400, -150, -790, -3210, -1000, 8500, -30],
  interestRate: 1.5,
  pin: 2222,

  movementsDates: [
    '2019-11-01T13:15:33.035Z',
    '2019-11-30T09:48:16.867Z',
    '2019-12-25T06:04:23.907Z',
    '2020-01-25T14:18:46.235Z',
    '2020-02-05T16:33:06.386Z',
    '2020-04-10T14:43:26.374Z',
    '2020-06-25T18:49:59.371Z',
    '2020-07-26T12:01:20.894Z',
  ],
  currency: 'USD',
  locale: 'en-US',
};

const accounts = [account1, account2];

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

/////////////////////////////////////////////////////////////////////////////////////
//Funtions

//create a one format for all the dates
const formatMovementDate = function (date, locale) {
    const calcDaysPassed = (date1, date2) => Math.round(Math.abs(date2 - date1) / (1000*60*60*24)); //calculate the days passed between two dates
    
    const daysPassed = calcDaysPassed(new Date(), date); //get the days passed from the date to today
    //console.log(daysPassed);

    if (daysPassed === 0) return `Today`; //if days passed is 0 return today
    if (daysPassed === 1) return `Yesterday`; //if days passed is 1 return yesterday
    if (daysPassed <= 7) return `${daysPassed} days ago`; //if days passed is less than 7 return days ago
    return new Intl.DateTimeFormat(locale).format(date); //return the date in the locale format
};

//formatting currency
const formatCur = function (value, locale, currency) {
  return new Intl.NumberFormat(locale, { //format the movement in locale format
    style: 'currency',
    currency: currency,
  }).format(value);//call format method
}

//Display movement method
//if sort buttton press sort the movements
const displayMovements = function (acc, sort = false) {
  containerMovements.innerHTML = ""; //clear the older movements

  const movs = sort ? acc.movements.slice().sort((a,b) => a-b) : acc.movements; //sort the movements if sort is true
  
  movs.forEach(function (mov, i) {

    const type = mov >0 ? `deposit` : `withdrawal` //check the type of the movement

    const date = new Date(acc.movementsDates[i]); //get the date from the movementsDates array
    const displayDate = formatMovementDate(date, acc.locale); //display the date in dd/mm/yyyy format

    const formattedMov = formatCur(mov, acc.locale, acc.currency); //format the currency in locale format
    

    const html = `
        <div class="movements__row">
          <div class="movements__type movements__type--${type}">${i+1} ${type}</div>
          <div class="movements__date">${displayDate}</div>
          <div class="movements__value">${formattedMov} EUR</div>
        </div> 
        `;

    containerMovements.insertAdjacentHTML('afterbegin', html);
  });
};



const calcDisplayBalance = function (acc) {
  acc.balance = acc.movements.reduce((acc,mov)=>acc+mov, 0);//add the balance to the account object
  
  labelBalance.textContent = formatCur(acc.balance, acc.locale, acc.currency);
};
//calcDisplayBalance(account1.movements); //call the show balance method

const calcDisplaySummery = function (acc) {
  const income = acc.movements.filter(mov => mov>0).reduce((acc,mov ) => acc+mov, 0); //calculate the income
  labelSumIn.textContent = formatCur(income, acc.locale, acc.currency);

  const outcome = acc.movements.filter(mov => mov<0).reduce((acc,mov) => acc+mov, 0); //calculate the out going
  labelSumOut.textContent = formatCur(Math.abs(outcome), acc.locale, acc.currency);
 

  const interest = acc.movements.filter(mov => mov>0).map(deposit => (deposit * acc.interestRate)/100).filter((int,i,arr) => 
  {return int >=1;}).reduce((acc,int) => acc+int,0); //calculate the interest and remove all interest less than 1 EUR
  labelSumInterest.textContent = formatCur(interest, acc.locale, acc.currency);
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
  displayMovements(acc);

  //Display balance
  calcDisplayBalance(acc);

  //Display summery
  calcDisplaySummery(acc);
};

const startLogOutTimer = function () {//Calculate and display time, loging time out function
  
  const tick = function () {
  //in each call, print the remaining time to UI
  labelTimer.textContent = `${String(Math.trunc(time/60)).padStart(2,0)}:${String(time%60).padStart(2,0)}`;

  //when 0 second, stop timer and log out user
  if (time === 0) {
    clearInterval(timer);
    labelWelcome.textContent = `Log in to get started`;
    containerApp.style.opacity = 0; //Hide the UI
  }
    //decrease 1 second
    time--;
};
//set time out to log out after 5 min
let time = 300;

//call the timer every second
tick();
const timer = setInterval(tick, 1000);
return timer;
};



//Event handeler------------------------------------------------------------------
let currentAccount, timer; //to store the current account we logged in

/*
//Fake logging -------------------------------------

currentAccount = account1;
updateUI(currentAccount);
containerApp.style.opacity = 100; //show the UI

//fake login end  ---------------------------------
*/


btnLogin.addEventListener('click', function (e) {//add event to the login button
  e.preventDefault();//prevent form from submitting

  currentAccount = accounts.find(acc => acc.username === inputLoginUsername.value); 
  //find the account that match the username in the input field and store it in currentAccount
   
   //console.log(currentAccount);

   if (currentAccount?.pin === Number(inputLoginPin.value)){//check if the pin is correct if account availbe
    //console.log(`login`);
    //Display UI and welcome message
    labelWelcome.textContent = `Welcome back, ${currentAccount.owner.split(' ')[0]}`; //show welcome message
    containerApp.style.opacity = 100; //show the UI

    //Show current account Loged Time
    const now = new Date();
    const options = {
      hour: 'numeric',
      minute: 'numeric',
      day: 'numeric',
      month: 'numeric',
      year: 'numeric',
      //weekday: 'long',
    };
    labelDate.textContent = new Intl.DateTimeFormat(currentAccount.locale, options).format(now);
    
    //Clear input fields
    inputLoginUsername.value = inputLoginPin.value = ''; 
    inputLoginPin.blur(); //remove focus from the input field

    if (timer) clearInterval(timer); //clear the timer if there is a timer
    timer = startLogOutTimer(); //call the log out timer function

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

    //add transfer date
    currentAccount.movementsDates.push(new Date().toISOString());
    receiverAcc.movementsDates.push(new Date().toISOString()); 

    //Update UI 
    updateUI(currentAccount);

    inputLoanAmount.value = ''; //clear the input field

    //Reset the timer
    clearInterval(timer); //clear the timer if there is a timer
    timer = startLogOutTimer(); //call the log out timer function
  } 

});

//Request loan method
btnLoan.addEventListener('click',function (e) {
  e.preventDefault();
  const amount = Math.floor(inputLoanAmount.value);//get the loan amount
  if (amount>0 && currentAccount.movements.some(mov => mov >= amount*0.1)) {//chek if the loan is greater than 10% of any deposit
    setTimeout(function () { //add a time out function to add the loan after 2.5 sec
    //Add movement
    currentAccount.movements.push(amount);

    //add loan date
    currentAccount.movementsDates.push(new Date().toISOString());

    //Update UI
    updateUI(currentAccount);
  }, 2500);
  }
  inputLoanAmount.value = ''; //clear the input field

  //Reset the timer
  clearInterval(timer); //clear the timer if there is a timer
  timer = startLogOutTimer(); //call the log out timer function
  
});


//remove user method
btnClose.addEventListener('click',function (e) {
  e.preventDefault();

  if  (inputCloseUsername.value === currentAccount.username && Number(inputClosePin.value) === currentAccount.pin){

    const index = accounts.findIndex(acc => acc.username === currentAccount.username);//get correct account index
    
    //Delete account
    accounts.splice(index,1);

    //Hide UI even pin is worng UI will be hidden
    containerApp.style.opacity = 0; //Hide the UI
      
    }
    inputCloseUsername.value = inputClosePin.value = '';//clear the input field

  });

let sorted = false;
btnSort.addEventListener('click',function (e) {
  e.preventDefault();
  displayMovements(currentAccount.movements, !sorted);
  sorted = !sorted;
});



////////////////////////////////////////////////////////////////////
////////////////////////////////////////////////////////////////////
/*
const num = 3884764.23;

console.log(`US: `,new Intl.NumberFormat('en-US').format(num));
console.log(`Germany: `,new Intl.NumberFormat('de-DE').format(num));
console.log(`Syria: `,new Intl.NumberFormat('ar-SY').format(num));
console.log(navigator.language, new Intl.NumberFormat(navigator.language).format(num));

setTimeout(() => console.log(`Here is your money 💵`), 3000);
console.log('waiting...');

const ingredients = ['olives', 'spinach'];
const pizzaTimer = setTimeout(
  (ing1,ing2) => console.log(`Here is your pizza 🍕 with ${ing1} and ${ing2}`), 
  3000, ...ingredients);

  if (ingredients.includes('spinach')) clearTimeout(pizzaTimer);

  //setInterval
  setInterval(function () {
    const now = new Date();
    console.log(now);
  }, 3000);
*/