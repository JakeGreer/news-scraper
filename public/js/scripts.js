$(document).ready(function() {

  $('#myModal').on('shown.bs.modal', function () {
    $('#myInput').focus()
  })

  // Save an article
  $(document).on("click", ".save", function(event){
    event.preventDefault();

    // Get the id of the data attribute from the parent div
    var id = $(this).parents('.article').data("id");

      // Ajax PUT request for the save route
      $.ajax({
        method: "PUT",
        url: "/save/" + id,
      }).then(function(data) {
        if (data) {
          $("[data-id='" + data._id + "']").remove();
        }
      });
  });

  // UnSave an article
  $(document).on("click", ".unsave", function(event){
    event.preventDefault();

    // Get the id of the data attribute from the parent div
    var id = $(this).parents('.article').data("id");

    // Ajax PUT request for the unsave route
    $.ajax({
      method: "PUT",
      url: "/unsave/" + id,
    }).then(function(data) {
      if (data) {
        $("[data-id='" + data._id + "']").remove();
      }
    });
  });

});