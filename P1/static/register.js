const fnameError = "Imię powinno składać się z małych i dużych liter";
const lnameError = "Nazwisko powinno składać się z małych i dużych liter";
const passError = "Hasło powinno składać sie z co najmniej 8 małych lub dużych liter";
const repPassError = "Hasła nie są identyczne";
const birthDateError = "Niepoprawna data urodzin";
const peselError = "Niepoprawny numer PESEL";
const sexError = "Wybrana płeć nie jest zgodna z numerem pesel";
const nameRegExp = /^[a-zA-Zą-żĄ-Ż]*$/;
const passRegExp = /^[A-z]{8,}$/;
const peselRegExp = /^[0-9]{11}$/;
const usernamePending = "Sprawdzanie...";
const usernameError = "Login jest niedostępny";

let fname = document.getElementById('fname');
let lname = document.getElementById('lname');
let password = document.getElementById('password');
let repPass = document.getElementById('confirm-password');
let birthDate = document.getElementById('birthdate');
let pesel = document.getElementById('pesel');
let sexs = document.getElementsByName('sex');
let submit = document.getElementById('submit');

function makeInvalid(element, text) {
    let error = document.createElement("span");
    error.innerHTML = text;
    error.className = "error";
    element.parentElement.appendChild(error);
    element.className = "invalid";
    submit.disabled = true
}

function makeValid(element, error) {
    element.parentNode.removeChild(error);
    element.className = "valid";
    canSubmit = document.getElementsByClassName("error").length == 0;
    submit.disabled = (!canSubmit)
}

function genCheck(element, message, condition) {
    let errors = element.parentElement.getElementsByClassName("error");
    if (condition && errors.length > 0) {
        makeValid(element, errors[0])
    }
    else if (!condition && errors.length == 0 ) {
        makeInvalid(element, message)
    }
}

function checkDate(date) {
    let givenDate = new Date(date);
    return (givenDate <= Date.now() && givenDate >= new Date("1900-01-01"));
}

function checkPesel(pesel) {
    if (!peselRegExp.test(pesel)) return false;
    const weights = [9, 7, 3, 1];
    let sum = 0;
    for(let i = 0; i < 10; i++) {
        sum += weights[i%4] * parseInt(pesel[i])
    }
    if ((sum % 10) != parseInt(pesel[10])) return false;
    if (birthDate.valueAsDate.getDate() != (parseInt(pesel[4]) * 10 + parseInt(pesel[5]))) return false;
    if (birthDate.valueAsDate.getFullYear() % 100 != (parseInt(pesel[0]) * 10 + parseInt(pesel[1]))) return false;
    if (birthDate.valueAsDate.getFullYear() < 2000) {
        return birthDate.valueAsDate.getMonth() + 1 == (parseInt(pesel[2]) * 10 + parseInt(pesel[3]))
    }
    else {
        return birthDate.valueAsDate.getMonth() + 1 == (parseInt(pesel[2]) * 10 + parseInt(pesel[3]) + 20)
    }
}

function checkGender(sexes) {
    let selectedGender;
    let controlNumber = parseInt(pesel.value[9]);
    for(let i = 0; i < sexes.length; i++) {
        if(sexes[i].checked) selectedGender = sexes[i].value;
    }
    if(selectedGender == 'M') return controlNumber % 2 == 1;
    else return controlNumber % 2 == 0;
}

fname.addEventListener("input", function () {
    genCheck(fname, fnameError, nameRegExp.test(fname.value))
    });
lname.addEventListener("input", function () {
    genCheck(lname, lnameError, nameRegExp.test(lname.value))
    });
password.addEventListener("input", function () {
    genCheck(password, passError, passRegExp.test(password.value))
    });
repPass.addEventListener("input", function() {
    genCheck(repPass, repPassError, (repPass.value.localeCompare(password.value) == 0))
    });
birthDate.addEventListener("input", function() {
    genCheck(birthDate, birthDateError, checkDate(birthDate.value))
    });
pesel.addEventListener("input", function () {
    genCheck(pesel, peselError, checkPesel(pesel.value))
    });
for(let i = 0; i < sexs.length; i++){
    sexs[i].addEventListener("input", function () {
        genCheck(sexs[i], sexError, checkGender(sexs))}
        );
    pesel.addEventListener("input", function () {
        genCheck(sexs[i], sexError, checkGender(sexs))}
        );
}
birthDate.addEventListener("input", function () {
    genCheck(pesel, peselError, checkPesel(pesel.value))});

submit.addEventListener("input", function ( event ) {
    canSubmit = document.getElementsByClassName("error").length == 0;
    if(!canSubmit) {
        event.preventDefault();
    }
});
submit.addEventListener( "input", function (event)  {
    let username = submit.value;
    let request = new XMLHttpRequest();
    request.open('POST', '/user/' + username);
    request.onload = function() {
        genCheck(username, "", true);
        genCheck(username, usernameError, request.status == 200)
    };
    request.send();
    genCheck(username, usernamePending, false)
});