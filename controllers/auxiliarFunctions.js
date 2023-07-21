const minordWords = require('./minordWords.json');


const isNotRoman = (word, romanLetters) =>
    word
        .split('')
        .map(letter => romanLetters.includes(letter))
        .filter(e => !e);

const titleFormat = title =>
    title
        .trim()
        .toLowerCase()
        .split(' ')
        .map((word, indInText) =>
            isNotRoman(word, ['m', 'd', 'c', 'l', 'x', 'v', 'i']).length > 0 ?
                word
                    .split('')
                    .map((letter, indInWord) =>
                        indInWord == 0 && indInText == 0 || indInWord == 0 && !minordWords.includes(word) ? letter.toUpperCase() : letter
                    ).join('')
                :
                word
                    .toUpperCase()
        )
        .join(' ');

module.exports = {
    titleFormat
}