$(window).on("load", function () {
    let currentCategoryOpen;

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

    // create owl carousel
    $(".carousel-material-list").owlCarousel({
        loop: false,
        nav: false,
        autoWidth: true,
    });
    $(".product-list").owlCarousel({
        loop: false,
        nav: false,
        autoWidth: true,
    });

    $(document).on("click", ".tab-selected", function () {
        let currentMaterial = $(this).data("material");

        // hapus tab-active yang ada
        $(".tab-selected").removeClass("tab-active");

        // tambahkan tab active ke currenttab
        $("#material-" + currentMaterial + "-tab").addClass("tab-active");

        // hide tampilan card material
        $("#pillsMaterialList").addClass("d-none");

        /// hapus class d-none di pills product
        $("#pillsProductList").removeClass("d-none");

        $(".material-list-container").removeClass("active show");

        $(".unselected-material-btn").removeClass("unselected-material-active");
    });

    // ketika product di click
    $(document).on("click", ".product-click", function () {
        let productIndex = $(this).data("product-index");
        let productCurrent = $(this).data("product-current");

        $("#pillsProductList").addClass("d-none");
        $("#pillsMaterialList").removeClass("d-none");

        $(".product-" + productIndex).removeClass("product-active");
        $(".product-" + productIndex + "-" + productCurrent).addClass(
            "product-active"
        );

        $(
            ".material-list-container-" + productIndex + "-" + productCurrent
        ).addClass("show active");
    });

    // ketika klik btn-back
    $(document).on("click", ".btn-back", function () {
        // hide tampilan card material
        $("#pillsMaterialList").addClass("d-none");

        /// hapus class d-none di pills product
        $("#pillsProductList").removeClass("d-none");

        $(".material-list-container").removeClass("active show");

        $(".unselected-material-btn").removeClass("unselected-material-active");
    });

    // ketika warna dipilih
    $(document).on("click", ".card-item", function () {
        let materialIndex = $(this).data("material-index");
        let materialCurrent = $(this).data("material-current");
        let materialProduct = $(this).data("material-product");
        let color = $(this).data("color");

        // hapus class card item active di seluruh product
        $(".card-item-" + materialIndex).removeClass("card-item-active");

        // tambahkan active card item
        $(
            ".card-item-" +
                materialIndex +
                "-" +
                materialProduct +
                "-" +
                materialCurrent
        ).addClass("card-item-active");
    });

    // ketika unselected
    $(document).on("click", ".unselected-material-btn", function () {
        let materialIndex = $(this).data("material-index");
        let materialProduct = $(this).data("material-product");

        $(".unselected-material-btn").removeClass("unselected-material-active");

        $(
            ".unselected-material-" + materialIndex + "-" + materialProduct
        ).addClass("unselected-material-active");

        $(".product-" + materialIndex).removeClass("product-active");
    });
});
