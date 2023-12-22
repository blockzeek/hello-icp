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

var num_follows = 0;
async function load_follows() {
  let follows_section = document.getElementById("follows");
  let follows = await hello_backend.follows();

  if (num_follows == follows.length) {
    return;
  }

  num_follows = follows.length;
  follows_section.replaceChildren([]);

  for (var i = 0; i < follows.length; i++) {
    let follow = document.createElement('p');
    follow.innerText += follows;
    follows_section.appendChild(follow);
  }
}

var num_timeline = 0;
async function load_timeline() {
  let timeline_section = document.getElementById("timeline");
  let timeline = await hello_backend.timeline(0);

  if (num_timeline == timeline.length) {
    return;
  }

  num_timeline = timeline.length;
  timeline_section.replaceChildren([]);

  for (var i = 0; i < timeline.length; i++) {
    let post = document.createElement('p');
    post.innerText += timeline[i].text + " at " + timeline[i].time + " by " + timeline[i].author;
    timeline_section.appendChild(post);
  }
}

function onload() {
  let post_button = document.getElementById("post");
  post_button.onclick = post;
  load_posts();
  setInterval(load_posts, 3000);

  load_follows();
  setInterval(load_follows, 3000);

  load_timeline();
  setInterval(load_timeline, 3000);
}

window.onload = onload