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
    `<div class="queen-card">
        <h3 class="queen-title">${queen.name}</h3>
        <div class="image-container">
        <img class="queen-image" src=${queen.image_url} alt=${queen.name} />
        </div>
        <h4>Season: ${season} </h4>
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