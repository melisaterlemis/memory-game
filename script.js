const moves = document.getElementById("moves-count");
const countt = document.getElementById("show-Count");
const timeValue = document.getElementById("time");
const showCards = document.getElementById("showCards");
const startButton = document.getElementById("start");
const stopButton = document.getElementById("stop");
const restartButton = document.getElementById("restart");
const restartContainer = document.querySelector(".restart-container");
const gameContainer = document.querySelector(".game-container");
const result = document.getElementById("result");
const controls = document.querySelector(".controls-container");
const wrapper = document.querySelector(".wrapper");
let cards;
let interval;
let firstCard = false;
let secondCard = false;
let disableDeck = false;
let count = 0;
let correct = new Audio("./sounds/surprise-sound-effect-99300.mp3");
let wrong = new Audio("./sounds/negative_beeps-6008.mp3");
let whoosh = new Audio("./sounds/whoosh-transitions-sfx-03-118230.mp3");

//Items array
const items = [
  { name: "cat", image: "Images/cat-svgrepo-com.svg" },
  { name: "chameleon", image: "Images/chameleon-svgrepo-com.svg" },
  { name: "deer", image: "Images/deer-svgrepo-com.svg" },
  { name: "elephant", image: "Images/elephant-svgrepo-com.svg" },
  { name: "elk", image: "Images/elk-svgrepo-com.svg" },
  { name: "frog", image: "Images/frog-svgrepo-com.svg" },
  { name: "hippopotamus", image: "Images/hippopotamus-svgrepo-com.svg" },
  { name: "horse", image: "Images/horse-svgrepo-com.svg" },
  { name: "ostrich", image: "Images/ostrich-svgrepo-com.svg" },
  { name: "parrot", image: "Images/parrot-svgrepo-com.svg" },
  { name: "rat", image: "Images/rat-svgrepo-com.svg" },
];
// //ilk zaman
let seconds = 0,
  minutes = 0;
// //İlk hamleler ve kazanma sayısı
let movesCount = 0,
  winCount = 0;
// //zamanlayıcı için
const timeGenerator = () => {
  seconds += 1;
  //dakika
  if (seconds >= 60) {
    minutes += 1;
    seconds = 0;
  }
  // görüntülemeden önceki zamanı biçimlendir
  let secondsValue = seconds < 10 ? `0${seconds}` : seconds;
  let minutesValue = minutes < 10 ? `0${minutes}` : minutes;
  timeValue.innerHTML = `<span>Time:</span>${minutesValue}:${secondsValue}`;
};
// //Hareket hesaplamak için
const movesCounter = () => {
  movesCount += 1;
  moves.innerHTML = `<span>Moves:</span>${movesCount}`;
};
const RemaingShowCount = (a) => {
  countt.innerHTML = `<span>Show:${a < 4 ? 3 - a : 0}</span>`;
};
// öğeler dizisinden rastgele nesneler seç
const generateRandom = (size = 4) => {
  //geçici diziye gerçek diziyi atadık
  let tempArray = [...items];
  // cardValues ​​dizisini başlatır
  let cardValues = [];
  // boyut çift olmalıdır (4*5 matris)/2 çünkü nesne çiftleri var olacaktır
  size = (size * 5) / 2;
  // Rastgele nesne seçimi
  for (let i = 0; i < size; i++) {
    const randomIndex = Math.floor(Math.random() * tempArray.length);
    cardValues.push(tempArray[randomIndex]);
    // bir kez seçildikten sonra nesneyi geçici diziden kaldır
    tempArray.splice(randomIndex, 1);
  }
  return cardValues;
};

const matrixGenerator = (cardValues, size = 10) => {
  gameContainer.innerHTML = "";
  cardValues = [...cardValues, ...cardValues]; //cardvalues dizesini üst üste koyar
  //basit karıştırma
  cardValues.sort(() => Math.random() - 0.5); //ve yeniden random olarak karıştırr
  for (let i = 0; i < size + size; i++) {
    /*
        Kart Oluştur
        önce => ön taraf (paw iconu içerir)
        sonra => arka taraf (gerçek görüntü içerir);
        data-card-values, kartların adlarını daha sonra eşleştirmek üzere saklayan özel bir niteliktir.
      */
    gameContainer.innerHTML += `
     <div class="card-container animate__animated" data-card-value="${cardValues[i].name}">
        <div class="card-before"><i class="fa-solid fa-paw"></i></div>
        <div class="card-after">
        <img src="${cardValues[i].image}" class="image"/>
        </div>
     </div>
     `;
  }
  function mp3() {
    whoosh.play();
    whoosh.currentTime = 0;
  }
  //Grid
  gameContainer.style.gridTemplateColumns = `repeat(5,auto)`;
  //Cards
  cards = document.querySelectorAll(".card-container");

  cards.forEach((card) => {
    //tüm kartların gösterilmesi

    let show = setTimeout(() => {
      card.classList.add("flipped");
      mp3();
      setTimeout(() => {
        card.classList.remove("flipped");
        mp3();
      }, 2000);
      setTimeout(() => {
        card.addEventListener("click", () => {
          //Seçilen kart henüz eşleşmediyse, sadece çalıştır (yani, zaten eşleşen kart tıklandığında yok sayılır)
          if (!card.classList.contains("matched") && !disableDeck) {
            //card matched sınıfını içermiyorsa
            // tıklanan kartı çevir
            card.classList.add("flipped");
            mp3();
            //bu birinci kart ise (!firstCard çünkü firstCard başlangıçta yanlıştır)
            if (!firstCard && !disableDeck) {
              //bu yüzden mevcut kart firstCard olacak
              firstCard = card;
              disableDeck = false;

              //geçerli kartların değeri firstCardValue olur
              firstCardValue = card.getAttribute("data-card-value");
              console.log(firstCardValue);
            } else {
              // kullanıcı ikinci kartı seçtiğinden beri artış hareketleri
              movesCounter();
              //ikinciKart ve değer
              secondCard = card;
              disableDeck = true;

              let secondCardValue = card.getAttribute("data-card-value");

              if (firstCardValue == secondCardValue) {
                //her iki kart da eşleşirse eşleşen sınıfı ekleyin, böylece bir dahaki sefere bu kartlar yoksayılır

                firstCard.classList.add("matched");
                secondCard.classList.add("matched");

                disableDeck = false;
                function checked() {
                  firstCard.childNodes[3].childNodes[1].src =
                    "Images/greentik.png";
                  firstCard.childNodes[3].childNodes[1].style.width = "90px";
                  firstCard.childNodes[3].childNodes[1].style.cursor =
                    "default";

                  secondCard.childNodes[3].childNodes[1].src =
                    "Images/greentik.png";
                  secondCard.childNodes[3].childNodes[1].style.width = "90px";
                  secondCard.childNodes[3].childNodes[1].style.cursor =
                    "default";
                }
                setTimeout(checked(), 4000);
                correct.play(); //sesi aç
                correct.currentTime = 0; //sesi sıfırla

                //bir sonraki kart şimdi ilk olacağından firstCard'ı false olarak ayarlayın
                firstCard = false;
                // kullanıcı doğru bir eşleşme bulduğu için winCount artışı
                winCount += 1;
                // winCount ==kart Değerlerinin yarısı olup olmadığını kontrol edin
                if (winCount == Math.floor(cardValues.length / 2)) {
                  result.innerHTML = `<h2>you won..</h2>
            <h4>Moves: ${movesCount}</h4>`;
                  restart();
                }
              } else {
                //kartlar eşleşmiyorsa
                //kartları normale döndür
                let [tempFirst, tempSecond] = [firstCard, secondCard];

                firstCard = false;
                secondCard = false;

                let delay = setTimeout(() => {
                  //yanlış kartlara animasyon eklenmesi
                  tempFirst.classList.add("animate__shakeX");
                  tempSecond.classList.add("animate__shakeX");
                  wrong.play();
                  wrong.currentTime = 0;
                  setTimeout(() => {
                    tempFirst.classList.remove("flipped");
                    tempSecond.classList.remove("flipped");
                    disableDeck = false;
                  }, 1000);
                }, 900);
                tempFirst.classList.remove("animate__shakeX");
                tempSecond.classList.remove("animate__shakeX");
              }
            }
          }
        });
      }, 3000);
    }, 1000);
    //3 kere kartları açma hakkı
    showCards.addEventListener("click", () => {
      if (count < 4) {
        let showCrads = setTimeout(() => {
          card.classList.add("flipped");
          setTimeout(() => {
            if (!card.classList.contains("matched")) {
              card.classList.remove("flipped");
            }
          }, 2000);
        }, 900);
      }
    });
  });
};
showCards.addEventListener("click", () => {
  count++;
  if (count >= 4) {
    alert("Tahmin Hakkiniz Bitti");
  }
  RemaingShowCount(count);
});

//Oyunu başlatmak
startButton.addEventListener("click", () => {
  movesCount = 0;
  seconds = 0;
  minutes = 0;
  count = 0;
  // buton düğmelerinin görünürlüğünü kontrol eder
  controls.classList.add("hide");
  restartContainer.classList.add("hide");
  stopButton.classList.remove("hide");
  startButton.classList.add("hide");
  restartButton.classList.add("hide");
  timeValue.style.visibility = "visibles";

  // Zamanlayıcıyı başlat
  interval = setInterval(timeGenerator, 1000);
  //ilk hareketler
  moves.innerHTML = `<span>Moves:</span> ${movesCount}`;
  RemaingShowCount(count);
  initializer();
});
//oyunu yeniden başlatma ekranı
restartButton.addEventListener("click", () => {
  movesCount = 0;
  seconds = 0;
  minutes = 0;
  count = 0;
  // buton düğmelerinin görünürlüğünü kontrol eder
  controls.classList.add("hide");
  restartContainer.classList.add("hide");
  stopButton.style.visibility = "visible ";
  startButton.classList.add("hide");
  gameContainer.style.opacity = "1.0";
  timeValue.style.visibility = "visible";
  showCards.style.visibility = "visible";
  countt.style.visibility = "visible";
  // Zamanlayıcıyı başlat
  interval = setInterval(timeGenerator, 1000);
  //ilk hareketler
  moves.innerHTML = `<span>Moves:</span> ${movesCount}`;
  initializer();
  RemaingShowCount(count);
});
//Oyunu durdur
stopButton.addEventListener(
  "click",
  (stopGame = () => {
    controls.classList.remove("hide");
    stopButton.classList.add("hide");
    startButton.classList.remove("hide");
    clearInterval(interval); //durduruyor oyunu
  })
);
function restart() {
  seconds = 0;
  minutes = 0;
  showCards.style.visibility = "hidden";
  timeValue.style.visibility = "hidden";
  gameContainer.style.opacity = "0.3";
  stopButton.style.visibility = "hidden";
  restartContainer.classList.remove("hide");
  restartButton.classList.remove("hide");
  countt.style.visibility = "hidden";
}

// Değerleri ve işlev çağrılarını başlat
const initializer = () => {
  result.innerText = "";
  winCount = 0;
  let cardValues = generateRandom();
  console.log(cardValues);
  matrixGenerator(cardValues);
};
