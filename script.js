//'use strict';


// ===Global scope===

let cellArray = [];
let empty = {};
let countElem = 4;
const cellSize = 80;
let winButton;
let moveCounter = 0;
let numberOfcells = countElem * countElem - 1;
let timeMoves;
let min = 0;
let sec = 0;
let timeDiv;
let movesDiv;
let gameField;


// ===Functions===

function newGame() {
   min = 0;
   sec = 0;
   moveCounter = 0;
   document.body.innerHTML = '<h1 class="title">Собери пазл!</h1>';

   timeMoves = document.createElement('div');
   timeMoves.className = 'timeMoves';
   document.body.append(timeMoves);

   timeDiv = document.createElement('div');
   timeDiv.className = 'timeDiv';
   timeDiv.innerHTML = `Время<span>:</span>${addZero(min)}<span>:</span>${addZero(sec)}`;
   timeMoves.append(timeDiv);

   countElemDiv = document.createElement('select');
   countElemDiv.className = 'countElemDiv';
   countElemDiv.id = 'countElemDiv';

   countElemDiv.innerHTML = `<option ${countElem == 3 ? 'selected=true' : ''}>3</option>
                             <option ${countElem == 4 ? 'selected=true' : ''}>4</option>
                             <option ${countElem == 5 ? 'selected=true' : ''}>5</option>
                             <option ${countElem == 6 ? 'selected=true' : ''}>6</option>
                            `;

   timeMoves.append(countElemDiv);

   movesDiv = document.createElement('div');
   movesDiv.className = 'movesDiv';
   movesDiv.innerHTML = `Ходов<span>:</span>${moveCounter}`;
   timeMoves.append(movesDiv);

   gameField = document.createElement('div');
   gameField.className = 'gameField';
   gameField.id = 'gameField';
   gameField.style.width = `${countElem * cellSize}px`;
   gameField.style.height = `${countElem * cellSize}px`;
   document.body.append(gameField);

   winButton = document.createElement('button');
   winButton.className = 'winButton';
   winButton.id = 'newGameButton';
   winButton.innerHTML = 'Новая Игра';
   document.body.append(winButton);

   winButton.addEventListener('click', () => {
      countElem = document.getElementById('countElemDiv').options[document.getElementById('countElemDiv').options.selectedIndex].text;
      numberOfcells = countElem * countElem - 1;
      newGame();
   });

   empty = {
      value: 0,
      top: 0,
      left: 0
   };

   cellArray = [];
   cellArray.push(empty);

   const numbers = randomField(numberOfcells);

   for (let i = 1; i <= numberOfcells; i += 1) {
      const cell = document.createElement('div');
      const value = numbers[i - 1] + 1;
      cell.className = 'cell';
      cell.innerHTML = value;      

      const left = i % countElem;
      const top = (i - left) / countElem;

      cellArray.push({
         value: value,
         left: left,
         top: top,
         element: cell
      });
   };   

   // замена при необходимости элементов
   if (testToWin(numberOfcells)) {
      let tempValue = cellArray[1].value;
      cellArray[1].value = cellArray[2].value;
      cellArray[2].value = tempValue;
   };

   //console.log('дополнительная проверка');
   testToWin(numberOfcells);
   
   // отрисовка пазлов и обработка кликов по ним
   for (let i = 1; i <= numberOfcells; i += 1) {
      cell = cellArray[i].element; 
      cell.innerHTML = cellArray[i].value;
      cell.style.left = `${cellArray[i].left * cellSize}px`;
      cell.style.top = `${cellArray[i].top * cellSize}px`;
      cell.style.backgroundImage="url('img/" + countElem + '/' + cellArray[i].value + ".jpg')";   // Images as background
      gameField.append(cell);
      cell.addEventListener('click', () => {
         cellMove(i);
      });
   };
 
};

function randomField(n) {
   let randArray = [...Array(n).keys()]
     .sort(() => Math.random() - 0.5);
   return randArray;
};

function cellMove(index) {
   const cell = cellArray[index];

   const leftDiff = Math.abs(empty.left - cell.left);
   const topDiff = Math.abs(empty.top - cell.top);

   if (leftDiff + topDiff > 1) {
      return;
   } else {
      moveCounter += 1;
//    soundClick('./assets/cellMove.mp3');
      movesDiv.innerHTML = `Ходов<span>:</span>${moveCounter}`;
   };

   cell.element.style.left = `${empty.left * cellSize}px`;
   cell.element.style.top = `${empty.top * cellSize}px`;

   const emptyLeft = empty.left;
   const emptyTop = empty.top;

   empty.left = cell.left;
   empty.top = cell.top;

   cell.left = emptyLeft;
   cell.top = emptyTop;

   const isFinished = cellArray.every(cell => {
      return cell.value === cell.top * countElem + cell.left;
   });

   if (isFinished) { 
      finish();
   };
};

function soundClick(s) {
   let audio = new Audio();
   audio.src = s;
   audio.autoplay = true;
};

function addZero(n) {
   return (parseInt(n, 10) < 10 ? '0' : '') + n;
};

function showTime() {
   timeDiv.innerHTML = `Время<span>:</span>${addZero(min)}<span>:</span>${addZero(sec)}`;
   sec += 1;
   if (sec === 60) {
      sec = 0;
      min += 1;
   };
   setTimeout(showTime, 1000);
};

function finish() {    
   const cellEmpty = document.createElement('div');
   cellEmpty.className = 'cell';
   cellEmpty.innerHTML = empty.value;    
   cellEmpty.style.backgroundImage="url('img/" + countElem + '/' + empty.value + ".jpg')";  // Images as background
   cellEmpty.style.left = `${empty.left}px`;
   cellEmpty.style.top = `${empty.left}px`;
   gameField.append(cellEmpty);
    
   let ele = document.getElementsByClassName('cell');
   for (let i = 0; i <= numberOfcells; i += 1) {
      ele[i].className += ' '+'cell__finish';
   };
   document.body.innerHTML += `<h2 class="title">«Ура! Вы решили головоломку за ${addZero(min)}<span>:</span>${addZero(sec)} и ${moveCounter} ходов»</h2>`;
   newGameButton.addEventListener("click", () => {
      countElem = document.getElementById('countElemDiv').options[document.getElementById('countElemDiv').options.selectedIndex].text;
      numberOfcells = countElem * countElem - 1;
      newGame();
   });
};

// проверка на решаемость
function testToWin(numberOfcells) { 
   let testToWinFlag = 1;
   for (let i = 1; i < numberOfcells; i++) {
      for (let j = i + 1; j <= numberOfcells ; j++) {                 
         if (cellArray[i].value > cellArray[j].value) { 
            testToWinFlag += 1;
         };
         //console.log(`${cellArray[i].value} > ${cellArray[j].value} testToWinFlag = ${testToWinFlag}`);
      };
   };
   //console.log(!(testToWinFlag % 2));
   return !(testToWinFlag % 2);
};

// ===Run===
newGame();
showTime();

//finish();

newGameButton.addEventListener("click", () => {
   countElem = document.getElementById('countElemDiv').options[document.getElementById('countElemDiv').options.selectedIndex].text;
   numberOfcells = countElem * countElem - 1;
   newGame();
});




