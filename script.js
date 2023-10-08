const searchButton = document.querySelector("#button-cari");

searchButton.addEventListener("click", async function () {
  try {
    const inputKeyword = document.querySelector(".input-keyword");
    const movies = await getMovies(inputKeyword.value);
    updateUI(movies);
  } catch (error) {
    // console.log(error);
    alert(error);
  }
});

function getMovies(keyword) {
  return fetch(`http://www.omdbapi.com/?apikey=cf019bf2&s=${keyword}`)
    .then((response) => {
      if (!response.ok) {
        // response.json();
        throw new Error(response.statusText);
      }
      return response.json();
    })
    .then((response) => {
      if (response.Response === "False") {
        throw new Error(response.Error);
      }
      return response.Search;
    });
}

function updateUI(movies) {
  let cards = "";
  movies.forEach((movie) => (cards += showCard(movie)));
  const movieList = document.querySelector("#movie-list");
  movieList.innerHTML = cards;
}

// event binding(element sebelumnya tidak ada, klo ada jalankan)
document.addEventListener("click", async function (e) {
  try {
    if (e.target.classList.contains("detail-btn")) {
      const imdbid = e.target.dataset.imdbid;
      const movieDetail = await getMoviesDetail(imdbid);
      updateUIDetail(movieDetail);
    }
  } catch (error) {
    alert(error);
  }
});
const modalDetailButton = document.querySelectorAll(".detail-btn");

function getMoviesDetail(imdbid) {
  return fetch(`http://www.omdbapi.com/?apikey=cf019bf2&i=${imdbid}`)
    .then((response) => {
      if (!response.ok) {
        throw new Error(response.statusText);
      }
      return response.json();
    })
    .then((movie) => {
      if (movie.Response === "False") {
        throw new Error(movie.Error);
      }
      return movie;
    });
}

function updateUIDetail(movie) {
  const movieDetail = showDetailCard(movie);
  const modalBody = document.querySelector("#movie-detail");
  modalBody.innerHTML = movieDetail;
}

function showCard(movie) {
  return `<div class="col-md-4 my-5">
            <div class="card">
                <img src="${movie.Poster}" class="card-img-top" alt="${movie.Title}" />
                <div class="card-body">
                    <h5 class="card-title">${movie.Title}</h5>
                    <h6 class="card-subtitle mb-2 text-muted">${movie.Year}</h6>
                    <a href="#" class="btn btn-primary detail-btn" data-toggle="modal"
                        data-target="#detail" data-imdbid="${movie.imdbID}">Show Details</a>
                </div>
            </div>
        </div>`;
}

function showDetailCard(movie) {
  return `<div class="container-fluid">
              <div class="row">
                <div class="col-md-3">
                  <img src="${movie.Poster}" class="img-fluid" alt="${movie.Title}" />
                </div>
                <div class="col-md">
                  <ul class="list-group">
                    <li class="list-group-item"><h4>${movie.Title} (${movie.Year})</h4></li>
                    <li class="list-group-item">
                      <strong>Director : </strong> ${movie.Director}
                    </li>
                    <li class="list-group-item">
                      <strong>Actors : </strong> ${movie.Actors}
                    </li>
                    <li class="list-group-item">
                      <strong>Duration : </strong> ${movie.Runtime}
                    </li>
                    <li class="list-group-item">
                      <strong>Plot : </strong> <br />
                      ${movie.Plot}
                    </li>
                  </ul>
                </div>
              </div>
            </div>`;
}
