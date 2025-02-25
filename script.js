//Seleciona elementos do formulário
const form = document.querySelector("form");
const amount = document.getElementById("amount");
const expense = document.getElementById("expense");
const category = document.getElementById("category");

//Selecioa os elementos da lista
const expenseList = document.querySelector("ul");
const expenseQuantity = document.querySelector("aside header p span");
const expenseTotal = document.querySelector("aside header h2 ");

//Captura o evento de input para formatar o valor
amount.oninput = () => {
  let value = amount.value.replace(/\D/g, "");

  //transforma o valor em número
  value = Number(value) / 100;

  amount.value = formatCurrencyBRL(value);
};

function formatCurrencyBRL(value) {
  value = value.toLocaleString("pt-BR", {
    style: "currency",
    currency: "BRL",
  });

  return value;
}

form.onsubmit = (event) => {
  event.preventDefault();

  const newExpense = {
    id: new Date().getTime(),
    expense: expense.value,
    category_id: category.value,
    category_name: category.options[category.selectedIndex].text,
    amount: amount.value,
    created_at: new Date(),
  };

  expenseAdd(newExpense);
};

function expenseAdd(newExpense) {
  try {
    //criar o elemento para adicionar o item (li) na lista (ul)
    const expenseItem = document.createElement("li");
    expenseItem.classList.add("expense");

    //cria o icone da categoria.
    const expenseIcon = document.createElement("img");
    expenseIcon.setAttribute("src", `img/${newExpense.category_id}.svg`);
    expenseIcon.setAttribute("alt", newExpense.category_name);

    //cria a info da despesa.
    const expenseInfo = document.createElement("div");
    expenseInfo.classList.add("expense-info");

    const expenseName = document.createElement("strong");
    expenseName.textContent = newExpense.expense;

    const expenseCategory = document.createElement("span");
    expenseCategory.textContent = newExpense.category_name;

    expenseInfo.append(expenseName, expenseCategory);

    const expenseAmount = document.createElement("span");
    expenseAmount.classList.add("expense-amount");
    expenseAmount.innerHTML = `<small>R$</small>${newExpense.amount
      .toUpperCase()
      .replace("R$", "")}`;

    const removeIcon = document.createElement("img");
    removeIcon.classList.add("remove-icon");

    removeIcon.setAttribute("src", "img/remove.svg");
    removeIcon.setAttribute("alt", "Remover");

    expenseItem.append(expenseIcon, expenseInfo, expenseAmount, removeIcon);
    expenseList.append(expenseItem);

    formClear();
    updateTotals();
  } catch (error) {
    alert("Não foi possível adicionar a despesa");
    console.log(error);
  }
}

function updateTotals() {
  try {
    const items = expenseList.children;

    expenseQuantity.textContent = `${items.length} ${
      items.length > 1 ? "despesas" : "despesa"
    }`;

    let total = 0;
    for (let i = 0; i < items.length; i++) {
      const itemAmount = items[i].querySelector(".expense-amount");

      //remover caracteres não numéricos e substitui a virgula pelo ponto.
      let value = itemAmount.textContent
        .replace(/[^\d,]/g, "")
        .replace(",", ".");

      value = parseFloat(value); //converter para float

      if (isNaN(value)) {
        return alert(
          "Não foi possível calcular o total. O valor não parece ser um número.Por favor, verifique a despesa e tente novamente."
        );
      }

      total += Number(value);
    }

    const symbolBRL = document.createElement("small");
    symbolBRL.textContent = "R$";

    total = formatCurrencyBRL(total).toUpperCase().replace("R$", "");
    expenseTotal.innerHTML = "";

    expenseTotal.append(symbolBRL, total);
  } catch (error) {
    alert("Erro ao atualizar os totais");
    console.log(error);
  }
}

expenseList.addEventListener("click", function (event) {
  if (event.target.classList.contains("remove-icon")) {
    const item = event.target.closest(".expense");
    item.remove();
  }

  updateTotals();
});

function formClear() {
  expense.value = "";
  category.value = "";
  amount.value = "";

  expense.focus();
}
