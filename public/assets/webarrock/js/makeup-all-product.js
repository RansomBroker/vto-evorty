$(window).on("load", function () {
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
