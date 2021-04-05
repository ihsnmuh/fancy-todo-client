const baseUrl = "https://fancy-todosmu.herokuapp.com";

function showLoginPage() {
  console.log("Login");
  // sebelum melakukan Login
  $("#form-login").fadeIn("slow");
  $("#form-register").hide();
  $("#todo-container").hide();
  $("#form-addTodos").hide();
  $("#form-editTodos").hide();
  $("#form-viewTodos").hide();
  $("#randomActivity").hide();

  // batas menu
  $("#menu-login").show();
  $("#menu-register").show();
  $("#menu-home").hide();
  $("#menu-logout").hide();
  $("#menu-randomActivity").hide();
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
  $("#randomActivity").hide();

  // batas menu
  $("#menu-login").show();
  $("#menu-register").show();
  $("#menu-home").hide();
  $("#menu-logout").hide();
  $("#menu-randomActivity").hide();
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
  $("#randomActivity").hide();

  // batas menu
  $("#menu-login").hide();
  $("#menu-register").hide();
  $("#menu-home").show();
  $("#menu-logout").show();
  $("#menu-randomActivity").show();
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
  $("#randomActivity").hide();

  // batas menu
  $("#menu-login").hide();
  $("#menu-register").hide();
  $("#menu-home").show();
  $("#menu-logout").show();
  $("#menu-randomActivity").show();
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
  $("#randomActivity").hide();

  // batas menu
  $("#menu-login").hide();
  $("#menu-register").hide();
  $("#menu-home").show();
  $("#menu-logout").show();
  $("#menu-randomActivity").show();
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
  $("#randomActivity").hide();

  // batas menu
  $("#menu-login").hide();
  $("#menu-register").hide();
  $("#menu-home").show();
  $("#menu-logout").show();
  $("#menu-randomActivity").show();
}

function showRandomActivity() {
  console.log("Form View Todo");
  // setelah melakukan login
  $("#form-login").hide();
  $("#form-register").hide();
  $("#todo-container").hide();
  $("#form-addTodos").hide();
  $("#form-editTodos").hide();
  $("#form-viewTodos").hide();
  $("#randomActivity").show();

  // batas menu
  $("#menu-login").hide();
  $("#menu-register").hide();
  $("#menu-home").show();
  $("#menu-logout").show();
  $("#menu-randomActivity").show();
}

function onSignIn(googleUser) {
  // google Login
  const id_token = googleUser.getAuthResponse().id_token;

  $.ajax({
    method: "POST",
    url: baseUrl + "/user/googleLogin",
    data: {
      id_token,
    },
  })
    .done((response) => {
      localStorage.setItem("access_token", response.access_token);
      showHomePage();
      fatchDataTodos();
      notifSuccess("Login");
    })
    .fail((err) => {
      console.log(err);
      notifError(err.responseJSON.message);
    });
}

function editTodosById(event, id) {
  event.preventDefault();
  $(".editTodos").empty();

  $.ajax({
    method: "GET",
    url: `${baseUrl}/todos/${id}`,
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
      notifError(err.responseJSON.message);
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
    url: `${baseUrl}/todos/${id}`,
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
      notifSuccess("Update Todo");
    })
    .fail((err) => {
      console.log(err.name);
      notifError(err.responseJSON.message);
    });
}

function deleteTodosById(event, id) {
  event.preventDefault();
  Swal.fire({
    title: "Are you sure?",
    text: "You won't be able to revert this!",
    icon: "warning",
    showCancelButton: true,
    confirmButtonColor: "#3085d6",
    cancelButtonColor: "#d33",
    confirmButtonText: "Yes, delete it!",
  }).then((result) => {
    if (result.isConfirmed) {
      Swal.fire("Deleted!", "Your file has been deleted.", "success");
      $.ajax({
        method: "DELETE",
        url: `${baseUrl}/todos/${id}`,
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
          notifError(err.responseJSON.message);
        });
    }
  });
}

function viewTodosById(event, id) {
  event.preventDefault();
  $("#todo-detail").empty();

  $.ajax({
    method: "GET",
    url: `${baseUrl}/todos/${id}`,
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
      notifError(err.responseJSON.message);
    });
}

function patchTodosById(event, id) {
  event.preventDefault();
  let statusChange = "";
  $.ajax({
    method: "GET",
    url: `${baseUrl}/todos/${id}`,
    headers: {
      access_token: localStorage.getItem("access_token"),
    },
  })
    .done((response) => {
      if (response.status == "notFinished") {
        statusChange = "finished";
      } else if (response.status == "ongoing") {
        statusChange = "finished";
      } else {
        statusChange = "finished";
      }

      $.ajax({
        method: "PATCH",
        url: `${baseUrl}/todos/${id}`,
        headers: {
          access_token: localStorage.getItem("access_token"),
        },
        data: {
          status: statusChange,
        },
      }).done(() => {
        showHomePage();
        fatchDataTodos();
        notifSuccess("Update Status Todo");
      });
    })
    .fail((err) => {
      notifError(err.responseJSON.message);
    });
}

function fatchDataTodos() {
  // memunculkan seluruh data Todos
  $.ajax({
    method: "GET",
    url: baseUrl + "/todos",
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
              <div class="col-6">
                ${element.title} ${statusNew}
                </div>
                <div class="ml-5 col-6">
                <button class="btn btn${button}-success btn-sm" onclick="patchTodosById(event,${element.id})">Done</button>
                <button class="btn btn${button}-info btn-sm" onclick="viewTodosById(event,${element.id})">View</button>
                <button class="btn btn${button}-warning btn-sm" onclick="editTodosById(event,${element.id})">Edit</button>
                <button class="btn btn${button}-danger btn-sm" onclick="deleteTodosById(event,${element.id})" >Delete</button>
              </div>
            </div>
          </div>
        </div>
        `);
      });
    })
    .fail((err) => {
      console.log(err);
      notifError(err.responseJSON.message);
    });
}

// Batas function Notif ===========================================
function notifSuccess(text) {
  const Toast = Swal.mixin({
    toast: true,
    position: "top-end",
    showConfirmButton: false,
    timer: 3000,
    timerProgressBar: true,
    didOpen: (toast) => {
      toast.addEventListener("mouseenter", Swal.stopTimer);
      toast.addEventListener("mouseleave", Swal.resumeTimer);
    },
  });

  Toast.fire({
    icon: "success",
    title: `${text} is successfully`,
  });
}

function notifFailed(text) {
  const Toast = Swal.mixin({
    toast: true,
    position: "top-end",
    showConfirmButton: false,
    timer: 3000,
    timerProgressBar: true,
    didOpen: (toast) => {
      toast.addEventListener("mouseenter", Swal.stopTimer);
      toast.addEventListener("mouseleave", Swal.resumeTimer);
    },
  });

  Toast.fire({
    icon: "error",
    title: `${text} is failed!`,
  });
}

function notifError(message) {
  const Toast = Swal.mixin({
    toast: true,
    position: "top-end",
    showConfirmButton: false,
    timer: 3000,
    timerProgressBar: true,
    didOpen: (toast) => {
      toast.addEventListener("mouseenter", Swal.stopTimer);
      toast.addEventListener("mouseleave", Swal.resumeTimer);
    },
  });

  Toast.fire({
    icon: "error",
    title: `${message}`,
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
      url: baseUrl + "/user/login",
      data: {
        email,
        password,
      },
    })
      .done((response) => {
        localStorage.setItem("access_token", response.access_token);
        showHomePage();
        fatchDataTodos(); //jangan lupa ketika refresh panggil lagi datanya
        notifSuccess("Login");
      })
      .fail((err) => {
        console.log(err); // error masih console
        if (err.status === 400) {
          Swal.fire({
            title: "Invalid Email / Password!",
            text: "Enter the correct Email / Password",
            icon: "error",
            confirmButtonText: "Ok",
          });
        }
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
      url: baseUrl + "/user/register",
      data: {
        email,
        username,
        password,
      },
    })
      .done((response) => {
        showLoginPage();
        notifSuccess("Register");
      })
      .fail((err) => {
        notifError(err.responseJSON.message);
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
      url: baseUrl + "/todos",
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
        notifSuccess("Add New Todo");
      })
      .fail((err) => {
        notifError(err.responseJSON.message);
        // console.log(err.responseJSON.message);
      })
      .always(() => {
        $("#title-form-addTodo").val("");
        $("#description-form-addTodo").val("");
        $("#date-form-addTodo").val("");
        $("#status-form-addTodo").val("");
      });
  });

  $("#btn-add-activity").on("click", function (event) {
    $("#activity-list").empty();
    $.ajax({
      method: "GET",
      url: `${baseUrl}/todos/activity`,
      headers: {
        access_token: localStorage.getItem("access_token"),
      },
    })
      .done((response) => {
        $("#activity-list").append(`
        <i>"${response.result}"</i>
        `);
      })
      .fail((err) => {
        notifError(err.responseJSON.message);
      });
  });

  // Batas Button action Pindah
  $("#menu-login").click(function () {
    showLoginPage();
  });

  $("#menu-randomActivity").click(function () {
    showRandomActivity();
    $("#activity-list").empty();
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
    notifSuccess("Logout");
  });

  $("#btn-add-todo").click(function () {
    showAddTodoPage();
  });
});
