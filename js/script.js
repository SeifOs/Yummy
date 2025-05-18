var recipes = document.getElementById("recipes");
var mealFocus = document.getElementById("mealFocus");
var loading = document.getElementById("pulse-wrapper"); // Reference to the loading element
var searchInput = document.getElementById("searchInput");
var searchByFirstLetter = document.getElementById("searchByFirstLetter");
var cats = document.getElementById("cats");
var contactForm = document.getElementById("contactForm");
var meals = [];
var categories = [];

function getMeal(api) {
  // Show the loading spinner
  loading.classList.remove("d-none");

  fetch(api)
    .then((response) => response.json()) // convert to JSON
    .then((data) => {
      for (let i = 0; i < data.meals.length; i++) {
        meals.push(data.meals[i]);
      }
      console.log(meals);
      displayMeals();
    })
    .finally(() => {
      loading.classList.add("d-none");
    });
}
function getCat(api) {
  loading.classList.remove("d-none");

  fetch(api)
    .then((response) => response.json())
    .then((data) => {
      categories = data.categories;
      console.log(categories);
      displayCat();
    })
    .finally(() => {
      loading.classList.add("d-none");
    });
}
function displayCat() {
  for (let i = 0; i < categories.length; i++) {
    cats.innerHTML += `
        <div class="col-md-4" >
            <div class="recipe-card">
                <img src="${
                  categories[i].strCategoryThumb
                }" class="rounded-3" alt="${categories[i].strCategory}" />
                <div class='mealCat' id='${categories[i].strCategory}'>${
      categories[i].strCategory
    }<p>${categories[i].strCategoryDescription
      .split(" ")
      .slice(0, 20)
      .join(" ")}</p></div>
            </div>
            </div>
        `;
  }
}
async function displayMeals() {
  if (window.location.pathname.includes("categories.html")) {
    let meal = await getMealById(`https://www.themealdb.com/api/json/v1/1/lookup.php?i=${meals[0].idMeal}`);
    console.log(meal);
    
    recipes.innerHTML = `<h2 class="text-center">${meal.strCategory}</h2>`;
  }
  for (let i = 0; i < meals.length; i++) {
    recipes.innerHTML += `
        <div class="col-md-4" >
            <div class="recipe-card">
                <img src="${meals[i].strMealThumb}" class="rounded-3" alt="${meals[i].strMeal}" />
                <div class='mealName' id="${i}">${meals[i].strMeal}</div>
            </div>
            </div>
        `;
  }
}
function hideMealFocus() {
  mealFocus.classList.add("d-none");
  mealFocus.innerHTML = "";
}
function getMealById(api) {
  loading.classList.remove("d-none");
  return fetch(api)
    .then((response) => response.json())
    .then((data) => {
      loading.classList.add("d-none");
      return data.meals[0];
    })
    .catch(() => {
      loading.classList.add("d-none");
      return null;
    });
}

if (recipes) {
  recipes.addEventListener("click", async function (e) {
    // Find the closest ancestor with class 'mealName'
    const mealNameDiv = e.target.closest(".mealName");
    if (mealNameDiv && recipes.contains(mealNameDiv)) {
      var mealID = meals[mealNameDiv.id].idMeal;
      var meal = await getMealById(
        `https://www.themealdb.com/api/json/v1/1/lookup.php?i=${mealID}`
      );
      if (!meal) return;

      var ingredients = [];
      for (var i = 1; i <= 20; i++) {
        var ingredient = meal[`strIngredient${i}`];
        if (ingredient && ingredient.trim() !== "") {
          ingredients.push(`<li class="list-group-item">${ingredient}</li>`);
        }
      }
      var ingredientsList = ingredients.join("");
      mealFocus.innerHTML += `
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
            <p>
              ${meal.strInstructions}
            </p>
          </div>
        </div>
      `;
      mealFocus.classList.remove("d-none");
    }
  });
}
if (cats) {
  cats.addEventListener("click", function (e) {
    // Find the closest ancestor with class 'mealCat'
    const mealCatDiv = e.target.closest(".mealCat");
    if (mealCatDiv && cats.contains(mealCatDiv)) {
      let cat = mealCatDiv.id;
      cats.classList.add("d-none");
      getMeal(`https://www.themealdb.com/api/json/v1/1/filter.php?c=${cat}`);
    }
  });
}
// Close the meal focus when clicking outside of it
window.addEventListener("click", function (e) {
  if (e.target === mealFocus) {
    hideMealFocus();
  }
});
window.addEventListener("keydown", function (e) {
  if (e.key === "Escape") {
    hideMealFocus();
  }
});

if (searchInput) {
  searchInput.addEventListener("keyup", function (e) {
    if (e.target.value.length > 0) {
      recipes.innerHTML = "";
      meals = [];
      getMeal(
        `https://www.themealdb.com/api/json/v1/1/search.php?s=${e.target.value}`
      );
    } else {
      recipes.innerHTML = "";
      meals = [];
      getMeal("https://www.themealdb.com/api/json/v1/1/search.php?s=");
    }
  });
}
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

if (window.location.pathname.includes("categories.html")) {
  getCat("https://www.themealdb.com/api/json/v1/1/categories.php");
} else if (
  window.location.pathname.includes("index.html") ||
  window.location.pathname.includes("search.html")
) {
  getMeal("https://www.themealdb.com/api/json/v1/1/search.php?s=");
}