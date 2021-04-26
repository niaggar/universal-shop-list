// Require the ids of the tarjets
(() => {
  fetch('/know')
    .then(async (res) => {
      let result = await res.text();
      result = JSON.parse(result);

      let stateDateAPI = await compareDateOfDataAPI();

      if (!stateDateAPI) {
        await divLocalStorage(undefined, 'YES');
      }

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

// Adding the check event to the tasks
const createEventsListeners = (data) => {
  // Adding to an array all the cards
  data.forEach((element) => {
    cards.push(document.getElementById(element));
  });

  // Adding the event to the checkbox
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

// Modify the state of a task
const modifyStateDB = (state, id) => {
  fetch(`/editstate`, {
    method: 'post',
    // Send the id and the current state
    body: JSON.stringify({ state, id }),
    headers: {
      Accept: 'application/json',
      'Content-Type': 'application/json',
    },
  });
};

// Update the FINAL price to show on the page
const updatePrice = async (div = actualDiv) => {
  const txt = document.getElementById('total-cost');

  // Require the result of the FINAL price
  let result;
  // Send the actual currency and the div to convert
  result = await fetch('/price/', {
    method: 'POST',
    body: JSON.stringify({
      ...(await divLocalStorage('JSON', 'NO')),
      div,
    }),
    headers: {
      Accept: 'application/json',
      'Content-Type': 'application/json',
    },
  });
  result = await result.text();
  result = JSON.parse(result);

  let value = 0;
  result.forEach((element) => {
    value = value + parseFloat(element);
  });

  // Update the FINAL price
  txt.innerHTML = new Intl.NumberFormat().format(value);
};

// Cahnge the currency to show on the page
const changeDiv = (data) => {
  // Declare the currency select
  const selectDiv = document.getElementById('select-div');
  // Declare the text to show the actual currency
  const txtDiv = document.getElementsByClassName('txt-div');

  // Declare price txt of all the task
  const txtValues = [];
  data.forEach((element) => {
    txtValues.push(document.getElementById(`txt-value-${element}`));
  });

  // Add the event to the Currency select
  selectDiv.addEventListener('change', async () => {
    // Know the selectet currency
    actualDiv = selectDiv.value;

    // Change the currency to show
    for (let item of txtDiv) {
      item.innerHTML = selectDiv.value;
    }

    // Know the values of the conversion on the actual currency
    let result = await fetch('/convert', {
      method: 'POST',
      body: JSON.stringify({
        toConvert: selectDiv.value,
        values: (await divLocalStorage('JSON', 'NO')).values,
      }),
      headers: {
        Accept: 'application/json',
        'Content-Type': 'application/json',
      },
    });

    result = await result.text();
    result = JSON.parse(result);

    // Change the currency txt of the tasks
    let i = 0;
    for (let item of txtValues) {
      item.innerHTML = new Intl.NumberFormat().format(result[i]);
      i++;
    }

    // Upadate the FINAL price with the actual currency
    updatePrice(selectDiv.value);
  });
};

// Save the DataAPI on the localStorage to don't fetch all the time
const divLocalStorage = async (type, update) => {
  if (!update) update = 'NO';
  // If the DataAPI doesn't exist create it
  if (!localStorage.getItem('div') || update == 'YES') {
    let divData;
    divData = await fetch('/API');
    divData = await divData.text();
    divData = JSON.parse(divData);
    // Save to the localStorage
    localStorage.setItem('div', JSON.stringify(divData));
  }

  // Retur the DataAPI in JSON or in Txt
  if (type == 'JSON') {
    return JSON.parse(localStorage.getItem('div'));
  } else if (type == 'TXT') {
    return localStorage.getItem('div');
  }
};

const compareDateOfDataAPI = async () => {
  const { time } = await divLocalStorage('JSON');
  return time == new Date().toLocaleDateString();
};
