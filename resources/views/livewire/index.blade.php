<div>
    <div class="row justify-content-center align-items-center p-0 m-0 ">
        <div class="col-lg-4 col-md-12 col-sm-12">
            <div class="d-flex flex-column gap-3">
                <button wire:click="showModal" class="btn btn-primary fs-5 rounded-pill bg-white border-white text-mortar py-3">Earings</button>
                <button wire:click="showModal"  class="btn btn-primary fs-5 rounded-pill bg-white border-white text-mortar py-3">Ring</button>
                <button wire:click="showModal"  class="btn btn-primary fs-5 rounded-pill bg-white border-white text-mortar py-3">Bracelet</button>
                <button wire:click="showModal"  class="btn btn-primary fs-5 rounded-pill bg-white border-white text-mortar py-3">Necklace</button>
                <button wire:click="showModal"  class="btn btn-primary fs-5 rounded-pill bg-white border-white text-mortar py-3">Brooch</button>
            </div>
        </div>
    </div>

    <div wire:ignore.self class="modal fade" id="editorNameModal" tabindex="-1" role="dialog" aria-labelledby="editorNameModalLabel" aria-hidden="true">
        <div class="modal-dialog" role="document">
            <div class="modal-content">
                <div class="modal-header border-0">
                    <button type="button" class="btn-close"  aria-label="Close" wire:click="closeModal"></button>
                </div>
                <div class="modal-body">
                    <p class="text-mortar fs-5 mb-2">Add Product name</p>
                    <form wire:submit.prevent="createProduct">
                        <div class="mb-3">
                            <input type="text" class="@error('name') is-invalid @enderror form-control" id="name" name="name" wire:model="name" placeholder="ex: Earings">
                            @error('name')
                                <div class="invalid-feedback">
                                    {{ $message }}
                                </div>
                            @enderror
                        </div>
                        <button type="submit" class="btn btn-cosmic-latte w-100">
                            <span>Create</span>
                        </button>
                    </form>
                </div>
            </div>
        </div>
    </div>

    @push('script')
        <script>
            const editorNameModal = new bootstrap.Modal(document.getElementById('editorNameModal'))
            window.addEventListener('showModal', (event) => {
                editorNameModal.show();
            });
            window.addEventListener('closeModal', (event) => {
                editorNameModal.hide();
            });
        </script>
    @endpush
</div>


