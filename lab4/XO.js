'use strict';

let move = 0;
let countClick = 0;
let flagFinish = false;

//Функция newGame очищает игровое поле от предыдущих ходов
//сбрасывает счётчики и переменные состояния
//готовя игру к новому раунду
function newGame(event) {
    let p = document.querySelectorAll('.pole');
    for (let i = 0; i < 9; i++) {
        p[i].textContent = "";
    }
    move = 0;
    countClick = 0;
    flagFinish = false;
}

// Функция game создаёт игровое поле для крестиков ноликов
function game() {
    let board = document.getElementById('board');
    for (let i = 0; i < 9; i++) {
        let square = document.createElement('div');
        square.className = 'pole';
        board.append(square);
    }
}
let button = document.querySelector('.btn1');
button.addEventListener('click', newGame);
let mes = document.querySelector('.messages');

//Функция message вывод сообщений и удаление через время
function message (text, category = "success") {
    let div = document.createElement('div');
    div.classList.add("message");
    div.classList.add(category);
    div.innerText = text;
    mes.append(div);
    setTimeout(() =>{
        div.remove();
    }, 4000);
}

//Функция checkWinRow проверяет каждую строку на игровом поле
// и определяет, есть ли в них победитель
function checkWinRow() {
    let flagFoundWinner;
    let p = document.querySelectorAll('.pole');
    for (let i = 0; i < 3; i++) {
        if (p[i * 3].textContent == "") {
            continue;
        }

        flagFoundWinner = true;
        for (let j = 0; j < 2; j++) {
            p[i * 3 + j];
            if (p[i * 3 + j].textContent != p[i * 3 + j + 1].textContent) {
                flagFoundWinner = false;
                break;
            }
        }

        if (flagFoundWinner) {
            return p[i * 3].textContent;
        }
    }
}

//Функция checkWinColumn проверяет каждый столбец на игровом поле
//и определяет, есть ли в них победитель
function checkWinColumn() {
    let flagFoundWinner;
    let p = document.querySelectorAll('.pole');
    for (let i = 0; i < 3; i++) {
        if (p[i].textContent == "") {
            continue;
        }

        flagFoundWinner = true;
        for (let j = 0; j < 2; j++) {
            p[j * 3 + i];
            if (p[j * 3 + i].textContent != p[(j + 1) * 3 + i].textContent) {
                flagFoundWinner = false;
                break;
            }
        }

        if (flagFoundWinner) {
            return p[i].textContent;
        }
    }
}

// Функция checkWinMainDiagonal используется для проверки главной диагонгали
// и определения, есть ли в ней победитель.
function checkWinMainDiagonal() {
    let flagFoundWinner;
    let p = document.querySelectorAll('.pole');
    if (p[0].textContent == "") {
        return;
    }

    flagFoundWinner = true;
    for (let j = 0; j < 2; j++) {
        if (p[j * 3 + j].textContent != p[(j + 1) * 3 + j + 1].textContent) {
            flagFoundWinner = false;
            return;
        }
    }

    if (flagFoundWinner) {
        return p[0].textContent;
    }
}

//Функция checkWinAddDiagonal используется для проверки второстепенных диагоналей.
//и определения, есть ли в них победитель.
function checkWinAddDiagonal() {
    let flagFoundWinner;
    let p = document.querySelectorAll('.pole');

    if (p[3 - 1].textContent == "") {
        return;
    }

    flagFoundWinner = true;
    for (let j = 0; j < 2; j++) {
        if (p[j * 3 + 2 - j].textContent != 
            p[(j + 1) * 3 + 2 - (j + 1)].textContent) {
            flagFoundWinner = false;
            return;
        }
    }

    if (flagFoundWinner) {
        return p[2].textContent;
    }
}

//Функция click обеспечивает логику хода 
// и определение победителя или ничьи в игре.
window.onload = game;
function click(event) {
    let winner;
    let targ = event.target;
    if (flagFinish) {
        message('Игра завершена!', "error");
        return;
    }
    if (targ.innerHTML !== '') {
        message('Поле уже занято', "error");
        return;
    }
    targ.textContent = move == 0 ? 'X' : 'O';
    countClick += 1;
    move = (move + 1) % 2;  

    winner = checkWinRow() || checkWinColumn() ||
     checkWinMainDiagonal() || checkWinAddDiagonal();

    
    if (winner) {
        message("Победу одержал " + winner);
        flagFinish = true;
    } else if (countClick == 9) {
        message('Ничья');
        flagFinish = true;
    }
}


let board = document.getElementById('board');
board.addEventListener('click', click);