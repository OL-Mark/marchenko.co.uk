const CONSONANTS = ["b", "c", "d", "f", "g", "h", "j", "k", "l", "m", "n", "p", "q", "r", "s", "t", "v", "w", "x", "y", "z"]
const VOWELS = ["a", "e", "o", "i", "u"]
const SPECIAL_SYMBOLS = ["!", "@", "#", "$", "%", "^", "&", "*", "(", ")", "-", "=", "{", "}", "'", "\"", ":", ";"]
const DIGITS = [1, 2, 3, 4, 5, 6, 7, 8, 9, 0]

Array.prototype.random = function () {
  return this[Math.floor((Math.random() * this.length))];
}

function randBool() {
  return Math.floor(Math.random() * 10) % 2;
}

function renderPassword() {
  passwordsContainer = document.getElementById("passwords");

  var password = document.createElement('div');
  password.innerHTML = generatePasswordWord();;
  passwordsContainer.appendChild(password);
}

function generatePasswordWord() {
  var passwordWord = [stringGenerator(DIGITS, 1), stringGenerator(DIGITS, 1), wordGenerator(), stringGenerator(SPECIAL_SYMBOLS, 1)]

  for (let i = passwordWord.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [passwordWord[i], passwordWord[j]] = [passwordWord[j], passwordWord[i]];
  }

  return passwordWord.join('');;
}

function wordGenerator(length = 4) {
  var word = '';
  for (let i = 0; i < length; i++) {
    word += generateSyllable()
  }

  return word[0].toUpperCase() + word.slice(1);
}

function generateSyllable() {
  if (randBool()) {
    return CONSONANTS.random() + VOWELS.random();
  }

  return VOWELS.random() + CONSONANTS.random();
}

function stringGenerator(chars, length) {
  var res = "";

  for (let i = 1; i <= length; i++) {
    res = res + chars.random()
  }

  return res.toString();
}
