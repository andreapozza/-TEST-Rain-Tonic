const searchBox = document.querySelector('#search input')
if(!localStorage.ratings) localStorage.setItem('ratings', '[]')

fetch('films.json')
.then(response => response.json())
.then(result => {
    result.forEach(film => {
        document.getElementById('main').innerHTML += `
            <div class="element">
                <div class="row1">
                    <span class="title">${film.Title}</span>
                    <div class="valutazioni">
                        <span class="stella" data-rate="1"><i class="far fa-star"></i></span>
                        <span class="stella" data-rate="2"><i class="far fa-star"></i></span>
                        <span class="stella" data-rate="3"><i class="far fa-star"></i></span>
                        <span class="stella" data-rate="4"><i class="far fa-star"></i></span>
                        <span class="stella" data-rate="5"><i class="far fa-star"></i></span>
                    </div>
                </div>
                <div class="hidden detail">
                    <p><b>Year:</b> ${film.Year}</p>
                    <p><b>Rated:</b> ${film.Rated}</p>
                    <p><b>Released:</b> ${film.Released}</p>
                    <p><b>Runtime:</b> ${film.Runtime}</p>
                    <p><b>Genre:</b> ${film.Genre}</p>
                    <p><b>Director:</b> ${film.Director}</p>
                    <p><b>Writer:</b> ${film.Writer}</p>
                    <p><b>Actors:</b> ${film.Actors}</p>
                    <p><b>Plot:</b> ${film.Plot}</p>
                    <p><b>Language:</b> ${film.Language}</p>
                    <p><b>Country:</b> ${film.Country}</p>
                    <p><b>Awards:</b> ${film.Awards}</p>
                    <p><b>Poster:</b> <br><img src="${film.Poster}" width="100" alt="poster"></p>
                    <p><b>Metascore:</b> ${film.Metascore}</p>
                    <p><b>imdbRating:</b> ${film.imdbRating}</p>
                    <p><b>imdbVotes:</b> ${film.imdbVotes}</p>
                    <p><b>imdbID:</b> ${film.imdbID}</p>
                    <p><b>Type:</b> ${film.Type}</p>
                    <p><b>Response:</b> ${film.Response}</p>
                    <p><b>Images:</b> <br>${film.Images.map(url => `<img src="${url}" width="100">`)}</p>
                </div>
                <hr>
            </div>`
    });

    document.querySelectorAll('.title').forEach(titolo => {
        titolo.onclick = () => {
            let row = titolo.parentElement
            row.nextElementSibling.classList.toggle('hidden')
        }
    })

    document.querySelectorAll('.stella').forEach(stella => {
        stella.onclick = () => {
            let canVote = true;
            stella.parentElement.querySelectorAll('.stella i').forEach(star => {
                if(star.classList.contains('fas')) canVote = false;
            })
            if(!canVote) return;
            let titolo = stella.parentElement.previousElementSibling.innerText
            let voto = stella.dataset.rate
            let isConfirmed = confirm("Title: " + titolo + "\nRate: " + voto + "\n\nConfirm?")
            if (isConfirmed) addVote(titolo, voto)
        }
    })


    titles = result.map(el => el.Title)
    console.log(titles)
    searchBox.oninput = () => {
      let typed = searchBox.value
      let results = titles.filter(el => el.substr(0, typed.length).toLowerCase() == typed.toLowerCase())
      console.log(results);
      showAll()
      if (typed != "") showOnly(results)
    }

    updateStars()
    updateStats()

})


function addVote(Title, Vote) {
    
    const ratings = JSON.parse(localStorage.ratings)
    ratings.push({Title, Vote})
    localStorage.ratings = JSON.stringify(ratings)
    updateStars()
    updateStats()
}

function updateStars() {
    const RATINGS = JSON.parse(localStorage.ratings)
    for (element of RATINGS) {
        let {Title, Vote} = element
        document.querySelectorAll('.row1').forEach(row => {
            
            if (row.querySelector('.title').innerText == Title) {
                for (let i = 0; i < Vote; i++) {
                    row.querySelectorAll('.stella i')[i].classList.replace('far', 'fas')
                }
            }
        })
    }
}

function updateStats() {
    const ratings = JSON.parse(localStorage.ratings)
    const totalVotes = +ratings.length
    if (totalVotes == 0) return
    const avg = ratings.reduce((acc, curr) => acc + Number(curr.Vote),0) / totalVotes
    document.getElementById('count').innerText = totalVotes
    document.getElementById('avg').innerText = Math.floor(avg * 10) / 10
}

function showOnly(results) {
    document.querySelectorAll('.element').forEach(el => {
        if(!results.includes(el.getElementsByClassName('title')[0].innerText))
        el.classList.add('hidden')
    })

}

function showAll() {
    document.querySelectorAll('.element').forEach(el => el.classList.remove('hidden'))
}