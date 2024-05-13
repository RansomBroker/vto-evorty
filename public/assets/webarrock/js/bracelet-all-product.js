$(window).on('load', function () {
    navigator.mediaDevices.getUserMedia({ video: true })
        .then(function (stream) {
            var videoElement = document.createElement('video');
            videoElement.srcObject = stream;
            videoElement.play();

            var canvas = document.getElementById('camera');
            var ctx = canvas.getContext('2d');

            videoElement.addEventListener('play', function () {
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
            console.error('Error accessing webcam:', error);
        });

    $("#pillsProductList").owlCarousel({
        loop: false,
        margin: 10,
        nav: false,
        autoWidth: true,
    });
})
