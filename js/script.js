var recipes = document.getElementById("recipes");
var mealFocus = document.getElementById("mealFocus");
var loading = document.getElementById("pulse-wrapper"); // Reference to the loading element
var searchInput = document.getElementById("searchInput");
var searchByFirstLetter = document.getElementById("searchByFirstLetter");
var meals = [];

function getMeals(api) {
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
      // Hide the loading spinner
      loading.classList.add("d-none");
    });
}

function displayMeals() {
  for (let i = 0; i < meals.length; i++) {
    recipes.innerHTML += `
        <div class="col-md-4" >
            <div class="recipe-card">
                <img src="${meals[i].strMealThumb}" class="rounded-3" alt="${meals[i].strMeal}" />
                <div class="mealName" id="${i}">${meals[i].strMeal}</div>
            </div>
            </div>
        `;
  }
}

function hideMealFocus() {
  mealFocus.classList.add("d-none");
  mealFocus.innerHTML = "";
}

getMeals("https://www.themealdb.com/api/json/v1/1/search.php?s=");

recipes.addEventListener("click", function (e) {
  if (e.target.classList.contains("mealName")) {
    var meal = meals[e.target.id];
    var ingredients = [];
    for (var i = 1; i <= 20; i++) {
      var ingredient = meal[`strIngredient${i}`];
      if (ingredient && ingredient.trim() !== "") {
        ingredients.push(`<li class="list-group-item">${ingredient}</li>`);
      }
    }
    var ingredients = ingredients.join("");
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
            ${ingredients}
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

searchInput.addEventListener("keyup", function (e) {
  if (e.target.value.length > 0) {
    recipes.innerHTML = "";
    meals = [];
    getMeals(
      `https://www.themealdb.com/api/json/v1/1/search.php?s=${e.target.value}`
    );
  } else {
    recipes.innerHTML = "";
    meals = [];
    getMeals("https://www.themealdb.com/api/json/v1/1/search.php?s=");
  }
});
searchByFirstLetter.addEventListener("keyup", function (e) {
  if (e.target.value.length > 0) {
    recipes.innerHTML = "";
    meals = [];
    getMeals(`https://www.themealdb.com/api/json/v1/1/search.php?f=${e.target.value}`);
  }
});