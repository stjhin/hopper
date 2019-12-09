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
    //console.log(beer.length);

    let totalSearch = beer.length;
    // To recycle results
    $(".beer-card").empty();
    $("#searchTotal").empty();

    beer.forEach(function(beer) {
        //console.log(beer);

        //console.log(beer.name);
        //console.log(beer.image_url);
        //console.log(beer.description);
        //console.log(beer.first_brewed);
        //console.log(beer.food_pairing);

    // Things that need to get pulled from API
        let beerImage = beer.image_url;
        let beerName = beer.name;
        let beerFood = beer.food_pairing;
        let beerDesc = beer.description;
        let beerFirst = beer.first_brewed;

    // Append HTML for the card All Beer Result
    const htmlAppend =
    `<section class="column is-one-third">
        <div class="card card-rounded">
                <div class="card-image">
                    <figure class="image beer-img"><img src="${beerImage}"></figure>
                    <div class="card-content">
                        <div class="media">
                            <div class="media-content">
                                <p class="title beer-text is-5"><mark>${beerName}</mark></p>
                                <p class="subtitle beer-text is-5">${beerFood}</p>
                            </div>
                        </div>
                        <div class="content">
                            <p class="title beer-text is-5">${beerDesc}</p>
                            <br>
                            <time datetime="title is-4 beer-brew 2016-1-1">First Brewed: ${beerFirst}</time>
                        </div>
                    </div>
                </div>
            </div>
        </section>`;

    $(".beer-card").append(htmlAppend);
    });

    const searchAppend = 
    `<div class="subtitle beer-card">Total Search Result: ${totalSearch}</div>`;

    $("#searchTotal").append(searchAppend);
};

app.getBeer = function(food){
// console.log('get a Beer from API');
    $.ajax({
    url: `https://api.punkapi.com/v2/beers?page=1&per_page=80`,
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