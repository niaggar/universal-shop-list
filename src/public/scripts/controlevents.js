// Require the ids of the tarjets
(() => {
  fetch('/knowid')
    .then(async (res) => {
      let result = await res.text();
      result = JSON.parse(result);

      createEventsListeners(result);
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
      } else {
        cards[index].classList.toggle('completed');
        modifyStateDB(false, element);
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
  }).then((res) => {
    console.log(res);
  });
};
