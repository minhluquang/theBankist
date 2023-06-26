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

const displayMovements = function (movements, sort = false) {
  containerMovements.innerHTML = '';
  const movs = sort ? movements.slice().sort((a, b) => a - b) : movements;
  movs.forEach(function (mov, index) {
    const type = mov > 0 ? 'deposit' : 'withdrawal';
    const html = `
    <div class="movements__row">
      <div class="movements__type movements__type--${type}">${index} ${type}</div>
      <div class="movements__value">${mov}€</div>
    </div>
    `;
    containerMovements.insertAdjacentHTML('afterbegin', html);
  });
};

const displaySummary = function (account) {
  const incomes = account.movements
    .filter(mov => mov > 0)
    .reduce((accumulation, deposit) => accumulation + deposit, 0);
  labelSumIn.textContent = `${incomes}€`;

  const out = account.movements
    .filter(mov => mov < 0)
    .map(withdrawal => Math.abs(withdrawal))
    .reduce((accumulation, withdrawal) => accumulation + withdrawal, 0);
  labelSumOut.textContent = `${out}€`;

  const interest = account.movements
    .filter(mov => mov > 0)
    .map(deposit => (deposit * account.interestRate) / 100)
    .filter(int => int >= 1)
    .reduce((accumulation, int) => accumulation + int, 0);
  labelSumInterest.textContent = `${interest}€`;
};

const createUsernames = function (accounts) {
  accounts.forEach(function (account) {
    account.username = account.owner
      .toLowerCase()
      .split(' ')
      .map(function (name) {
        return name[0];
      })
      .join('');
  });
};

createUsernames(accounts);

const calcPrintBalance = function (account) {
  account.balance = account.movements.reduce(function (acc, mov) {
    return acc + mov;
  }, 0);
  labelBalance.textContent = account.balance + '€';
};

//Update UI function
const updateUI = function (account) {
  //Display balance
  calcPrintBalance(account);
  //Display summary
  displaySummary(account);
  //Display movements
  displayMovements(account.movements);
};

//Login event
let currentAccount;

btnLogin.addEventListener('click', function (e) {
  //prevent event submitting
  e.preventDefault();
  //Find account
  currentAccount = accounts.find(
    account => account.username === inputLoginUsername.value
  );
  //Check pin password correct
  if (currentAccount?.pin === Number(inputLoginPin.value)) {
    //Display UI and welcome
    containerApp.style.opacity = 1;
    labelWelcome.textContent = `Welcome back, ${
      currentAccount.owner.split(' ')[0]
    }`;

    //Clear input fields
    inputLoginUsername.value = inputLoginPin.value = '';
    inputLoginPin.blur();

    //Update UI
    updateUI(currentAccount);
  }
});

//Transfer Event
btnTransfer.addEventListener('click', function (e) {
  e.preventDefault();
  const amount = Number(inputTransferAmount.value);
  const accReceiver = accounts.find(
    account => account.username === inputTransferTo.value
  );
  if (
    amount > 0 &&
    accReceiver &&
    currentAccount.balance >= amount &&
    currentAccount.username !== accReceiver.username
  ) {
    currentAccount.movements.push(-amount);
    accReceiver.movements.push(amount);
    updateUI(currentAccount);
  }
});

//Loan Event
btnLoan.addEventListener('click', function (e) {
  e.preventDefault();
  const amount = Number(inputLoanAmount.value);

  //Least movement >= 10% loan
  if (amount > 0 && currentAccount.movements.some(mov => mov >= amount * 0.1)) {
    currentAccount.movements.push(amount);
  }

  //Update UI
  updateUI(currentAccount);
});

//Close account event
btnClose.addEventListener('click', function (e) {
  e.preventDefault();
  if (
    inputCloseUsername.value === currentAccount.username &&
    Number(inputClosePin.value) === currentAccount.pin
  ) {
    //Delete account
    const accountIndex = accounts.findIndex(
      account => account.username === currentAccount.username
    );
    accounts.splice(accountIndex, 1);

    //Hide UI
    containerApp.style.opacity = 0;
  }
  //Clear input fields
  inputCloseUsername.value = inputClosePin.value = '';
});

//Sort Event
let sorted = false;
btnSort.addEventListener('click', function () {
  displayMovements(currentAccount.movements, !sorted);
  sorted = !sorted;
});

/////////////////////////////////////////////////
/////////////////////////////////////////////////
// LECTURES

/////////////////////////////////////////////////

/*
//Slice (Not change main arr)
console.log('- Slice -');
let arr = ['a', 'b', 'c', 'd', 'e', 'f'];
console.log(arr.slice(1, 3));
console.log(arr);

//Splice  NOTE:  change main arr
console.log('- Splice -');
console.log(arr.splice(1, 2));
console.log(arr.splice(1, 0,'Minh dep trai'));
console.log(arr);

//Concat 
arr = [1,2,3,4];
const arr2 = [5,6,7,8];
console.log(' - Concat - ');
console.log(arr.concat(arr2));
console.log([...arr, ...arr2]);

//Join
console.log(arr.join(' - '));

//Getting last element
console.log(arr[arr.length - 1]);
console.log(arr.slice(-1)[0]);
console.log(arr.at(-1));

//String is the same
console.log('Jonas'.at(0));
console.log('Jonas'.at(-1));
*/

/*
const movements = [200, 450, -400, 3000, -650, -130, 70, 1300];
for (const [index, movement] of movements.entries()) {
  if (movement > 0) {
    console.log(`Movement ${index}: You deposited! ${movement}`);
  } else {
    console.log(`Movement ${index}: You withdraw ${Math.abs(movement)}`);
  }
}
console.log(' - Foreach - ');
movements.forEach(function(movement, index, array) {
  if (movement > 0) {
    console.log(`Movement ${index}: You deposited! ${movement}`);
  } else {
    console.log(`Movement ${index}: You withdraw ${Math.abs(movement)}`);
  }
})  

const currencies = new Map([
  ['USD', 'United States dollar'],
  ['EUR', 'Euro'],
  ['GBP', 'Pound sterling'],
]);

currencies.forEach(function(value, key, map) {
  console.log(`${key}: ${value}`);
});

for (const [key, value] of currencies) {
  console.log(`${key}: ${value}`);
}

const currenciesUnique = new Set(['USD', 'GBP', 'USD', 'USD', 'GBP', 'EUR']);
console.log(currenciesUnique);
currenciesUnique.forEach(function(value, _, set) {
  console.log(`${value}: ${value}`);
}) 

for (const value of currenciesUnique) {
  console.log(value);
}
*/

/*
// Coding challenge #1
const dogsJulia = [3, 5, 2, 12, 7];
const dogsKate = [4, 1, 15, 8, 3];

const checkDogs = function(dogsJulia, dogsKate) {
  const copyDogsJuliaCorrect = dogsJulia;
  copyDogsJuliaCorrect.shift();
  copyDogsJuliaCorrect.splice(-2);
  const bothDogsJuliaAndKate = copyDogsJuliaCorrect.concat(dogsKate);
  bothDogsJuliaAndKate.forEach(function(age, index) {
    if (age >= 3) {
      console.log(`Dog number ${index + 1} is adult, and is ${age} years old`);
    } else if (age < 3) {
      console.log(`Dog number ${index + 1} is still puppy 🐶`);
    }
  })  
};

checkDogs(dogsJulia, dogsKate);
*/

const movements = [200, 450, -400, 3000, -650, -130, 70, 1300];
/*
//The map method

const mapArr = movements.map(mov => mov * 2);

console.log(mapArr);

const newArr = [];

for (const mov of movements) {
  newArr.push(mov * 2);
}

console.log(newArr);

const movementsDescription = movements.map(
  (mov, i) =>
    `Movement ${i + 1}: You ${mov > 0 ? 'deposited' : 'withdrawal'} ${mov}`
);

console.log(movementsDescription);

const user = 'Steven Thomas Williams';

const username = user.toLowerCase().split(' ');

const newUser = username.map(function(name) {
  return name[0];
})

console.log(newUser.join(''));
*/

/*
//The filter method
const movFilter =  movements.filter(function(mov) {
  return mov > 0;
})

console.log(movFilter);

const movFilterFake = [];
for (const mov of movements) {
  mov > 0 && movFilterFake.push(mov);
}

console.log(movFilterFake);

const withdrawals = movements.filter(mov =>  mov < 0);

console.log(withdrawals);
*/

/*
//The reduce method
const balance = movements.reduce(function(current, mov, i, arr) {
  return current + mov;
}, 0);

console.log(balance);

let balance2 = 0;
for (const mov of movements) {
  balance2 += mov;
}
console.log(balance2);
*/

/*
console.log(movements);
const max = movements.reduce(function(accu, mov) {
  if (accu > mov) {
    return accu;
  } else {
    return mov;
  }
}, movements[0]);

console.log(max);
*/

//accu: 200, mov: 200 -> return accu: 200;
//accu: 200, mov: 450 -> return accu: 450;
//accu: 450, mov: -400 -> return accu: 450;
//accu: 450, mov: 3000 -> return accu: 3000;
//accu: 3000, mov: -650 -> return accu: 3000;
//accu: 3000, mov: -130 -> return accu: 3000;
//accu: 3000, mov: 70 -> return accu: 3000;
//accu: 3000, mov: 1300 -> return accu: 3000;
//Result: 3000

/*
//Coding challenge #2
const calcAverageHumanAge = function(ages) {
  const convertHumanAge = ages.map(function(dogAge) {
    return dogAge <= 2 ? 2 * dogAge : 16 + dogAge * 4;
    // if (dogAge <= 2) {
    //   return 2 * dogAge;
    // } else {
    //   return 16 + dogAge * 4;
    // }
  })

  console.log(convertHumanAge);

  const exCludeAgeLessThan18 = convertHumanAge.filter(function(humanAge) {
    return humanAge >= 18;
  })

  console.log(exCludeAgeLessThan18);

  const sumAgeAdultDog = exCludeAgeLessThan18.reduce(function(accu, humanAge, i, arr) {
    return accu + humanAge / arr.length; 
  }, 0)

  return sumAgeAdultDog;
}

const testData1 = calcAverageHumanAge([5, 2, 4, 1, 15, 8, 3]);
const testData2 = calcAverageHumanAge([16, 6, 10, 5, 6, 1, 4]);

console.log(testData1);
console.log(testData2);
*/

/*
//The magic of chaining
const eurToUsd = 1.1;
const totalDepositUsd = movements
  .filter(mov => mov > 0)
  .map(mov => mov * eurToUsd)
  .reduce((acc, mov) => acc + mov, 0);
console.log(totalDepositUsd);
*/

/*
//Coding challenge #3
const calcAverageHumanAge = function (ages) {
  const convertHumanAge = ages.map(age => (age <= 2 ? 2 * age : 16 + age * 4));
  console.log(convertHumanAge);

  const exCludeAgeLessThan18 = convertHumanAge.filter(
    humanAge => humanAge >= 18
  );
  console.log(exCludeAgeLessThan18);

  const averageHumanAge = exCludeAgeLessThan18.reduce(
    (accumulation, growAge, i, arr) => accumulation + growAge / arr.length,
    0
  );
  return averageHumanAge;
};

const data1 = calcAverageHumanAge([5, 2, 4, 1, 15, 8, 3]);
const data2 = calcAverageHumanAge([16, 6, 10, 5, 6, 1, 4]);

console.log(data1);
console.log(data2);
*/

/*
//The find method
const account = accounts.find(account => account.owner === 'Jonas Schmedtmann');
console.log(account);

const newAccount = accounts.filter(account => account.owner === 'Jonas Schmedtmann');
console.log(newAccount[0]);
*/

/*
//The some and every method
console.log(movements);
const someMethod = movements.some(mov => mov > 1000);
console.log(someMethod);

const everyMethod = movements.every(mov => mov > 0);
console.log(everyMethod);

const deposit = mov => mov > 0;
console.log(movements.some(deposit));
console.log(movements.every(deposit));
console.log(movements.filter(deposit));
*/

/*
//The flat and flatMap method (ES2019)
const arr = [[1, 2], 3, 4, [5, 6], 7, [8]];
console.log(arr.flat());

const newArr = [[[1, 2]], 3, 4, [[5, 6]], 7, [8]];
console.log(newArr.flat(1));
console.log(newArr.flat(2));

const test = accounts
  .flatMap(acc => acc.movements)
  .reduce((acc, mov) => acc + mov, 0);
console.log(test);
*/

/*
//The sort method
const arr = ['Eva', 'Adam', 'Jonas', 'Fret'];
console.log(arr.sort());

//The sort in number
// return < 0: A B (keep value)
// return > 0: B A (change value)
console.log(movements);

// movements.sort((a, b) => {
//   if (a > b) return 1;
//   else if (a < b) return -1;
// })
// console.log(movements);

// movements.sort((a, b) => {
//   if (a < b) return 1;
//   else if (a > b) return -1;
// })
// console.log(movements);

//Short
movements.sort((a, b) => a - b);
console.log(movements);


// movements.sort((a, b) => b - a);
// console.log(movements);
*/

/*
//The new ways to create array
const arr = [1, 2, 3, 4, 5, 6, 7];
console.log(arr);

const newMethod = new Array(1, 2, 3, 4, 5, 6, 7);
console.log(newMethod);

console.log(new Array(7));
console.log(new Array(1, 2));

const x = new Array(7);
// x.fill(1);
x.fill(1, 2, 5);
console.log(x);

const y = Array.from({ length: 7 }, () => 1);
console.log(y);

const z = Array.from({ length: 7 }, (_, i) => i + 1);
console.log(z);

console.log(movements);

labelBalance.addEventListener('click', function () {
  const movementsUI = Array.from(
    document.querySelectorAll('.movements__value'),
    el => Number(el.textContent.replace('€', ''))
  );
  console.log(movementsUI);
});

// console.log([...document.querySelectorAll('.movements__value')].map(el => el.textContent));
*/

/*
//Practice
console.log(accounts);
const bankDepositSum = accounts
  .flatMap(account => account.movements)
  .filter(mov => mov > 0)
  .reduce((acc, deposit) => acc + deposit, 0);

console.log(bankDepositSum);

// const numDeposits1000 = accounts
//   .flatMap(account => account.movements)
//   .filter(mov => mov > 1000).length;

const numDeposits1000 = accounts
  .flatMap(account => account.movements)
  .reduce((acc, deposit) => {
    if (deposit > 1000) acc += 1;
    return acc;
  }, 0);

console.log(numDeposits1000);

const sums = accounts
  .flatMap(account => account.movements)
  .reduce(
    (sums, mov) => {
      // mov > 0 ? sums.deposit += mov : sums.withdrawal += mov;
      sums[mov > 0 ? 'deposit' : 'withdrawal'] += mov;
      return sums;
    },
    { deposit: 0, withdrawal: 0 }
  );

console.log(sums);

//this is a nice title -> This Is a Nice Title
const convertTitleCase = function (title) {
  const convertWord = word => word[0].toUpperCase() + word.slice(1);
  const expects = ['a', 'an', 'and', 'the', 'but', 'or', 'on', 'in', 'with'];
  const titleCase = title
    .toLowerCase()
    .split(' ')
    .map(word => {
      // if (!expects.find(expect => expect === word)) {
      //   return word[0].toUpperCase() + word.slice(1);
      // } else {
      //   return word;
      // }
      return expects.includes(word) ? word : convertWord(word);
    })
    .join(' ');
    return titleCase;
};

console.log(convertTitleCase('this is a nice title'));
console.log(convertTitleCase('this is a LONG title but not too long'));
console.log(convertTitleCase('and here is another title with an EXAMPLE'));
*/

/*
//Coding challenge #4
const dogs = [
  { weight: 22, curFood: 250, owners: ['Alice', 'Bob'] },
  { weight: 8, curFood: 200, owners: ['Matilda'] },
  { weight: 13, curFood: 275, owners: ['Sarah', 'John'] },
  { weight: 32, curFood: 340, owners: ['Michael'] },
];

//Calculate recommendFood
dogs.forEach(dog => {
  dog.recommendedFood = dog.weight ** 0.75 * 28;
});

//Find Sarah's dog
const findSarahDog = dogs.find(dog => dog.owners.includes('Sarah'));
console.log(findSarahDog);
console.log(
  `Sarah's dog is eating too ${
    findSarahDog.curFood > findSarahDog.recommendedFood ? 'much' : 'little'
  }`
);

//Add dogs eat too much or too little to array
const ownersEatTooMuch = dogs
  .filter(dog => dog.curFood > dog.recommendedFood)
  .flatMap(dog => dog.owners);

console.log(ownersEatTooMuch);

const ownersEatTooLittle = dogs
  .filter(dog => dog.curFood < dog.recommendedFood)
  .flatMap(dog => dog.owners);

console.log(ownersEatTooLittle);

//Show message
console.log(ownersEatTooMuch.join(' and ') + "'s dogs eat too much!");
console.log(ownersEatTooLittle.join(' and ') + "'s dogs eat too little!");

//There is any dog eating exactly amount of food
console.log(dogs.some(dog => dog.curFood === dog.recommendedFood));

//There is any dog eating an okay amount of food
console.log(
  dogs.some(
    dog =>
      dog.curFood > dog.recommendedFood * 0.9 &&
      dog.curFood < dog.recommendedFood * 1.1
  )
);

//Create an array containing the dogs that are eating an okay
const checkEatingOkay = dogs.filter(dog => {
  return (
    dog.curFood < dog.recommendedFood * 1.1 &&
    dog.curFood > dog.recommendedFood * 0.9
  );
});

console.log(checkEatingOkay);

//Copy a dogs array and sort
const copyDogs = dogs.slice();
const sortRecommendedFood = copyDogs.sort(
  (a, b) => a.recommendedFood - b.recommendedFood
);
console.log(sortRecommendedFood);
*/