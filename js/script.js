// DOM Elements
const recipes = document.getElementById("recipes");
const mealFocus = document.getElementById("mealFocus");
const loading = document.getElementById("pulse-wrapper");
const searchInput = document.getElementById("searchInput");
const searchByFirstLetter = document.getElementById("searchByFirstLetter");
const cats = document.getElementById("cats");
const areasContainer = document.getElementById("areas");
const contactForm = document.getElementById("contactForm");
const Ingredients = document.getElementById("Ingredients");

let areas = [];
let meals = [];
let categories = [];
let ingredients = [];


function showLoading() {
  loading && loading.classList.remove("d-none");
}
function hideLoading() {
  loading && loading.classList.add("d-none");
}

// Fetch Functions
async function getMeal(api) {
  showLoading();
  meals = [];
  try {
    const response = await fetch(api);
    const data = await response.json();
    if (data.meals) {
      meals = data.meals;
      await displayMeals();
    } else {
      recipes &&
        (recipes.innerHTML = "<p class='text-center'>No meals found.</p>");
    }
  } catch (err) {
    recipes &&
      (recipes.innerHTML =
        "<p class='text-center text-danger'>Error loading meals.</p>");
  }
  hideLoading();
}

async function getCat(api) {
  showLoading();
  try {
    const response = await fetch(api);
    const data = await response.json();
    categories = data.categories || [];
    displayCat();
  } catch (err) {
    cats &&
      (cats.innerHTML =
        "<p class='text-center text-danger'>Error loading categories.</p>");
  }
  hideLoading();
}

async function getAreas(api) {
  showLoading();
  try {
    const response = await fetch(api);
    const data = await response.json();
    areas = data.meals || [];
    displayAreas();
  } catch (err) {
    areasContainer &&
      (areasContainer.innerHTML =
        "<p class='text-center text-danger'>Error loading areas.</p>");
  }
  hideLoading();
}

async function getIngredients(api) {
  showLoading();
  try {
    const response = await fetch(api);
    const data = await response.json();
    ingredients = data.meals || [];
    displayIngredients();
  } catch (err) {
    Ingredients &&
      (Ingredients.innerHTML =
        "<p class='text-center text-danger'>Error loading ingredients.</p>");
  }
  hideLoading();
}

// Display Functions
function displayAreas() {
  if (!areasContainer) return;
  areasContainer.innerHTML = "";
  for (let i = 0; i < areas.length; i++) {
    areasContainer.innerHTML += `
      <div class="col-md-4">
        <div class="recipe-card Area-ingredient" data-area="${areas[i].strArea}">
          <i class="fa-solid fa-house-laptop fa-4x"></i>
          <h3 class='mealArea'>${areas[i].strArea}</h3>
        </div>
      </div>
    `;
  }
}

function displayIngredients() {
  if (!Ingredients) return;
  Ingredients.innerHTML = "";
  for (let i = 0; i < Math.min(20, ingredients.length); i++) {
    Ingredients.innerHTML += `
      <div class="col-md-4">
        <div class="recipe-card Area-ingredient" data-ingredient="${
          ingredients[i].strIngredient
        }">
          <i class="fa-solid fa-bowl-food"></i>
          <h3 class='mealIngredient'>${ingredients[i].strIngredient}</h3>
          <p class='mealIngredient'>${(ingredients[i].strDescription || "")
            .split(" ")
            .slice(0, 10)
            .join(" ")}</p>
        </div>
      </div>
    `;
  }
}

async function displayMeals() {
  if (!recipes) return;
  recipes.innerHTML = "";
  if (
    window.location.pathname.toLowerCase().includes("categories.html") &&
    meals.length
  ) {
    const meal = await getMealById(
      `https://www.themealdb.com/api/json/v1/1/lookup.php?i=${meals[0].idMeal}`
    );
    recipes.innerHTML = `<h2 class="text-center">${
      meal ? meal.strCategory : ""
    }</h2>`;
  } else if (
    window.location.pathname.toLowerCase().includes("area.html") &&
    meals.length
  ) {
    const meal = await getMealById(
      `https://www.themealdb.com/api/json/v1/1/lookup.php?i=${meals[0].idMeal}`
    );
    recipes.innerHTML = `<h2 class="text-center">${
      meal ? meal.strArea : ""
    }</h2>`;
  }
  for (let i = 0; i < meals.length; i++) {
    recipes.innerHTML += `
      <div class="col-md-4">
        <div class="recipe-card">
          <img src="${meals[i].strMealThumb}" class="rounded-3" alt="${meals[i].strMeal}" />
          <div class='mealName' id="${i}">${meals[i].strMeal}</div>
        </div>
      </div>
    `;
  }
}

function displayCat() {
  if (!cats) return;
  cats.innerHTML = "";
  for (let i = 0; i < categories.length; i++) {
    cats.innerHTML += `
      <div class="col-md-4">
        <div class="recipe-card">
          <img src="${categories[i].strCategoryThumb}" class="rounded-3" alt="${
      categories[i].strCategory
    }" />
          <div class='mealCat' id='${categories[i].strCategory}'>
            ${categories[i].strCategory}
            <p>${categories[i].strCategoryDescription
              .split(" ")
              .slice(0, 20)
              .join(" ")}</p>
          </div>
        </div>
      </div>
    `;
  }
}

// Hide meal focus
function hideMealFocus() {
  mealFocus && mealFocus.classList.add("d-none");
  if (mealFocus) mealFocus.innerHTML = "";
}

// Fetch meal by ID
async function getMealById(api) {
  showLoading();
  try {
    const response = await fetch(api);
    const data = await response.json();
    return data.meals ? data.meals[0] : null;
  } catch {
    return null;
  } finally {
    hideLoading();
  }
}


if (recipes) {
  recipes.addEventListener("click", async function (e) {
    const mealNameDiv = e.target.closest(".mealName");
    if (mealNameDiv && recipes.contains(mealNameDiv)) {
      const mealID = meals[mealNameDiv.id].idMeal;
      const meal = await getMealById(
        `https://www.themealdb.com/api/json/v1/1/lookup.php?i=${mealID}`
      );
      if (!meal) return;

      let ingredientsList = "";
      for (let i = 1; i <= 20; i++) {
        const ingredient = meal[`strIngredient${i}`];
        if (ingredient && ingredient.trim() !== "") {
          ingredientsList += `<li class="list-group-item">${ingredient}</li>`;
        }
      }
      mealFocus.innerHTML = `
        <div class="card">
          <div class="card-head">
            <img src="${meal.strMealThumb}" alt="meal image" />
            <div>
              <h5 class="card-title">${meal.strMeal}</h5>
              <p>Area: ${meal.strArea}</p>
              <p>Category: ${meal.strCategory}</p>
            </div>
          </div>
          <div>
            <a class="Tags btn btn-danger" href="${meal.strYoutube}" target='_blank'>YouTube</a>
            <a class="Tags btn btn-success" href="${meal.strSource}" target='_blank'>Source</a>
          </div>
          <div>
            <h5>Ingredients</h5>
            <ul class="list-group">
              ${ingredientsList}
            </ul>
            <h5>Instructions</h5>
            <p>${meal.strInstructions}</p>
          </div>
        </div>
      `;
      mealFocus.classList.remove("d-none");
    }
  });
}

if (cats) {
  cats.addEventListener("click", function (e) {
    const mealCatDiv = e.target.closest(".mealCat");
    if (mealCatDiv && cats.contains(mealCatDiv)) {
      const cat = mealCatDiv.id;
      cats.classList.add("d-none");
      getMeal(`https://www.themealdb.com/api/json/v1/1/filter.php?c=${cat}`);
    }
  });
}

if (areasContainer) {
  areasContainer.addEventListener("click", function (e) {
    const card = e.target.closest(".recipe-card[data-area]");
    if (card && areasContainer.contains(card)) {
      const area = card.getAttribute("data-area");
      areasContainer.classList.add("d-none");
      getMeal(`https://www.themealdb.com/api/json/v1/1/filter.php?a=${area}`);
    }
  });
}

if (Ingredients) {
  Ingredients.addEventListener("click", function (e) {
    const card = e.target.closest(".recipe-card[data-ingredient]");
    if (card && Ingredients.contains(card)) {
      const ingredient = card.getAttribute("data-ingredient");
      Ingredients.classList.add("d-none");
      getMeal(
        `https://www.themealdb.com/api/json/v1/1/filter.php?i=${ingredient}`
      );
    }
  });
}

// Close meal focus on outside click or Escape key
window.addEventListener("click", function (e) {
  if (e.target === mealFocus) hideMealFocus();
});
window.addEventListener("keydown", function (e) {
  if (e.key === "Escape") hideMealFocus();
});

// Search by name
if (searchInput) {
  searchInput.addEventListener("keyup", function (e) {
    recipes.innerHTML = "";
    meals = [];
    if (e.target.value.length > 0) {
      getMeal(
        `https://www.themealdb.com/api/json/v1/1/search.php?s=${e.target.value}`
      );
    } else {
      getMeal("https://www.themealdb.com/api/json/v1/1/search.php?s=");
    }
  });
}

// Search by first letter
if (searchByFirstLetter) {
  searchByFirstLetter.addEventListener("keyup", function (e) {
    if (e.target.value.length > 0) {
      recipes.innerHTML = "";
      meals = [];
      getMeal(
        `https://www.themealdb.com/api/json/v1/1/search.php?f=${e.target.value}`
      );
    }
  });
}

// Initial Page Load Logic
const path = window.location.pathname.toLowerCase();
if (path.includes("categories.html")) {
  getCat("https://www.themealdb.com/api/json/v1/1/categories.php");
} else if (path.includes("area.html")) {
  getAreas("https://www.themealdb.com/api/json/v1/1/list.php?a=list");
} else if (path.includes("ingredients")) {
  getIngredients("https://www.themealdb.com/api/json/v1/1/list.php?i=list");
} else if (path.includes("index.html") || path.includes("search.html")) {
  getMeal("https://www.themealdb.com/api/json/v1/1/search.php?s=");
}
