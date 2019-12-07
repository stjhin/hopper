//Your asynchronous JavaScript goes here 😎
const app = {};

// Button - CTA to get Beer Result
$('#beer-cta').click(function(){
    // Check food that is typed into the input form
    const beerFood = $('#beer-input').val();

    // Show Result pulled from API
    app.getBeer(beerFood);
});

app.displayBeer = function(beer){

    // To recycle results
    $(".beer-card").empty();

    beer.forEach(function(index, beer) {
        console.log(beer);
        
        console.log(beer[index].name);
        console.log(beer[index].image_url);
        console.log(beer[index].description);
        console.log(beer[index].first_brewed);
        console.log(beer[index].food_pairing);

    // Things that need to get pulled from API
        let beerImage = beer[index].image_url;
        let beerName = beer[index].name;
        let beerFood = beer[index].food_pairing;
        let beerDesc = beer[index].description;
        let beerFirst = beer[index].first_brewed;

    // Append HTML for the card All Beer Result
    const htmlAppend =
    `<section class="section is-small">
    <div class="card card-rounded">
    <div class="card-image">
        <figure class="image is-2by3"><img src="${beerImage}"></figure>
    <div class="card-content">
        <div class="media">
        <div class="media-content">
            <p class="title beer-text is-2">${beerName}</p>
            <p class="subtitle beer-text is-4">${beerFood}</p>
        </div>
        </div>
        <div class="content">
        <p class="title beer-text is-3">${beerDesc}</p>
        <br>
        <time datetime="title is-4 beer-brew 2016-1-1">First Brewed: ${beerFirst}</time>
        </div>
        </div>
    </div>
    </div>
    </section>`;
    $(".beer-card").append(htmlAppend);
    })
};

app.getBeer = function(food){
// console.log('get a Beer from API');
    $.ajax({
    url: `https://api.punkapi.com/v2/beers?page=1&per_page=50`,
    method: 'GET',
    dataType: 'json',
    data: {
        food: food
    }
    }).then(function(result){
        app.displayBeer(result);
    
    })
}



app.init = function (){
    // check to make sure that the app is running
    // Dropdown event listener
    // $('#seasons').on('change', function(){
    // console.log('dropdown updated');
   // const seasonNum = parseInt($(this).val());
  //  console.log(seasonNum);
   // app.getQueens(seasonNum);
   // }); 
};

$(function(){
    app.init();
})