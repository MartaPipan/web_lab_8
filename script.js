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
convertButton.addEventListener("click", function () {
  const text = sourceTextArea.value;
  resultContainer.innerHTML = "";
  if (countdownTimeout) {
    clearTimeout(countdownTimeout);
  }

  let letterCount = 0;

  //  створити контейнер для поточного слова
  let currentWordSpan = document.createElement("span");
  currentWordSpan.style.display = "inline-block";
  currentWordSpan.style.whiteSpace = "nowrap";

  for (let char of text) {
    if (char === " ") {
      // кінець слова перед пробілом
      if (currentWordSpan.children.length > 0) {
        resultContainer.appendChild(currentWordSpan);
      }

      // пробіл, де дозволено робити автоматичний <br>
      const space = document.createElement("span");
      space.innerHTML = " ";
      space.style.display = "inline";
      space.style.whiteSpace = "normal";
      resultContainer.appendChild(space);

      // Готуємо новий порожній контейнер для наступного слова
      currentWordSpan = document.createElement("span");
      currentWordSpan.style.display = "inline-block";
      currentWordSpan.style.whiteSpace = "nowrap";
    } else if (char === "\n") {                           //  \n (технічний знак, щоб перейти на новий рядок при Enter
      if (currentWordSpan.children.length > 0) {
        resultContainer.appendChild(currentWordSpan);
      }

      const br = document.createElement("br");
      resultContainer.appendChild(br);

      currentWordSpan = document.createElement("span");
      currentWordSpan.style.display = "inline-block";
      currentWordSpan.style.whiteSpace = "nowrap";
    } else {
      // попередньо рахуємо час анімації
      const animDelay = letterCount * 0.04 + "s";

      // перевірка, що маємо в колекції картинок
      const hasNumber = /[0-9]/.test(char);
      const hasLetter = /[a-zA-Z]/.test(char);
      const hasSymbol = /[!\.\-_,\?\@\"\/:]/.test(char);


      if (hasNumber || hasLetter || hasSymbol) {
        const img = document.createElement("img");

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

        img.style.setProperty("--anim-delay", animDelay);
        const randomShift = Math.floor(Math.random() * 30) - 10 + "px";
        img.style.setProperty("--shift", randomShift);

        /**
         * Обробник помилки завантаження зображення.
         * Якщо файл відсутній на диску, замінює елемент <img> на текстовий <span>.
         * @this {HTMLImageElement} - Елемент зображення, який не вдалося завантажити.
         * @param {Event} errEvent - Об'єкт події помилки.
         * @returns {void}
         */
        img.onerror = function () {
          const textFallback = document.createElement("span");
          textFallback.innerText = char;
          textFallback.style.setProperty("--anim-delay", animDelay);
          if (this.parentNode) {
            this.parentNode.replaceChild(textFallback, this);
          }
        };

        // Додаємо літеру всередину слова span
        currentWordSpan.appendChild(img);
        letterCount++;
      }
      // Символу немає в колекції — виводимо звичайним текстом
      else {
        const textSpan = document.createElement("span");
        textSpan.innerText = char;
        textSpan.style.setProperty("--anim-delay", animDelay);

        currentWordSpan.appendChild(textSpan);
        letterCount++;
      }
    }
  }

  //  на екран останнє слово тексту
  if (currentWordSpan.children.length > 0) {
    resultContainer.appendChild(currentWordSpan); //Якщо слово містить літери, контейнер зі словом публікуєм
  }

  countdownTimeout = setTimeout(function () {
    sourceTextArea.value = "";
    resultContainer.innerHTML = "";
    sourceTextArea.focus();
  }, 60000);
});
