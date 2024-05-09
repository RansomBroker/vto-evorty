<aside id="layout-menu" class="layout-menu menu-vertical menu bg-menu-theme">
    <div class="app-brand demo">
        <a href="" class="app-brand-link">
            <span class="app-brand-text demo menu-text fw-bolder ms-2">{{ $brand ?? 'Brand Name' }}</span>
        </a>

        <a href="javascript:void(0);" class="layout-menu-toggle menu-link text-large ms-auto d-block d-xl-none">
            <i class="bx bx-chevron-left bx-sm align-middle"></i>
        </a>
    </div>

    <div class="menu-inner-shadow"></div>

    <ul class="menu-inner py-1">
        <!-- Dashboard -->
        <li class="menu-item @if(Route::is('dashboard')) active @endif">
            <a href="{{ route('dashboard', $url) }}" class="menu-link">
                <div data-i18n="Analytics">Home</div>
            </a>
        </li>

        <li class="menu-header small text-uppercase">
            <span class="menu-header-text"> Category</span>
        </li>

        <li class="menu-item">
            <a href="" class="menu-link">
                <div data-i18n="Analytics">Earring</div>
            </a>
        </li>

        <li class="menu-item">
            <a href="" class="menu-link">
                <div data-i18n="Analytics">Ring</div>
            </a>
        </li>

        <li class="menu-item @if(Route::is('bracelet.view')) active @endif">
            <a href="{{ route('bracelet.view', $url) }}" class="menu-link">
                <div data-i18n="Analytics">Bracelet</div>
            </a>
        </li>

        <li class="menu-item">
            <a href="" class="menu-link">
                <div data-i18n="Analytics">Necklace</div>
            </a>
        </li>

        <li class="menu-item">
            <a href="" class="menu-link">
                <div data-i18n="Analytics">Brooch</div>
            </a>
        </li>
    </ul>
</aside>
