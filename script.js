const API_KEY = '28eb551a6f534999bc5339d898b8940f';


const container = document.getElementById('container');
const links = document.querySelectorAll('.link');
const searchInput = document.getElementById('searchInput');
const searchContainer = document.getElementById('search-container');
const searchBtn = document.getElementById('search-btn');
const goToSearch = document.getElementById('go-to-search');

const recipeTitle = document.getElementById('recipe-title');
const recipeServings = document.getElementById('recipe-serving');
const recipeTime = document.getElementById('recipe-time');
const recipeImage = document.getElementById('recipe-image');
const recipeNutrition = document.getElementById('recipe-nutrition');
const recipeIngredients = document.getElementById('recipe-ingredients');
const recipeInstructions = document.getElementById('recipe-instructions');


links.forEach(link => {
  link.addEventListener('click', (e) => {
    links.forEach(link_ => {
      link_.classList.remove('selected');
    });
    e.target.classList.add('selected');
    let url = 'https://api.spoonacular.com/recipes/complexSearch?type=' + e.target.id + '&apiKey='+ API_KEY +'&offset=5&number=15';
    getRecipeList(url);
  })
})

function toggleMenu() {
  navbar.classList.toggle('show');
}

window.onload = init;

function init () {
  let url = 'https://api.spoonacular.com/recipes/complexSearch?type=breakfast&apiKey='+ API_KEY +'&offset=5&number=15';
  getRecipeList(url);
}

const getRecipeList = (url) => {
  fetch(url)
    .then(response => response.json())
    .then(data => {
      const result = data.results;
      displayResult(result, container);
    })
    .catch( error => {
      console.log(error);
    });
}

function handleClick() {
    const searchURL = 'https://api.spoonacular.com/recipes/complexSearch?query=' + searchInput.value + '&apiKey='+ API_KEY +'&number=15';
    fetch(searchURL)
      .then(response => response.json())
      .then(data => {
        const result = data.results;
        displayResult(result, searchContainer);
        console.log(result);
      })
      .catch( error => {
        console.log(error);
      });
}


const displayResult = (result, displayContainer) => {
  // Remove all child nodes
  while (displayContainer.hasChildNodes()) {
    displayContainer.removeChild(displayContainer.childNodes[0]);
  }
  if(result.length > 0){
    result.forEach((item) => {
      const card = document.createElement('div');
      card.classList.add('card');
      card.innerHTML = `
      <div class="image__container">
        <img class="image" src=${item.image}></img>
      </div>
      <p>${item.title}</p>`
      displayContainer.append(card);
  
      // add onclick listener
      card.addEventListener('click', () => {
        const recipeURL = 'https://api.spoonacular.com/recipes/' + item.id + '/information?includeNutrition=false&apiKey='+ API_KEY;
        fetch(recipeURL) 
          .then(response => response.json())
          .then(res => {
            recipeTitle.innerText = res.title;
            recipeServings.innerText = res.servings;
            recipeTime.innerText = res.readyInMinutes;
            recipeImage.src = item.image;
            recipeNutrition.innerText = res.healthScore;
            let ingString = '';
            res.extendedIngredients.forEach(ing => {
              ingString += `<span class="ingredient">${ing.name}</span>&#183`
            });
            recipeIngredients.innerHTML = ingString;
            let instString = '';
            res.analyzedInstructions[0].steps.forEach(instruction => {
              instString += `<li><span>${instruction.number}</span>${instruction.step}</li>`;
            });
            recipeInstructions.innerHTML = instString;
          })
          .catch( error => {
            console.log(error);
          });
  
        document.getElementById('aside-window').style.display = 'block';
        // document.getElementById('main-window').style.display = 'none';
      })
    })
  
    const firstRecipeURL = 'https://api.spoonacular.com/recipes/' + result[0].id + '/information?includeNutrition=false&apiKey='+ API_KEY;
    fetch(firstRecipeURL) 
      .then(response => response.json())
      .then(res => {
        recipeTitle.innerText = res.title;
        recipeServings.innerText = res.servings;
        recipeTime.innerText = res.readyInMinutes;
        recipeImage.src = result[0].image;
        recipeNutrition.innerText = res.healthScore;
        let ingString = '';
        res.extendedIngredients.forEach(ing => {
          ingString += `<span class="ingredient">${ing.name}</span>&#183`
        });
        recipeIngredients.innerHTML = ingString;
        let instString = '';
        res.analyzedInstructions[0].steps.forEach(instruction => {
          instString += `<li><span>${instruction.number}</span>${instruction.step}</li>`;
        });
        recipeInstructions.innerHTML = instString;
      })
      .catch( error => {
        console.log(error);
      });
  }
  else {
    displayContainer.innerHTML = '<p>Sorry! no result found...</p>';
  }
}


const slidigWindow = document.getElementById('sliding-window');

function toggleMenu() {
  navbar.style.display = (navbar.style.display === "none")? "flex" : "none";
}

function openSearch(){
  slidigWindow.style.transform = 'translate(-50%, 0)';
  goToSearch.style.display = 'none';
  // console.log("clickeds");
}

function closeSearch(){
  slidigWindow.style.transform = 'translate(0, 0)';
  goToSearch.style.display = 'block';
}