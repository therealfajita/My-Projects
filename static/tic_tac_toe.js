const button = document.querySelectorAll(".placer");
const cross = document.querySelectorAll(".cross");
const ring = document.querySelectorAll(".ring");
const win_screen = document.querySelector(".win-screen");
let shape = 1;

function generate_win(win_status) {
    win_screen.classList.toggle("invisible");
    const win_text = document.createElement("h");
    if (win_status == "Tie"){
        win_text.textContent = (win_status);
    } else {
        win_text.textContent = (win_status + " Wins!");
    }

    win_text.classList.add("win-text");
    win_screen.appendChild(win_text);
    const reset_button = document.createElement("button");
    reset_button.textContent = ("Play Again!");
    reset_button.classList.add("reset-button");
    reset_button.addEventListener("click", ()=> {
        win_screen.classList.toggle("invisible");
        for (let i = 0; i < ring.length; i++){
            if (!(ring[i].classList.contains("invisible"))){
                ring[i].classList.toggle("invisible");
            }
        }
        for (let i = 0; i < cross.length; i++){
            if (!(cross[i].classList.contains("invisible"))){
                cross[i].classList.toggle("invisible");
            }
        }
        win_text.remove();
        reset_button.remove();
    })
    win_screen.appendChild(reset_button);
}

button.forEach(function reveal_shape(btn, index)  {
    btn.addEventListener("click", ()=> {
        if (shape===1){
            if (cross[index].classList.contains("invisible") && ring[index].classList.contains("invisible")) {
                cross[index].classList.toggle("invisible");
                fetch("/send_cross_index", {
                    method: "Post",
                    headers: {"Content-Type": "application/json"},
                    body: JSON.stringify({index : index})
                })
                .then(response => response.json())
                .then(data => {
                    console.log("Server Status: ", data.server_status);
                    console.log("Win Status: ", data.win_status);
                    if (!(data.win_status == "None")) {
                        generate_win(data.win_status);
                    }
                })
                .catch(error => {
                    console.error("There is an error", error);
                });
                shape = 0;
            } 
            else {
                return;
            }    
        }
        else {
            if (ring[index].classList.contains("invisible") && cross[index].classList.contains("invisible")){
                ring[index].classList.toggle("invisible");
                fetch("/send_ring_index", {
                    method: "Post",
                    headers: {"Content-Type": "application/json"},
                    body: JSON.stringify({index:index})
                })
                .then(response => response.json())
                .then(data => {
                    console.log("Server Status: ", data.server_status);
                    console.log("Win Status: ", data.win_status);
                    if (!(data.win_status == "None")) {
                        generate_win(data.win_status);
                    }
                })
                .catch(error => {
                    console.error("There is an error", error);
                });
                shape = 1;
            }
            else {
                return;
            }
        }
        
    });
});