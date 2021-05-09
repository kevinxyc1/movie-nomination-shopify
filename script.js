const api = {
    key: '201f5e4',
    base: "http://www.omdbapi.com/?apikey="
}

var nom_count = 0;

var nom_list = []


function fiveNomReached(nom_count) {
    if (nom_count == 5) {
        $('.banner').show()
    } else {
        $('.banner').hide()
    }
}

function removeElement(array, elem) {
    var index = array.indexOf(elem);
    if (index > -1) {
        array.splice(index, 1);
    }
}

//display search results
$(document).ready(function () {
    $('#movieForm').submit(function (e) {
        e.preventDefault()
        var movie = $("#movie").val()
        var url = api.base + api.key
        var count = 0
        
        $.ajax({
            method: 'GET',
            url: url + "&s=" + movie,
            success: function (results) {
                
                console.log(results);
                $(".searchcontainer").empty()
                if (results['Response'] == 'True') {
                    $('.searchcontainer').append(`
                    <div class="oddboxinner"> here is the result:</div>`);
                    for (var i = 0; i < results['Search'].length; i++) {
                        $.ajax({
                            method: 'GET',
                            url: 'https://www.omdbapi.com/?i=' + results['Search'][i]['imdbID'] + '&apikey=' + api.key,
                            success: function (data) {
                                count++
                                
                                res = `
                                <div class="row justify-content-center">
                                    <li class="justify-content-center col-6" value="${data.Title}${data.Year}" id=res${count} seq=${count}>${data.Title} (${data.Year})</li>
                                    <button type="primary" class="btn btn-outline-primary col-4 justify-content-center" value="${data.Title}${data.Year}" id=nom${count} seq=${count}>Nominate</button>
                                </div>`

                                if(nom_list.includes(data.Title+data.Year)){
                                    res = `
                                <div class="row justify-content-center">
                                    <li class="justify-content-center col-6" value="${data.Title}${data.Year}" id=res${count} seq=${count}>${data.Title} (${data.Year})</li>
                                    <button type="primary" class="btn btn-outline-primary col-4 justify-content-center" disabled value="${data.Title}${data.Year}" id=nom${count} seq=${count}>Nominate</button>
                                </div>`
                                }
                                                       
                                $('.searchcontainer').append(res);
                                
                            }
                        })

                    }
                    
                } else {
                    $('.searchcontainer').append(`
                    <div class="oddboxinner"> Invalid search or too many results. Please re-enter :)</div>`);
                }


            }
        })
    })



})

// nominate
$(document).ready(function () {

    $(document).on("click", "[id^=nom]", function (e) {
        e.preventDefault()
        
        if (nom_count < 5 && !nom_list.includes($("#res" + this.id.substring(3)).attr('value'))) {
            nom_count++
            id = this.id.substring(3)
            console.log(id)
            movie_new = $("#res" + id).clone()
            movie_new.attr("id", "final" + id);
            val = $("#res" + id).attr('value')
            nom_list.push(val)
            console.log($("#res" + id).attr('value'));
            $('.nomcontainer .row').append(movie_new);
            btn = `
            <button type="primary" class="btn btn-outline-primary justify-content-center col-4" id=rem${id} value="${val}">Remove</button>
        `
            $('.nomcontainer .row').append(btn);
            $('.searchcontainer .row [value="'+val+'"]').prop('disabled', true);
            setTimeout(function () {
                fiveNomReached(nom_count)
            }, 40)
        }



    })
})

//remove nomination
$(document).ready(function () {
    $(document).on("click", "[id^=rem]", function (e) {
        e.preventDefault()
        val = $(this).attr('value')
        $('.nomcontainer .row [value="'+val+'"]').remove()
        $(this).remove()
        if($('.searchcontainer .row [value="'+val+'"]').length){
            console.log('triggered');
        }
        $('.searchcontainer .row [value="'+val+'"]').prop('disabled', false);
        nom_count--;
        removeElement(nom_list, val);
        setTimeout(function () {
            fiveNomReached(nom_count)
        }, 10)
    })
})
