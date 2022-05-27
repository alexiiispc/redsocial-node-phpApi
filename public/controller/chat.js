window.onload = getMessagesToMe();
window.onload = chatI();
window.onload = () => {
  localStorage.removeItem("token_to");
  localStorage.removeItem("token_to_movil");
};

function chatI() {
  if (window.innerWidth < 591) {
    msg_prev.style.display = "none";
    chat_wrap.style.display = "block";
  }
}

function getMessagesToMe() {
  $.ajax({
    url: API_URL + "/controller/user/user_messages.php",
    method: "POST",
    data: { token_post: sessionStorage.getItem("user_token") },
    success: function (data) {
      var content_chats = document.querySelector(".content-chats");
      content_chats.innerHTML = data;
    },
  });
}

// chat pc
const chat_wrap = document.querySelector(".chat-wrap");
const msg_prev = document.querySelector(".prev-message");
const chat_box = document.getElementById("chat-box");

function getChatUser(token_to) {
  localStorage.setItem("token_to", token_to);

  if (window.innerWidth < 691) {
    localStorage.setItem("token_to_movil", token_to);
    location.href = "/c/" + token_to;
  } else {
    $.ajax({
      url: API_URL + "/controller/user/user_get_chat.php",
      method: "POST",
      data: {
        token_from: token_to,
        token_to: sessionStorage.getItem("user_token"),
        
      },
      success: function (data) {
        //console.log(data);
        msg_prev.style.display = "none";
        chat_wrap.style.display = "block";

        chat_box.innerHTML = data;
        scrollToBottom();

        $.ajax({
          url: API_URL + "/controller/user/get_profile_chat.php",
          method: "POST",
          data: {
            token_to: localStorage.getItem("token_to"),
          },
          success: function (data) {
            img_chat = document.getElementById("img-chat");
            img_chat.src = data;
            setTimeout(() => {
              msg = document.querySelector(".msg-x");
              msg.style.display = "none";
            }, 2000);
          },
        });

        $.ajax({
          url: API_URL + "/controller/user/user_chat_data.php",
          method: "POST",
          data: {
            token_to: localStorage.getItem("token_to"),
          },
          success: function (data) {
            user_to = JSON.parse(data);
            nombreTo = document.getElementById("nombre-to-name");
            localStorage.setItem(
              "nombreTo",
              user_to["nombre"] + " " + user_to["apellido"]
            );
            nombreTo.innerHTML = user_to["nombre"] + " " + user_to["apellido"];
          },
        });
      },
    });
  }
}

//socket chat

  socket.on("chat:user", (data) => {
    if (
      data.token_to == sessionStorage.getItem("user_token") &&
      data.type == "text"
    ) {
      if (localStorage.getItem("token_to")  != null || localStorage.getItem("token_to_movil")  != null ) {
        chat_box.innerHTML += `
        
        <div class="chat to-message">
        <img src="${data.imgProfile}" alt="img.png" class="img-perfil-user">
        <div class="detalles">
            <p>${data.message}</p>
        </div>
    </div>
        
        `;
        scrollToBottom();
      } else if (localStorage.getItem("token_to") == null || localStorage.getItem("user_token_movil") == null) {
        document.getElementById("new-msg").innerHTML = "Nuevo mensaje de <b>" + data.name_from + "</b>";
        $(".alert-message").css("top", "50px");

        setTimeout(() => {
          $(".alert-message").css("top", "-110%");
        }, 4000);
      }
    }
  });
  socket.on("chat:sticker", (data) => {
    if (
      data.token_to == sessionStorage.getItem("user_token") &&
      data.type == "sticker"
    ) {
      if (localStorage.getItem("token_to") != null) {
        chat_box.innerHTML += `
        
        <div class="chat to-message">
        <img src="${data.imgProfile}" alt="img.png" class="img-perfil-user">
        <div class="detalles">
            <p><img src="${data.sticker}" alt="img.png" class="img-sticker-chat"></p>
        </div>
    </div>
        
        `;
        scrollToBottom();
      } else if (localStorage.getItem("token_to") == null) {
        document.getElementById("new-msg").innerHTML =
          "Nuevo mensaje de <b>" + data.name_from + "</b>";
        setTimeout(() => {
          $(".alert-message").css("top", "50px");

          setTimeout(() => {
            $(".alert-message").css("top", "-110%");
          }, 4000);
        }, 100);
      }
    }
  });


// send message

function sendMessage(token_from, token_to, message) {
  dataChat = {
    token_from: sessionStorage.getItem("user_token"),
    name_from:
      sessionStorage.getItem("user_name") +
      " " +
      sessionStorage.getItem("user_lastname"),
    token_to: localStorage.getItem("token_to"),
    imgProfile: sessionStorage.getItem("user_profile"),
    message: mensaje.value,
    type: "text",
  };
  socket.emit("chat:user", dataChat);
  $.ajax({
    url: API_URL + "/controller/user/user_send_message.php",
    method: "POST",
    data: {
      token_from: token_from,
      token_to: token_to,
      message: message,
    },
    success: function (data) {
      //console.log(data);
      if (data == "complete") {
        mensaje.focus();
      } else {
        scrollToBottom();
        mensaje.value = "";
        mensaje.focus();
      }
    },
  });
}

btnSend.addEventListener("click", () => {
  if (mensaje.value == "") {
    mensaje.focus();
  } else {
    chatBox.innerHTML += `
        <div class="chat from-message">
        <div class="detalles" >

            <p>${mensaje.value}</p>


        </div>
      </div>
        `;
    sendMessage(
      sessionStorage.getItem("user_token"),
      localStorage.getItem("token_to"),
      mensaje.value
    );
  }
  scrollToBottom();
});

// buscar usuarios

function searchUser() {
  const txtSearch = document.querySelector(".txt-search-chat");
  $.ajax({
    url: API_URL + "/controller/user/search_user.php",
    method: "POST",
    data: {
      token: sessionStorage.getItem("user_token"),
      name: txtSearch.value,
    },
    success: function (data) {
      var user_box = document.querySelector(".content-chats");
      user_box.innerHTML = data;
    },
  });
}
