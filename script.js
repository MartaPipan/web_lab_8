const Letters = "./images/";
/**
 * ID таймера зворотного відліку для автоматичного очищення тексту.
 * @type {number|null}
 */
let countdownTimeout = null;

// елементи HTML за ID
const convertButton = document.getElementById("go");
const sourceTextArea = document.getElementById("source-text");
const resultContainer = document.getElementById("result-text");

/**
 * Обробник події кліку на кнопку конвертації.
 * Зчитує текст, керує процесом створення слів та запускає таймер видалення.
 * @param {MouseEvent} event - Об'єкт події кліку миші.
 * @returns {void}
 */
convertButton.addEventListener("click", function (event) {
  const text = sourceTextArea.value;
  resultContainer.innerHTML = "";
  if (countdownTimeout) {
    clearTimeout(countdownTimeout);
  }

  let letterCount = 0;

  for (let char of text) {
    if (char === " ") {
      // Створення простого пробілу, який дозволяє переноса рядка
      const space = document.createElement("span");
      space.innerHTML = " ";
      space.style.display = "inline";
      space.style.whiteSpace = "normal";
      resultContainer.appendChild(space);
    } else if (char === "\n") {
      // Примусовий Enter
      const br = document.createElement("br");
      resultContainer.appendChild(br);
    } else {
      // ОБЧИСЛЕННЯ ЗАДРИМКИ: Кожна літера падає одна за одною з інтервалом 0.04с
      const animDelay = letterCount * 0.04 + "s";

      const hasNumber = /[0-9]/.test(char);
      const hasLetter = /[a-zA-Z]/.test(char);
      const hasSymbol = /[!\.\-_,\?\@\":\/]/.test(char);

      if (hasNumber || hasLetter || hasSymbol) {
        const img = document.createElement("img");

        // Стиль inline-block для картинок, щоб вони не розривалися всередині екрану
        img.style.display = "inline-block";

        if (hasNumber) {
          img.src = `${Letters}number_${char}.png`;
        } else if (hasSymbol) {
          let symbolName = "";
          if (char === "!") symbolName = "exclamation";
          else if (char === ".") symbolName = "dot";
          else if (char === "-") symbolName = "dash";
          else if (char === "_") symbolName = "underscore";
          else if (char === ",") symbolName = "comma";
          else if (char === "?") symbolName = "question";
          else if (char === "@") symbolName = "at";
          else if (char === ":") symbolName = "colon";
          else if (char === '"') symbolName = "quote";
          else if (char === "/") symbolName = "slash";

          img.src = `${Letters}symbol_${symbolName}.png`;
        } else if (char === char.toUpperCase()) {
          img.src = `${Letters}${char}.png`;
        } else {
          img.src = `${Letters}small_${char}.png`;
        }

        img.alt = char;

        // АКТИВАЦІЯ ЗМІННИХ: Тепер вони записуються прямо на img, і CSS їх бачить!
        img.style.setProperty("--anim-delay", animDelay);
        const randomShift = Math.floor(Math.random() * 30) - 10 + "px";
        img.style.setProperty("--shift", randomShift);

        /**
         * Обробник помилки завантаження зображення.
         */
        img.onerror = function () {
          const textFallback = document.createElement("span");
          textFallback.innerText = char;
          textFallback.style.setProperty("--anim-delay", animDelay);
          if (this.parentNode) {
            this.parentNode.replaceChild(textFallback, this);
          }
        };

        resultContainer.appendChild(img);
        letterCount++;
      }
      // Символу немає в колекції — виводимо звичайним текстом
      else {
        const textSpan = document.createElement("span");
        textSpan.innerText = char;
        textSpan.style.setProperty("--anim-delay", animDelay);

        resultContainer.appendChild(textSpan);
        letterCount++;
      }
    }
  }

  countdownTimeout = setTimeout(function () {
    sourceTextArea.value = "";
    resultContainer.innerHTML = "";
    sourceTextArea.focus();
  }, 60000);
});
