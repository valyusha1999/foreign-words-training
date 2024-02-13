"use strict"

const card = document.querySelector(".flip-card");
const cardFront = document.querySelector("#card-front");
const cardBack = document.querySelector("#card-back");

const nextBtn = document.querySelector("#next")
const backBtn = document.querySelector("#back")

const shuffleWords = document.querySelector('#shuffle-words');

const backExm = document.querySelector("#exam")

const words = [
  {
    word: "cat",
    russianWord: "кот",
    example: "A cat ran across the street."
  },
  {
    word: "dog",
    russianWord: "собака",
    example: "They named their dog Cookie."
  },
  {
    word: "draw",
    russianWord: "рисовать",
    example: "Very few children draw as well as Tom can."
  },
  {
    word: "color",
    russianWord: "цвет",
    example: "Our shirts are all the same color but are all different sizes."
  },
  {
    word: "bird",
    russianWord: "птица",
    example: "I can see a strange blue bird on the roof."
  },
];

card.addEventListener("click", function (event) {
  this.classList.toggle("active")
})


const currentWords = [...words];

function makeCard({ word, russianWord, example }) {
  cardFront.querySelector("h1").textContent = word;
  cardBack.querySelector("h1").textContent = russianWord;
  cardBack.querySelector("p span").textContent = example;
};

function renderCard(arr) {
  arr.forEach((item) => {
    makeCard(item);
  })
};

renderCard(currentWords);

function getRandomCard(arr) {
  return arr[Math.floor(Math.random() * arr.length)];
}

shuffleWords.addEventListener('click', () => {
  makeCard(getRandomCard(currentWords));
});

let progress = 0;

function showProgress() {
  document.querySelector('#words-progress').value = progress * 25;
  document.querySelector('#current-word').textContent = progress + 1;
  makeCard(currentWords[progress]);
}

nextBtn.addEventListener("click", function () {
  progress = ++progress;
  backBtn.disabled = false;
  if (progress == 4) {
    nextBtn.disabled = true;
  }
  showProgress();
})

backBtn.addEventListener("click", function () {
  progress = --progress;
  if (progress == 0) {
    backBtn.disabled = true;
  }
  if (progress < 5) {
    nextBtn.disabled = false;
  }
  showProgress();
})

const time = document.querySelector("#time");
let timer;
let sec = 0;
let min = 0;
const divExam = document.querySelector('#exam-cards');


let first = null;
let second = null;


function makeExamCard(key) {
  const newCard = document.createElement('div');
  newCard.textContent = key;
  newCard.classList.add('card');
  return newCard;
};


const examWords = [];

function doExamDiv(arr) {
  arr.forEach((item) => {
    examWords.push(makeExamCard(item.word))
    examWords.push(makeExamCard(item.russianWord))
  });
  examWords.sort(() => Math.random() - 0.5);
  return examWords;
}

const fragment = new DocumentFragment();

function renderExamCard(arr) {
  arr.forEach((item) => {
    fragment.append(item);
  })
  divExam.append(fragment);
};

let examProgress = 0;

function showExamProgress() {
  document.querySelector('#exam-progress').value = examProgress * 20;
  document.querySelector('#correct-percent').textContent = examProgress * 20 + `%`;
}

function doTimer() {
  sec++;
  if (sec < 10) {
    sec = `0` + sec;
  };
  if (sec === 60) {
    sec = 0;
    min++;
  }
  if (min < 10) {
    min = `0` + +min;
  };
  time.innerHTML = `${min}:` + `${sec}`;
}

backExm.addEventListener("click", function () {
  card.classList.add('hidden');
  document.querySelector('.slider-controls').classList.add('hidden')
  document.querySelector('#study-mode').classList.add('hidden');
  document.querySelector('#exam-mode').classList.remove('hidden');

  timer = setInterval(doTimer, 1000)

  renderExamCard(doExamDiv(currentWords));

  divExam.addEventListener(("click"), function (event) {

    if (first === null) {
      first = event.target;
      first.classList.add('correct');
    } else {
      second = event.target;
    }

    if (first !== null && second !== null) {
      let firstWord = currentWords.findIndex(el => el.word === first.textContent || el.russianWord === first.textContent);
      let secondWord = currentWords.findIndex(el => el.word === second.textContent || el.russianWord === second.textContent);

      if (firstWord === secondWord) {
        second.classList.add('correct');
        first.classList.add('fade-out');
        second.classList.add('fade-out');
        first = null;
        second = null;
        examProgress = ++examProgress;
        showExamProgress();
      } else {
        second.classList.add('wrong');
        setTimeout(function () {
          second.classList.remove('wrong');
          first.classList.remove('correct');
          first = null;
          second = null;
        }, 500);
      }
    }

    if (document.querySelector('#correct-percent').textContent === `100%`) {
      const endTime = time.innerHTML;
      setTimeout(function () {
        alert(`Вы успешно прошли тестирование. Время прохождения: ${endTime}`)
      }, 2000);

    }
  })
})
