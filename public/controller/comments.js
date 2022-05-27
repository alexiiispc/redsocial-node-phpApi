const overlay_comment = document.querySelector(".overlay-comments");
const close_overlay = document.getElementById("close-overlay");
const comments_box = document.querySelector(".content-comments-data");
const send_comment = document.getElementById("send-comment");
const comment_data = document.getElementById("comment-post");

close_overlay.addEventListener("click", () => {
  overlay_comment.style.display = "none";
  localStorage.removeItem("token_post");
  comments_box.innerHTML = "";
  $("body").css("overflow-y", "auto");
});

function getComments(token_post) {
  localStorage.setItem("token_post", token_post);
  console.log(token_post);
  overlay_comment.style.display = "flex";
  $("body").css("overflow", "hidden");

  $.ajax({
    url: API_URL + "/controller/user/get_comments.php",
    method: "POST",
    data: { token_post: token_post },
    success: function (data) {
      setTimeout(() => {
        comments_box.innerHTML = data;
      }, 800);
    },
  });
}

send_comment.addEventListener("click", () => {
  if ((comment_data.value == "")) {
    comment_data.focus();
  } else {
    console.log(comment_data.value);
    $.ajax({
        url: API_URL + "/controller/user/user_comment.php",
        method: "POST",
        data: {
          token_post: localStorage.getItem("token_post"),
          token_user: sessionStorage.getItem("user_token"),
          comment: comment_data.value,
        },
        success: function (data) {
            console.log(data);
          if (data >= 0) {
              comment_data.value = "";
              count_comments = document.getElementById("count-comments" + localStorage.getItem("token_post"))
              count_comments.innerHTML = data;
            data = {
                success: "true",
              };
              socket.emit("get:comments", { data });
          }else if(data == "error"){
              console.log(data);
          }else if(data=="logout"){
              location.href = "/auth"
          }
        },
      });
  }
});

// socket comment 

socket.on("get:comments", (data)=>{
    if (localStorage.getItem("token_post") != null) {
        getComments(localStorage.getItem("token_post"))
    }
    
});
