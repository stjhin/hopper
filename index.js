//Your asynchronous JavaScript goes here 😎
const app = {};

app.displayBeer = function(queens){
    // console.log(queens);
    // To recycle results
    $(".beer-card").empty();
    // Loop Queen
    beers.forEach(function(queen) {
    const season = queen.seasons[0].id;
    const htmlAppend =
    `<div class="card">
    <div class="card-image">
        <figure class="image is-3by2">
        ${beerImage}
        </figure>
    </div>
    <div class="card-content">
        <div class="media">
        <div class="media-content">
            <p class="title is-4">${beerName}</p>
            <p class="subtitle is-6">${beerTag}</p>
        </div>
        </div>
        <div class="content">
        ${beerDesc}
        <br>
        <time datetime="2016-1-1">First Brewed: ${beerFirst}</time>
        </div>
    </div>
    </div>`;
    $(".beer-card").append(htmlAppend);
    }
)};

app.getBeer = function(seasonNum = 1){
// console.log('get queens from api');
        
    $.ajax({
    url: `https://api.punkapi.com/v2/beers/1 `,
    method: 'GET',
    dataType: 'json'
    }).then(function(result){
    console.log(result);
    app.displayBeer(result);
    })
};

app.init = function (){
    // check to make sure that the app is running
    console.log('app running');
    // Dropdown event listener
    // $('#seasons').on('change', function(){
    // console.log('dropdown updated');
   // const seasonNum = parseInt($(this).val());
  //  console.log(seasonNum);
   // app.getQueens(seasonNum);
   // }); 

}


$(function(){
    app.init();
})