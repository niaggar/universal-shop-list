// Require the ids of the tarjets
(() => {
  fetch('/knowid')
    .then(async (res) => {
      let result = await res.text();
      result = JSON.parse(result);

      createEventsListeners(result);
      updatePrice();
      changeDiv();
    })
    .catch((err) => {
      console.log(err);
    });
})();

const cards = [];

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

const updatePrice = () => {
  const txt = document.getElementById('total-cost');

  fetch('/price').then(async (res) => {
    let result;
    result = await res.text();
    result = JSON.parse(result);

    let value = 0;
    result.forEach((element) => {
      value = value + parseFloat(element);
    });

    txt.innerHTML = value;
  });
};

const changeDiv = () => {
  const selectDiv = document.getElementById('select-div');
  const txtDiv = document.getElementsByClassName('txt-div');

  selectDiv.addEventListener('change', (ev) => {
    for (let item of txtDiv) {
      item.innerHTML = selectDiv.value;
    }
  });
};
