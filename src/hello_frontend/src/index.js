import { hello_backend } from "../../declarations/hello_backend";

async function post() {
  let post_button = document.getElementById("post");
  post_button.disabled = true;
  let error = document.getElementById("error");
  error.innerText = "";
  let textarea = document.getElementById("message");
  let text = textarea.value;
  let otp = document.getElementById("otp").value;
  try {
    await hello_backend.post(otp, text);
    textarea.value = ""
  } catch (err) {
    console.log(err);
    error.innerText = "Post Failed!"
  }

  post_button.disabled = false;
}


var num_posts = 0;
async function load_posts() {
  let post_section = document.getElementById("posts");
  let posts = await hello_backend.posts(0);

  if (num_posts == posts.length) {
    return;
  }

  num_posts = posts.length;
  post_section.replaceChildren([]);

  for (var i = 0; i < posts.length; i++) {
    let post = document.createElement('p');
    // TODO: fix formatting
    post.innerText += posts[i].text + " at " + posts[i].time;
    post_section.appendChild(post);
  }

}

function onload() {
  let post_button = document.getElementById("post");
  post_button.onclick = post;
  load_posts();
  setInterval(load_posts, 3000);
}

window.onload = onload