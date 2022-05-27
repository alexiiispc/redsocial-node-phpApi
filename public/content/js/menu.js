const active_menu = document.getElementById("active-menu-lateral");


active_menu.addEventListener("click", ()=>{
    if ($("#active-menu-lateral i").attr("class") == "bi bi-list") {
        $(".conent-menu-lateral").css("left", "0")
        $("#active-menu-lateral i").removeClass("bi bi-list");
        $("#active-menu-lateral i").addClass("bi bi-x-lg");
        
    }else if($("#active-menu-lateral i").attr("class") == "bi bi-x-lg"){
        $(".conent-menu-lateral").css("left", "-110%")
        $("#active-menu-lateral i").removeClass("bi bi-x-lg");
        $("#active-menu-lateral i").addClass("bi bi-list");
    }
})