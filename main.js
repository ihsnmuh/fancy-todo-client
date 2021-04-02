function showLoginPage() {
  console.log("Login");
  // sebelum melakukan Login
  $("#form-login").fadeIn("slow");
  $("#form-register").hide();
  $("#todo-container").hide();
  $("#form-addTodos").hide();
  $("#form-editTodos").hide();
  $("#form-viewTodos").hide();

  // batas menu
  $("#menu-login").show();
  $("#menu-register").show();
  $("#menu-home").hide();
  $("#menu-logout").hide();
}

function showRegisterPage() {
  console.log("Register");
  // sebelum melakukan Login
  $("#form-login").hide();
  $("#form-register").fadeIn("slow");
  $("#todo-container").hide();
  $("#form-addTodos").hide();
  $("#form-editTodos").hide();
  $("#form-viewTodos").hide();

  // batas menu
  $("#menu-login").show();
  $("#menu-register").show();
  $("#menu-home").hide();
  $("#menu-logout").hide();
}

function showHomePage() {
  console.log("Home Todo");
  // setelah melakukan login
  $("#form-login").hide();
  $("#form-register").hide();
  $("#todo-container").fadeIn("slow");
  $("#form-addTodos").hide();
  $("#form-editTodos").hide();
  $("#form-viewTodos").hide();

  // batas menu
  $("#menu-login").hide();
  $("#menu-register").hide();
  $("#menu-home").show();
  $("#menu-logout").show();
}

function showAddTodoPage() {
  console.log("Add Todo");
  // setelah melakukan login
  $("#form-login").hide();
  $("#form-register").hide();
  $("#todo-container").hide();
  $("#form-addTodos").fadeIn("slow");
  $("#form-editTodos").hide();
  $("#form-viewTodos").hide();

  // batas menu
  $("#menu-login").hide();
  $("#menu-register").hide();
  $("#menu-home").show();
  $("#menu-logout").show();
}

function showEditTodoPage() {
  console.log("Form Edit Todo");
  // setelah melakukan login
  $("#form-login").hide();
  $("#form-register").hide();
  $("#todo-container").hide();
  $("#form-addTodos").hide();
  $("#form-editTodos").fadeIn("slow");
  $("#form-viewTodos").hide();
  // batas menu
  $("#menu-login").hide();
  $("#menu-register").hide();
  $("#menu-home").show();
  $("#menu-logout").show();
}

function showViewTodoPage() {
  console.log("Form View Todo");
  // setelah melakukan login
  $("#form-login").hide();
  $("#form-register").hide();
  $("#todo-container").hide();
  $("#form-addTodos").hide();
  $("#form-editTodos").hide();
  $("#form-viewTodos").show();
  // batas menu
  $("#menu-login").hide();
  $("#menu-register").hide();
  $("#menu-home").show();
  $("#menu-logout").show();
}

function onSignIn(googleUser) {
  // google Login
  const id_token = googleUser.getAuthResponse().id_token;

  $.ajax({
    method: "POST",
    url: "http://localhost:3000/user/googleLogin",
    data: {
      id_token,
    },
  })
    .done((response) => {
      localStorage.setItem("access_token", response.access_token);
      showHomePage();
      fatchDataTodos();
    })
    .fail((err) => {
      console.log(err);
    });
}

function editTodosById(event, id) {
  event.preventDefault();
  $(".editTodos").empty();

  $.ajax({
    method: "GET",
    url: `http://localhost:3000/todos/${id}`,
    headers: {
      access_token: localStorage.getItem("access_token"),
    },
  })
    .done((response) => {
      showEditTodoPage();
      console.log(response);
      let selectNotFinished;
      let selectOngoing;
      let selectFinished;
      if (response.status == "notFinished") {
        selectNotFinished = "selected";
      } else if (response.status == "ongoing") {
        selectOngoing = "selected";
      } else {
        selectFinished = "selected";
      }
      let due_date = response.due_date.split("T");
      $(".editTodos").append(`
        <form id="edit-todo">
          <div class="mb-3 mt-3">
            <label for="title-form-editTodo" class="form-label" style="font-weight: bold; color: white">Title :</label>
            <input type="text" class="form-control" id="title-form-editTodo" value="${response.title}" required>
          </div>
          <div class="row">
            <div class="mb-3 col-6">
              <label for="status-form-editTodo" class="form-label" style="font-weight: bold; color: white">Status :</label>
              <select id="status-form-editTodo" class="form-select" required>
                <option>--- Choose Status ---</option>
                <option value="notFinished" ${selectNotFinished}>Not Finished</option>
                <option value="ongoing" ${selectOngoing}>Ongoing</option>
                <option value="finished" ${selectFinished}>Finished</option>
              </select>
            </div>
            <div class="mb-3 col-6">
              <label for="status-form-editTodo" class="form-label" style="font-weight: bold; color: white">Due Date: </label>
              <input type="date" class="form-control" id="date-form-editTodo" value="${due_date[0]}" required>
            </div>
          </div>
          <div class="mb-3">
            <label for="description-form-editTodo" class="form-label" style="font-weight: bold; color: white">Description :</label>
            <textarea class="form-control" id="description-form-editTodo" rows="3" required>${response.description}</textarea>
          </div>
          <div class="d-grid gap-2">
            <Button class="btn btn-warning" type="submit" onclick="updateTodosById(event, ${response.id})" style="font-weight: bold; color: white">Update Todo !</Button>
         </div>
        </form>
        <Button class="btn btn-danger col-12 mt-2" onclick="showHomePage()" style="font-weight: bold; color: white">Cancel</Button>
      `);
    })
    .fail((err) => {
      console.log(err);
    });
}

function updateTodosById(event, id) {
  event.preventDefault();
  const title = $("#title-form-editTodo").val();
  const description = $("#description-form-editTodo").val();
  const due_date = $("#date-form-editTodo").val();
  const status = $("#status-form-editTodo").val();

  $.ajax({
    method: "PUT",
    url: `http://localhost:3000/todos/${id}`,
    data: {
      title,
      description,
      due_date,
      status,
    },
    headers: {
      access_token: localStorage.getItem("access_token"),
    },
  })
    .done((response) => {
      showHomePage();
      fatchDataTodos();
    })
    .fail((err) => {
      console.log(err);
    });
}

function deleteTodosById(event, id) {
  event.preventDefault();

  $.ajax({
    method: "DELETE",
    url: `http://localhost:3000/todos/${id}`,
    headers: {
      access_token: localStorage.getItem("access_token"),
    },
  })
    .done((response) => {
      showHomePage();
      fatchDataTodos();
    })
    .fail((err) => {
      console.log(err);
    });
}

function viewTodosById(event, id) {
  event.preventDefault();
  $("#todo-detail").empty();

  $.ajax({
    method: "GET",
    url: `http://localhost:3000/todos/${id}`,
    headers: {
      access_token: localStorage.getItem("access_token"),
    },
  })
    .done((response) => {
      showViewTodoPage();
      console.log(response);
      let selectNotFinished;
      let selectOngoing;
      let selectFinished;
      if (response.status == "notFinished") {
        selectNotFinished = "selected";
      } else if (response.status == "ongoing") {
        selectOngoing = "selected";
      } else {
        selectFinished = "selected";
      }
      let due_date = response.due_date.split("T");
      $("#todo-detail").append(`
        <form id="edit-todo">
          <div class="mb-3 mt-3">
            <label for="title-form-editTodo" class="form-label" style="font-weight: bold; color: white">Title :</label>
            <input type="text" class="form-control" id="title-form-editTodo" value="${response.title}" disabled>
          </div>
          <div class="row">
            <div class="mb-3 col-6">
              <label for="status-form-editTodo" class="form-label" style="font-weight: bold; color: white">Status :</label>
              <select id="status-form-editTodo" class="form-select" disabled>
                <option>--- Choose Status ---</option>
                <option value="notFinished" ${selectNotFinished}>Not Finished</option>
                <option value="ongoing" ${selectOngoing}>Ongoing</option>
                <option value="finished" ${selectFinished}>Finished</option>
              </select>
            </div>
            <div class="mb-3 col-6">
              <label for="status-form-editTodo" class="form-label" style="font-weight: bold; color: white">Due Date: </label>
              <input type="date" class="form-control" id="date-form-editTodo" value="${due_date[0]}" disabled>
            </div>
          </div>
          <div class="mb-3">
            <label for="description-form-editTodo" class="form-label" style="font-weight: bold; color: white">Description :</label>
            <textarea class="form-control" id="description-form-editTodo" rows="3" disabled>${response.description}</textarea>
          </div>
        </form>
      `);
    })
    .fail((err) => {
      console.log(err);
    });
}

function fatchDataTodos() {
  // memunculkan seluruh data Todos
  $.ajax({
    method: "GET",
    url: "http://localhost:3000/todos",
    headers: {
      access_token: localStorage.getItem("access_token"),
    },
  })
    .done((response) => {
      $("#todos").empty(); // sebelum dimasukan jangan lupa dikosongin dahulu biar ga double
      console.log(response);
      let selected;
      let button;
      let statusNew;
      response.forEach((element) => {
        if (element.status == "finished") {
          selected = `background-color: #20c997; color:white;`;
          button = "";
          statusNew = "(Finished)";
        } else if (element.status == "ongoing") {
          selected = `background-color: #FFDA6A; color:white;`;
          button = "";
          statusNew = "(Ongoing)";
        } else {
          selected = "";
          button = `-outline`;
          statusNew = "";
        }
        $("#todos").append(`
        <div class="card mt-2">
          <div class="card-body" style="${selected}">
            <div class="row">
              <div class="col-7">
                ${element.title} ${statusNew}
                </div>
                <div class="ml-5 col-5">
                <button class="btn btn${button}-info" onclick="viewTodosById(event,${element.id})">View</button>
                <button class="btn btn${button}-warning" onclick="editTodosById(event,${element.id})" >Edit</button>
                <button class="btn btn${button}-danger" onclick="deleteTodosById(event,${element.id})" >Delete</button>
              </div>
            </div>
          </div>
        </div>
        `);
      });
    })
    .fail((err) => {
      console.log(err);
    });
}

// Batas Fuction =================================================================

$(document).ready(function () {
  if (localStorage.getItem("access_token")) {
    showHomePage();
    fatchDataTodos(); //ketika di refresh
  } else {
    showLoginPage();
  }

  // Batas Button action Input
  $("#login").on("submit", function (event) {
    event.preventDefault(); // biar ngga refresh page
    const email = $("#email-login").val();
    const password = $("#password-login").val();

    $.ajax({
      method: "POST",
      url: "http://localhost:3000/user/login",
      data: {
        email,
        password,
      },
    })
      .done((response) => {
        localStorage.setItem("access_token", response.access_token);
        showHomePage();
        fatchDataTodos(); //jangan lupa ketika refresh panggil lagi datanya
      })
      .fail((err) => {
        console.log(err); // error masih console
      })
      .always(() => {
        $("#email-login").val("");
        $("#password-login").val("");
      });
  });

  $("#register").on("submit", function (event) {
    event.preventDefault(); // biar ngga refresh page
    const email = $("#email-register").val();
    const username = $("#username-register").val();
    const password = $("#password-register").val();

    $.ajax({
      method: "POST",
      url: "http://localhost:3000/user/register",
      data: {
        email,
        username,
        password,
      },
    })
      .done((response) => {
        showLoginPage();
      })
      .fail((err) => {
        console.log(err);
      })
      .always(() => {
        $("#email-register").val("");
        $("#username-register").val("");
        $("#password-register").val("");
      });
  });

  $("#add-todo").on("submit", function (event) {
    event.preventDefault();
    const title = $("#title-form-addTodo").val();
    const description = $("#description-form-addTodo").val();
    const due_date = $("#date-form-addTodo").val();
    const status = $("#status-form-addTodo").val();

    $.ajax({
      method: "POST",
      url: "http://localhost:3000/todos",
      data: {
        title,
        description,
        due_date,
        status,
      },
      headers: {
        access_token: localStorage.getItem("access_token"),
      },
    })
      .done((response) => {
        showHomePage();
        fatchDataTodos();
      })
      .fail((err) => {
        console.log(err);
      })
      .always(() => {
        $("#title-form-addTodo").val(" ");
        $("#description-form-addTodo").val(" ");
        $("#date-form-addTodo").val(" ");
        $("#status-form-addTodo").val();
      });
  });

  // Batas Button action Pindah
  $("#menu-login").click(function () {
    showLoginPage();
  });

  $("#menu-register").click(function () {
    showRegisterPage();
  });

  $("#menu-logout").click(function () {
    localStorage.clear();
    const auth2 = gapi.auth2.getAuthInstance(); // menghilngkan akses google
    auth2.signOut().then(function () {
      console.log("User signed out.");
    });
    showLoginPage();
  });

  $("#btn-add-todo").click(function () {
    showAddTodoPage();
  });
});
