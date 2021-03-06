import * as model from "./model.js";
import recipeView from "./views/recipeView.js";
import searchView from "./views/searchView.js";
import resultsView from "./views/resultsView.js";
import paginationView from "./views/paginationView.js";

import { async } from "regenerator-runtime";
import "core-js/stable";
import "regenerator-runtime/runtime";

// Hot module
// if (module.hot) {
//     module.hot.accept();
// }
const controlRecipes = async function () {
    try {
        // Get hash 
        const id = window.location.hash.slice(1);

        // Handle no hash scenario
        if (!id) return;

        // 0) Update results view to mark selected search result
        resultsView.update(model.getSearchResultsPage());

        recipeView.renderSpinner();

        // 1. Loading search results
        await model.loadRecipe(id);

        // 2. Rendering results
        recipeView.render(model.state.recipe);

    } catch (err) {
        console.error(err);
        recipeView.renderError();
    }
}

const controlSearchResults = async function () {
    try {
        resultsView.renderSpinner();

        // 1) Get search query
        const query = searchView.getQuery();
        if (!query) return;

        // 2) Load search results
        await model.loadSearchResults(query);
        console.log(model.state.search);
        // 3) Render results
        resultsView.render(model.getSearchResultsPage());

        // 4) Render initial pagination buttons
        paginationView.render(model.state.search);

    } catch (err) {
        console.error(err);
    }
}

const controlPagination = function (goToPage) {
    // 1) Render NEW results
    resultsView.render(model.getSearchResultsPage(goToPage));

    // 2) Render NEW pagination buttons
    paginationView.render(model.state.search);

}

const controlServings = function (newServings) {
    // Update the recipe servings (in state)
    model.updateServings(newServings);

    // Update the recipe view
    recipeView.update(model.state.recipe);

}

// Publisher-Subscriber Design Pattern
const init = function () {
    recipeView.addHandlerRender(controlRecipes);
    recipeView.addHandlerUpdateServings(controlServings);
    searchView.addHandlerSearch(controlSearchResults);
    paginationView.addHandlerClick(controlPagination);
}

init();

