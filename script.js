const Letters = './images/'; 


let countdownTimeout = null; 

const convertButton = document.getElementById('go');
const sourceTextArea = document.getElementById('source-text');
const resultContainer = document.getElementById('result-text');

convertButton.addEventListener('click', function() {
    const text = sourceTextArea.value;
    resultContainer.innerHTML = ''; 
    if (countdownTimeout) {
        clearTimeout(countdownTimeout);
    }

    let letterCount = 0;
    for (let char of text) {
        if (char === ' ') {
            // Створення пробілу
            const space = document.createElement('span');
            space.innerHTML = '&nbsp;'; 
            resultContainer.appendChild(space);
        } else if (char === '\n') {
            // Обробка перенесення рядка
            const br = document.createElement('br');
            resultContainer.appendChild(br);
  } else {
            if (/[a-zA-Z0-9!\.\-_,\?\@\:]/.test(char) || char === '"' || char === '/') {
                const img = document.createElement('img');
                
                if (/[0-9]/.test(char)) {
                    img.src = `${Letters}number_${char}.png`;
                } 
                else if (/[!\.\-_,\?\@\:]/.test(char) || char === '"' || char === '/') {
                    let symbolName = '';
                    
                    if (char === '!') symbolName = 'exclamation';
                    else if (char === '.') symbolName = 'dot';
                    else if (char === '-') symbolName = 'dash';
                    else if (char === '_') symbolName = 'underscore';
                    else if (char === ',') symbolName = 'comma';
                    else if (char === '?') symbolName = 'question'; 
                    else if (char === '@') symbolName = 'at'; 
                    else if (char === ':') symbolName = 'colon'; 
                    else if (char === '"') symbolName = 'quote'; 
                    else if (char === '/') symbolName = 'slash'; 

                    img.src = `${Letters}symbol_${symbolName}.png`;
                } 
                else if (char === char.toUpperCase()) {
                    img.src = `${Letters}${char}.png`;
                } 
                else {
                    img.src = `${Letters}small_${char}.png`;
                }

                img.alt = char;

                // затримкa анімації у CSS-змінну --anim-delay
                const animDelay = (letterCount * 0.04) + 's';
                img.style.setProperty('--anim-delay', animDelay);

                // зсув по вертикалі у CSS-змінну --shift
                const randomShift = (Math.floor(Math.random() * 30) - 10) + 'px';
                img.style.setProperty('--shift', randomShift);

                // якщо картинки немає, вона просто ховається
                img.onerror = function() {
                    this.style.display = 'none';
                };

                resultContainer.appendChild(img);
                letterCount++; 
            }
        }
    }


    countdownTimeout = setTimeout(function() {
        sourceTextArea.value = '';        // Текст зникає з поля, де був написаний
        resultContainer.innerHTML = '';   // Згенеровані літери зникають з екрану
        sourceTextArea.focus();           // Повертаємо курсор для введення нового тексту
    }, 60000); 
});