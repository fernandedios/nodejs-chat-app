const moment = require('moment');

// Jan 1st 1970 00:00:00 am

// var date = new Date();
// console.log(date.getMonth());

let createdAt = 1234;
let someTimestamp = moment().valueOf();
let date = moment(createdAt);
// date.add(1, 'year').subtract(9, 'months');
// console.log(date.format('MMM Do, YYYY'));

console.log(date.format('h:mm a'));
