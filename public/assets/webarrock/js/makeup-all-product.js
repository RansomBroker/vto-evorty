$(window).on("load", function () {
    navigator.mediaDevices
        .getUserMedia({ video: true })
        .then(function (stream) {
            var videoElement = document.createElement("video");
            videoElement.srcObject = stream;
            videoElement.play();

            var canvas = document.getElementById("camera");
            var ctx = canvas.getContext("2d");

            videoElement.addEventListener("play", function () {
                drawFrame();
            });

            function drawFrame() {
                if (videoElement.paused || videoElement.ended) {
                    return;
                }
                ctx.drawImage(videoElement, 0, 0, canvas.width, canvas.height);
                requestAnimationFrame(drawFrame);
            }
        })
        .catch(function (error) {
            console.error("Error accessing webcam:", error);
        });

    $(document).on("click", ".tab-selected", function () {
        let currentMaterial = $(this).data("material");

        // hapus tab-active yang ada
        $(".tab-selected").removeClass("tab-active");

        // tambahkan tab active ke currenttab
        $("#material-" + currentMaterial + "-tab").addClass("tab-active");
    });

    // create owl carousel
    $(".product-list-0").owlCarousel({
        loop: false,
        nav: false,
        autoWidth: true,
    });
    $(".product-list-1").owlCarousel({
        loop: false,
        nav: false,
        autoWidth: true,
    });
    $(".product-list-2").owlCarousel({
        loop: false,
        nav: false,
        autoWidth: true,
    });
    $(".product-list-3").owlCarousel({
        loop: false,
        nav: false,
        autoWidth: true,
    });
    $(".product-list-4").owlCarousel({
        loop: false,
        nav: false,
        autoWidth: true,
    });
});
