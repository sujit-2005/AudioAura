const introVideo = document.getElementById("introVideo");
const loopVideo = document.getElementById("loopVideo");

introVideo.addEventListener("ended", () => {
    introVideo.style.opacity = "0";
    loopVideo.classList.remove("hidden");
    loopVideo.play();
});
