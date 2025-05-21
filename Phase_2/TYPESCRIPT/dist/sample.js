"use strict";
// alert("Hii Guys");
const users = [
    {
        name: "dk",
        age: 29,
    },
    {
        name: "rk",
        age: 29,
    },
    {
        name: "nk",
        age: 30,
    },
];
const filterByPeoples = (arr, property, value) => {
    return arr.filter((item) => item[property] === value);
};
const filterByPeopleName = filterByPeoples(users, "name", "dk");
const filterByPeopleAge = filterByPeoples(users, "age", 29);
console.log(filterByPeopleName);
console.log(filterByPeopleAge);
