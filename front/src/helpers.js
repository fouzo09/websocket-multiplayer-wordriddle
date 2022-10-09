export function generateGameCode(length) {
    let result = '';
    const characters = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789';
    const charactersLength = characters.length;
    for ( let i = 0; i < length; i++ ) {
      result += characters.charAt(Math.floor(Math.random() *  charactersLength));
    }
    return result;
}


export function generateNumbers(bestNumber) {
    let nums = [1,2,3,4,5,6];
    let selections = [bestNumber];

    nums.splice(nums.indexOf(bestNumber), 1);

    for (let i = 0; i < 2; i++) {

      console.log(nums);
        let index = Math.floor(Math.random() * nums.length);

        selections.push(nums[index]);

        nums.splice(index, 1);
    }
    return shuffle(selections);
}

function shuffle(array) {
  let currentIndex = array.length,  randomIndex;
  while (currentIndex != 0) {

    randomIndex = Math.floor(Math.random() * currentIndex);
    currentIndex--;
    [array[currentIndex], array[randomIndex]] = [
      array[randomIndex], array[currentIndex]];
  }
  return array;
}
