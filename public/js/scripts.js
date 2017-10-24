$(document).ready(function() {

  $('#myModal').on('shown.bs.modal', function () {
    $('#myInput').focus()
  })

  // Save an article
  $(document).on("click", ".save", function(e){
    e.preventDefault();

    // Get the id of the data attribute from the parent div
    var articleId = $(this).parents('.article-item').data("id");

    // Ajax PUT request for the save route
    $.ajax({
      method: "PUT",
      url: "/save/" + articleId,
    }).then(function(data) {
      if (data.saved) {
        $("[data-id='" + data._id + "']").remove();
      }
    });
  });

  // UnSave an article
  $(document).on("click", ".btn-unsave", function(e){
    e.preventDefault();

    // Get the id of the data attribute from the parent div
    var articleId = $(this).parents('.article-item').data("id");

    // Ajax PUT request for the save route
    $.ajax({
      method: "PUT",
      url: "/unsave/" + articleId,
    }).then(function(data) {
      if (data.saved) {
        $("[data-id='" + data._id + "']").remove();
      }
    });
  });

});