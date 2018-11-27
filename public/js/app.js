const socket = io();

$(document).on("click", ".changeTodo", checkToggle);
$(document).on("click", ".deleteTodo", deleteTodo);

const render = function() {
  $(".todoGrid").html("");
  $.ajax({ url: "/api/todos", method: "GET" }).then(function(data) {
    data.forEach(e => {
      if (e.complete === true) {
        falseRender(e);
      } else {
        trueRender(e);
      }
    });
  });
};

function falseRender(data) {
  $(".todoGrid").append(
    $("<div>")
      .addClass("textButton")
      .append(
        $("<div>")
          .addClass("todoContent buttonChild")
          .append(
            $("<button>")
              .addClass("change")
              .addClass("far fa-dot-circle deleteTodo")
              .attr("data-id", data.id)
          ),
        $("<div>")
          .addClass("todoContent textChild")
          .append(
            $("<p>")
              .text(data.text)
              .addClass("changeTodo ")
              .addClass("grey")
              .attr("data-id", data.id)
              .attr("data-whole", data.complete)
          )
      )
  );
}
function trueRender(data) {
  $(".todoGrid").append(
    $("<div>")
      .addClass("textButton")
      .append(
        $("<div>")
          .addClass("todoContent buttonChild")
          .append(
            $("<button>")
              .addClass("change")
              .addClass("far fa-circle nothingTodo")
              .attr("data-id", data.id)
          ),
        $("<div>")
          .addClass("todoContent textChild")
          .append(
            $("<p>")
              .text(data.text)
              .addClass("changeTodo ")
              .attr("data-id", data.id)
              .attr("data-whole", data.complete)
          )
      )
  );
}

function checkToggle() {
  const toggBool = $(this).data("whole");
  const toggId = $(this).data("id");
  console.log(toggBool);
  console.log(!toggBool);
  const newData = {
    id: toggId,
    complete: !toggBool
  };
  $.ajax({ url: "/api/todos", method: "PUT", data: newData }).then(function() {
    socket.emit("new-change");
  });
}

$("#todoInput").keypress(function(e) {
  if (e.keyCode === 13) {
    const todo = $("#todoInput").val();
    const newData = {
      text: todo
    };
    $.ajax({ url: "/api/todos", method: "POST", data: newData }).then(
      function() {
        socket.emit("new-change");
      }
    );
    $("#todoInput").val("");
  }
});

function deleteTodo(e) {
  e.preventDefault();
  const deleteId = $(this).data("id");
  console.log(deleteId);
  const deleteTodo = {
    id: deleteId
  };

  $.ajax({ url: `/api/todos/`, method: "DELETE", data: deleteTodo }).then(
    function() {
      socket.emit("new-change");
    }
  );
}
socket.on("emit-change", function() {
  render();
});
render();
