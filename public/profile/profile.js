$.get(`/user`)
    .done((response) => {
        $(".username").text('Username: ' + response.response);
    })