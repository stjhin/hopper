//Your asynchronous JavaScript goes here 😎
const app = {};
// Toggle to use local mock data instead of external API
app.useMock = false;
app.mockPath = './mock_beers.json';

// Button - CTA to get Beer Result
$('#beer-cta').click(function(){
    // Check food that is typed into the input form
    const beerFood = $('#beer-input').val();

    // Show Result pulled from API
    // show loading
    $(".beer-card").html('<div class="column">Loading...</div>');
    app.getBeer(beerFood);
});

// Helper: turn OpenAI result items into same shape as Punk API minimal fields
function toBeerObjectsFromOpenAI(items){
    // items expected as array of {name, description, food_pairing}
    return items.map((it, idx) => ({
        id: idx+1,
        name: it.name || it.beer || ('Beer '+(idx+1)),
        description: it.description || '',
        image_url: it.image_url || 'https://via.placeholder.com/150',
        food_pairing: it.food_pairing || (it.pairs_with ? [it.pairs_with] : []) ,
        first_brewed: it.first_brewed || ''
    }));
}

app.getBeerFromOpenAI = async function(food, apiKey){
    // WARNING: Client-side API keys are exposed in the browser. Use at your own risk.
    const prompt = `You are a beer expert. Recommend up to 6 beers that pair well with the food "${food}". For each beer, respond as a JSON object with keys: name, description, food_pairing (array of short strings). Return a JSON array only.`;
    try{
        const resp = await fetch('https://api.openai.com/v1/chat/completions', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
                'Authorization': 'Bearer ' + apiKey
            },
            body: JSON.stringify({
                model: 'gpt-4o-mini',
                messages: [{role: 'user', content: prompt}],
                max_tokens: 600
            })
        });
        if (!resp.ok) throw new Error('OpenAI error: ' + resp.status + ' ' + resp.statusText);
        const data = await resp.json();
        // Chat completions return choices[0].message.content
        const content = data.choices && data.choices[0] && data.choices[0].message && data.choices[0].message.content;
        if (!content) throw new Error('No content from OpenAI');
        // Try to extract JSON array from the content
        let jsonText = content.trim();
        // Find first '[' and last ']' to extract JSON
        const start = jsonText.indexOf('[');
        const end = jsonText.lastIndexOf(']');
        if (start === -1 || end === -1) {
            // fallback: try to parse as single object
            throw new Error('OpenAI returned non-JSON response');
        }
        jsonText = jsonText.substring(start, end+1);
        const parsed = JSON.parse(jsonText);
        const beers = toBeerObjectsFromOpenAI(parsed);
        app.displayBeer(beers);
    } catch (err) {
        console.error('OpenAI error', err);
        $(".beer-card").html('<div class="column has-text-danger">OpenAI error: '+err.message+'</div>');
        $("#searchTotal").html('<div class="subtitle">Total Search Result: 0</div>');
    }
}



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
    let beerImage = beer.image_url || 'https://via.placeholder.com/150';
    let beerName = beer.name || 'Unknown';
    // food_pairing may be an array
    let beerFood = Array.isArray(beer.food_pairing) ? beer.food_pairing.join(', ') : (beer.food_pairing || '');
    let beerDesc = beer.description || '';
    let beerFirst = beer.first_brewed || '';

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
    if (app.useMock) {
        // Load local mock JSON
        $.getJSON(app.mockPath).done(function(result){
            // simple filter by food term (case-insensitive) matching in name, description, or food_pairing
            const term = (food || '').toLowerCase();
            const filtered = result.filter(b => {
                if (!term) return true;
                const inName = (b.name || '').toLowerCase().includes(term);
                const inDesc = (b.description || '').toLowerCase().includes(term);
                const inFood = (b.food_pairing || []).join(' ').toLowerCase().includes(term);
                return inName || inDesc || inFood;
            });
            app.displayBeer(filtered);
        }).fail(function(){
            $(".beer-card").html('<div class="column has-text-danger">Error loading mock data</div>');
        });
        return;
    }
    $.ajax({
    // Updated to Punk API v3 (see https://github.com/alxiw/punkapi)
    url: `https://punkapi.online/v3/beers?page=1&per_page=80`,
    method: 'GET',
    dataType: 'json',
    data: {
        food: food
    }
    }).done(function(result){
        // v3 returns similar beer objects but the image field may be named `image` instead of `image_url`.
        // Normalize results so displayBeer can work with either shape.
        const normalized = result.map(b => ({
            id: b.id,
            name: b.name,
            description: b.description,
            // prefer image_url, fallback to image, then placeholder
            image_url: b.image_url || b.image || 'https://via.placeholder.com/150',
            food_pairing: b.food_pairing || b.foods || b.pairings || [],
            first_brewed: b.first_brewed || b.firstBrewed || ''
        }));
        app.displayBeer(normalized);
    }).fail(function(jqXHR, textStatus, errorThrown){
        console.error('API error', textStatus, errorThrown);
        $(".beer-card").html('<div class="column has-text-danger">Error fetching beers: '+textStatus+'</div>');
        $("#searchTotal").html('<div class="subtitle">Total Search Result: 0</div>');
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