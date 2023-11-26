$(document).ready(function () {

  let globalMoviesData = [];

  // Бургер
  $(".navbar-burger").click(function () {
    $(".navbar-active, .navbar-burger").toggleClass("is-active");
  });

  // Модальное окно
  $(".modal-active").click(function () {
    $(".modal-movie").toggleClass("is-active");
  });

  $(".modal-delete, .modal-cancel, .modal-close").click(function () {
    $(".modal").removeClass("is-active");
  });

  // Карусель
  const initCarousel = () => {
    let currentCarousel = 0;
    const carousel = $('#carousel');
    const carouselItems = $('.carousel');
    const prevImage = $('#prev-image');
    const nextImage = $('#next-image');

    function updateCarousel() {
      const translateValue = -currentCarousel * 100 + '%';
      carousel.css('transform', 'translateX(' + translateValue + ')');
    }

    function updateSideImages() {
      const prevImageSrc = (currentCarousel - 1 + carouselItems.length) % carouselItems.length;
      const nextImageSrc = (currentCarousel + 1) % carouselItems.length;

      prevImage.attr('src', carouselItems.eq(prevImageSrc).find('img').attr('src'));
      nextImage.attr('src', carouselItems.eq(nextImageSrc).find('img').attr('src'));
    }

    function handleClick() {
      $(this).attr('id') === 'prev' || $(this).attr('id') === 'prev-image' ? currentCarousel = (currentCarousel - 1 + carouselItems.length) % carouselItems.length : currentCarousel = (currentCarousel + 1) % carouselItems.length;
      updateCarousel();
      updateSideImages();
    }

    $('#prev, #next, #prev-image, #next-image').on('click', handleClick);

    updateSideImages();
  };


  // Подтекст
  const TypedText = (text, targetElementId) => {
    var charCount = 0;

    function typeText() {
      var slice = text.slice(0, charCount++);
      $(`#${targetElementId}`).text(slice);

      if (charCount <= text.length) {
        setTimeout(typeText, 10);
      }
    }

    typeText();
  };

  // Обработка AJAX
  const fetchData = async (url) => {
    try {
      const response = await fetch('http://localhost:3000' + url);
      const data = await response.json();
      var text = data.message;
      return text

    } catch (error) {
      console.error('Ошибка:', error);
    }
  };

  const populateTableMovie = (moviesData) => {
    globalMoviesData = moviesData;

    const tableBody = $('.movie');
    tableBody.empty()
    const row = $('<tr>');

    if (moviesData.length === 0) {
      row.html(`
        <td></td>
        <td></td>
        <td id="titleCell" class="has-text-weight-bold link"><span>Ничего не найдено</span></td>
      `);
      tableBody.append(row);
    }
    else {
      moviesData.forEach((movie) => {
        const row = $('<tr>');
        row.html(`
        <td id="${movie['Movie ID']}" class="link">${movie['Movie ID']}</td>
        <td><figure class="image is-3by4 link"><img src="${movie['Image URL']}" alt="${movie.title}"></figure></td>
        <td id="titleCell" class="has-text-weight-bold link"><span>${movie.Title}</span></td>
        <td id="titleCell"><span>${movie.Director}</span></td>
        <td id="titleCell"><span>${movie['Release Date']}</span></td>
        <td id="titleCell"><span>${movie.Rating}</span></td>
        <td id="titleCell"><span>${movie.Genre}</span></td>
        <td id="titleCell" class="text-small"><span>${movie.Actors}</span></td>
      `);

        row.find('.link').click(async function () {
          const movieId = movie['Movie ID'];

          try {
            const review = await fetchData(`/api/review/${movieId}`);
            if (review) {
              $("#review-image-url").attr("src", review[0]['Image URL']);
              $("#review-title").text(review[0].Title);
              $("#review-text").text(review[0].Text);
              $("#review-date").text(review[0].Date);

              $("#reviewModal").addClass("is-active");
            } else {
              console.error('Review data is empty or not available.');
            }
          } catch (error) {
            console.error('Error fetching review data:', error);
          }
        });

        tableBody.append(row);

      })
    };

    $("#href-movie, .href-movie").on("click", function (e) {
      e.preventDefault();
      $(".hidder-b").show();
      $(".hidder-a").hide();
    })

    $("#href-review, .href-review").on("click", function (e) {
      e.preventDefault();
      $(".hidder-a").show();
      $(".hidder-b").hide();
    })

    $("#href-main, .href-main").on("click", function (e) {
      e.preventDefault();
      $(".hidder-a, .hidder-b").show();
    })

    $('[id="titleCell"]').each(function () {
      const $this = $(this);
      const originalText = $this.text();
      const truncatedText = originalText.length > 50 ? originalText.slice(0, 50) + '...' : originalText;
      $this.text(truncatedText);
      $this.data('original-text', originalText);
    });

    $('[id="titleCell"]').click(function () {
      const $this = $(this);
      const originalText = $this.data('original-text') || $this.text();
      const isTruncated = $this.data('is-truncated') || false;

      if (!isTruncated) {
        $this.text(originalText);
        $this.data('is-truncated', true);
      } else {
        $this.data('original-text', originalText);
        const truncatedText = originalText.length > 50 ? originalText.slice(0, 50) + '...' : originalText;
        $this.text(truncatedText);
        $this.data('is-truncated', false);
      }
    });
  };

  const populateTableReview = (review) => {
    const reviewBody = document.querySelector('#review');
    reviewBody.innerHTML = `<h1 class='title mt-5'>
    <strong class="has-text-white">Случайная рецензия</strong>
    </h1>`;
    const newDiv = document.createElement('div');
    newDiv.classList.add('tile', 'is-ancestor', 'review-container');

    newDiv.innerHTML = `
    <div class="tile is-4 is-vertical is-parent">
    <div class="tile is-child box has-background-white-ter">
      <figure class="image is-3by4">
        <img src="${review['Image URL']}">
      </figure>
    </div>
    <div class="tile is-child box has-background-white-ter"><p class="subtitle"><strong>Время публикации: </strong>${review.Date}</p></div>
    <div class="tile is-child has-background-transparent has-text-centered"><a class="regenerate-button">Перегенерировать</a></div>
    <div class="tile is-child has-background-transparent"></div>
    <div class="tile is-child has-background-transparent"></div>
    <div class="tile is-child has-background-transparent"></div>
    <div class="tile is-child has-background-transparent"></div>
    <div class="tile is-child has-background-transparent"></div>
    <div class="tile is-child has-background-transparent"></div>
    </div>
    <div class="tile is-parent">
    <div class="tile is-child box has-background-white-ter">
      <p class="title">${review.Title}</p>
      <p class="subtitle text">${review.Text}</p>
    </div>
    </div>
    `;
    reviewBody.appendChild(newDiv);

    const regenerateButton = newDiv.querySelector('.regenerate-button');
    regenerateButton.addEventListener('click', async () => {
      await handleRegenerateReview();
    });
  };

  const handleRegenerateReview = async () => {
    try {
      const reviewData = await fetchData('/api/review');
      populateTableReview(reviewData[0]);
    } catch (error) {
      console.error('Ошибка:', error);
    }
  };


  const populateMovieSelect = (moviesData) => {
    const movieSelect = document.getElementById('movieSelect');
    movieSelect.innerHTML = '';

    const availableMovies = moviesData.filter(movie => !movie.is_reviewed);

    if (availableMovies.length === 0) {
      const option = document.createElement('option');
      option.textContent = 'Нет доступных фильмов';
      option.disabled = true;
      movieSelect.appendChild(option);
    } else {
      availableMovies.forEach((movie) => {
        const option = document.createElement('option');
        option.value = movie["Movie ID"];
        option.textContent = movie.Title;
        movieSelect.appendChild(option);
      });
    }
  };

  const populateGenresDropdown = (genres) => {
    const genresDropdown = document.getElementById('genresDropdown');
    genresDropdown.innerHTML = '';

    genres.forEach((genre) => {
      const genreItem = document.createElement('a');
      genreItem.className = 'navbar-item';
      genreItem.textContent = genre.name;

      genreItem.addEventListener('click', async () => {
        try {
          $('.loadingIndicator').removeClass('is-hidden');
          const textData = await fetchData(`/api/movies/search_by_genre/${genre.id}`);
          $('.movie').html("")
          populateTableMovie(textData);
        } finally {
          $('.loadingIndicator').addClass('is-hidden');
        }
      });

      genresDropdown.appendChild(genreItem);
    });
  };

  const handleDataFetch = async () => {
    try {
      const textData = await fetchData('/api/index');
      const carousel = document.querySelector('#carousel');
      TypedText(textData[0], 'typedText');

      textData[1].forEach((data) => {
        const newDiv = $('<div>').addClass('carousel');
        newDiv.html(`<a href="#${data.id}"><img src="${data.image_url}" class="link"></a>`);
        $('#carousel').append(newDiv);

        newDiv.find('.link').click(async function () {
          const movieId = data.id;

          try {
            const review = await fetchData(`/api/review/${movieId}`);
            if (review) {
              $("#review-image-url").attr("src", review[0]['Image URL']);
              $("#review-title").text(review[0].Title);
              $("#review-text").text(review[0].Text);
              $("#review-date").text(review[0].Date);

              $("#reviewModal").addClass("is-active");
            } else {
              console.error('Review data is empty or not available.');
            }
          } catch (error) {
            console.error('Error fetching review data:', error);
          }
        });

        initCarousel();
      });

      const moviesData = await fetchData('/api/movies');
      const reviewData = await fetchData('/api/review');
      const genres = await fetchData('/api/genres');
      populateTableMovie(moviesData);
      populateTableReview(reviewData[0]);
      populateMovieSelect(moviesData);
      populateGenresDropdown(genres);

    } catch (error) {
      console.error('Ошибка при получении данных:', error);
    }
  };

  $('#populateButton').click(async function () {
    try {
      $('.loadingIndicator').removeClass('is-hidden');
      const moviesData = await fetchData('/api/movies');
      $('.movie').html("")
      populateTableMovie(moviesData);

    } catch (error) {
      console.error(error);

    } finally {
      $('.loadingIndicator').addClass('is-hidden');
    }
  });

  (async () => {
    await handleDataFetch();
  })();

  $("#send-review").click(async function () {
    const movieId = $("#movieSelect").val();
    const text = $("#review_text").val();
    $(".modal").removeClass("is-active");
    try {
      const response = await fetch('http://localhost:3000/api/create/review', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          movie_id: parseInt(movieId),
          text: text,
        }),
      });

      let alertMessage;

      if (response.ok) {
        const updatedMoviesData = await fetchData('/api/movies');
        populateMovieSelect(updatedMoviesData);
        alertMessage = 'Рецензия успешно добавлена';
      } else {
        const errorResponse = await response.json();
        alertMessage = 'Ошибка при добавлении рецензии: ' + JSON.stringify(errorResponse);
      }

      alert(alertMessage);

    } catch (error) {
      alert('Ошибка: ' + error);
    }
  });

  $("#send-movie").click(async function () {
    const title = $("#movie").val();
    const director = $("#director").val();
    const actors = $("#actors").val();
    const releaseDate = $("#releaseDate").val();
    const rating = $("#rating").val();
    const genres = $("#genres").val();
    const url = $("#url").val();
    $(".modal").removeClass("is-active");

    try {
      const response = await fetch('http://localhost:3000/api/create/movie', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          title: title,
          director: director,
          actors: actors,
          release_date: releaseDate,
          rating: parseFloat(rating),
          genres: genres.split(',').map(genre => {
            const trimmedGenre = genre.trim();
            return trimmedGenre.charAt(0).toUpperCase() + trimmedGenre.slice(1).toLowerCase();
          }),
          url: url
        }),
      });

      let alertMessage;

      if (response.ok) {
        const updatedMoviesData = await fetchData('/api/movies');
        populateMovieSelect(updatedMoviesData);
        alertMessage = 'Фильм успешно добавлен';
      } else {
        const errorResponse = await response.json();
        console.error(errorResponse);
        alertMessage = 'Ошибка при добавлении фильма: ' + JSON.stringify(errorResponse);
      }

      alert(alertMessage);

    } catch (error) {
      alert('Ошибка: ' + error);
    }
  });

  $("#query").on('click', function () {
    $("#search").focus();
  });

  $("#search").on('focus', function () {
    const result = $('#searchResults');
    result.css("display", "block");
  });

  $("#search").on('blur', function () {
    resultTimeout = setTimeout(function () {
      const result = $('#searchResults');
      result.css("display", "none");
    }, 200);
  });

  $("#search").on('input', async function () {
    const query = $(this).val();
    const response = await fetchData(`/api/movies/search/${query}`);
    const result = $('#searchResults');
    result.empty();

    response.forEach((data) => {
      const newDiv = $('<p>');
      const newLink = $('<a>').attr('href', `#${data["Movie ID"]}`).text(data.Title).addClass('newLink');
      newDiv.append(newLink);
      result.append(newDiv);
    });

    $('.newLink').click(async function () {
      const movieId = $(this).attr('href').substring(1);

      try {
        const review = await fetchData(`/api/review/${movieId}`);
        if (review) {
          $("#review-image-url").attr("src", review[0]['Image URL']);
          $("#review-title").text(review[0].Title);
          $("#review-text").text(review[0].Text);
          $("#review-date").text(review[0].Date);

          $("#reviewModal").addClass("is-active");
        } else {
          console.error('Review data is empty or not available.');
        }
      } catch (error) {
        console.error('Error fetching review data:', error);
      }
    });
  });

  $("#modalTypeSelect").change(async function () {
    const isMovie = $("#modalTypeSelect").val() === 'movie';
    $("#movieFieldsContainer").css('display', isMovie ? 'block' : 'none');
    $("#reviewFieldsContainer").css('display', isMovie ? 'none' : 'block');
  });

  $('#searchResults').css({
    'width': $(".search-element-1").width() + $(".search-element-2").width() + 'px',
    'transform': 'translateY(' + $(".search").height() + 'px)'
  });

  setInterval(function () {
    var urlHash = window.location.hash.substr(1);

    if (urlHash) {
      $('.highlighted').removeClass('highlighted');

      var elementToHighlight = $('#' + urlHash);
      if (elementToHighlight.length > 0) {
        elementToHighlight.addClass('highlighted');
        var parentElement = elementToHighlight.parent();
        if (parentElement.length > 0) {
          parentElement.addClass('highlighted');
        }
      }
    }
  }, 1000);

  function sortData(sortOrder) {
    globalMoviesData.sort((a, b) => {
      const valueA = a;
      const valueB = b;

      if (sortOrder === 'asc') {
        return valueA > valueB ? 1 : -1;
      } else {
        return valueA < valueB ? 1 : -1;
      }
    });
    populateTableMovie(globalMoviesData);
  }

  const sortButtons = document.querySelectorAll('.sort-btn');

  sortButtons.forEach((button) => {
    button.addEventListener('click', function () {
      const sortOrder = button.classList.contains('asc') ? 'desc' : 'asc';

      sortButtons.forEach((btn) => {
        if (btn !== button) {
          btn.classList.remove('asc', 'desc');
        }
      });
      button.classList.toggle('asc', sortOrder === 'asc');
      button.classList.toggle('desc', sortOrder === 'desc');
      button.innerHTML = sortOrder === 'asc' ? '▲' : '▼';
      sortData(sortOrder);
    });
  });
});