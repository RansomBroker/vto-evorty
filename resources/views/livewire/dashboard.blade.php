<div class="layout-container">
    <x-sidebar :brand="$brand->name" :url="$brand->slug"/>

    <div class="layout-page">
        <x-navbar :license="$brand->license_active"/>
        <!-- Content wrapper -->
        <div class="content-wrapper">
            <!-- Content -->
            <div class="container-xxl flex-grow-1 container-p-y">
                <div class="card">
                    <div class="card-body">
                        @if($message = Session::get('message'))
                            @if($status = Session::get('status'))
                                <div class="alert alert-{{ $status}} alert-dismissible fade show mb-3" role="alert">
                                    {{ $message }}
                                    <button type="button" class="btn-close" data-bs-dismiss="alert" aria-label="Close"></button>
                                </div>
                            @endif
                        @endif
                        <h4>Brand Setting</h4>
                        <form>
                            <div class="form-group mb-3">
                                <label for="name" class="form-label">Brand Name</label>
                                <input type="text" class="form-control" wire:model="name" disabled>
                            </div>
                            <div class="form-group mb-3">
                                <label for="uniqueKey" class="form-label">Api Key</label>
                                <input type="text" class="form-control" wire:model="uniqueKey" disabled>
                            </div>
                            <div class="form-group mb-3">
                                <label for="embed" class="form-label">Embed Code</label>
                                <textarea name="embed" id="embed" class="form-control" cols="10" rows="10"></textarea>
                            </div>
                        </form>
                    </div>
                </div>
            </div>
            <!-- / Content -->
            <div class="content-backdrop fade"></div>
        </div>
        <!-- Content wrapper -->
    </div>
</div>
