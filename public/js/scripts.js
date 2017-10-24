$(document).ready(function() {

  $('#myModal').on('shown.bs.modal', function () {
    $('#myInput').focus()
  })

  // Save an article
  $(document).on("click", ".save", function(e){
    e.preventDefault();

    // Get the id of the data attribute from the parent div
    var id = $(this).parents('.article').data("id");

      // Ajax PUT request for the save route
      $.ajax({
        method: "PUT",
        url: "/save/" + id,
      });
  });

  // UnSave an article
  $(document).on("click", ".unsave", function(e){
    e.preventDefault();

    // Get the id of the data attribute from the parent div
    var id = $(this).parents('.article-item').data("id");

    // Ajax PUT request for the unsave route
    $.ajax({
      method: "PUT",
      url: "/unsave/" + id,
    }).then(function(data) {
      if (data.saved) {
        $("[data-id='" + data._id + "']").remove();
      }
    });
  });

});