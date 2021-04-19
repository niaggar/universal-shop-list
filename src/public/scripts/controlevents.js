// Require the ids of the tarjets
(() => {
  fetch('/knowid')
    .then(async (res) => {
      let result = await res.text();
      result = JSON.parse(result);

      createEventsListeners(result);
      updatePrice();
      changeDiv(result);
    })
    .catch((err) => {
      console.log(err);
    });
})();

const cards = [];
let actualDiv = 'EUR';

const createEventsListeners = (data) => {
  // Adding to an array all the cards
  data.forEach((element) => {
    cards.push(document.getElementById(element));
  });

  // Adding the even to the checkbox
  data.forEach((element, index) => {
    let toadd = document.getElementById(`check-${element}`);
    toadd.addEventListener('change', function () {
      if (this.checked) {
        cards[index].classList.toggle('completed');
        modifyStateDB(true, element);
        updatePrice();
      } else {
        cards[index].classList.toggle('completed');
        modifyStateDB(false, element);
        updatePrice();
      }
    });
  });
};

const modifyStateDB = (state, id) => {
  fetch(`/editstate`, {
    method: 'post',
    body: JSON.stringify({ state, id }),
    headers: {
      Accept: 'application/json',
      'Content-Type': 'application/json',
    },
  });
};

const updatePrice = async (div = actualDiv) => {
  const txt = document.getElementById('total-cost');

  let result;
  result = await fetch(`/price/${div}`);
  result = await result.text();
  result = JSON.parse(result);

  console.log(result);

  let value = 0;
  result.forEach((element) => {
    value = value + parseFloat(element);
  });

  txt.innerHTML = value;
};

const changeDiv = (data) => {
  const selectDiv = document.getElementById('select-div');
  const txtDiv = document.getElementsByClassName('txt-div');

  const txtValues = [];
  data.forEach((element) => {
    txtValues.push(document.getElementById(`txt-value-${element}`));
  });

  selectDiv.addEventListener('change', async () => {
    actualDiv = selectDiv.value;

    for (let item of txtDiv) {
      item.innerHTML = selectDiv.value;
    }

    let result = await fetch('/convert', {
      method: 'POST',
      body: JSON.stringify({ toConvert: selectDiv.value }),
      headers: {
        Accept: 'application/json',
        'Content-Type': 'application/json',
      },
    });

    result = await result.text();
    result = JSON.parse(result);

    let i = 0;
    for (let item of txtValues) {
      item.innerHTML = result[i];
      i++;
    }

    updatePrice(selectDiv.value);
  });
};
