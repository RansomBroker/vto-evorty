<div>
    <div wire:ignore.self class="modal fade" id="brandNameModal" data-bs-backdrop="static" data-bs-keyboard="false" tabindex="-1" role="dialog" aria-labelledby="brandNameModalLabel" aria-hidden="true">
        <div class="modal-dialog modal-dialog-centered" role="document">
            <div class="modal-content">
                <div class="modal-body">
                    <p class="text-mortar fs-5 mb-3">Create Brand Name</p>
                    <form wire:submit.prevent="add">
                        <div class="mb-3">
                            <label for="name">Brand Name <sup class="text-danger">*</sup></label>
                            <input type="text" class="@error('name') is-invalid @enderror form-control" id="name" name="name" wire:model="name" placeholder="ex: SeaRing">
                            @error('name')
                            <div class="invalid-feedback">
                                {{ $message }}
                            </div>
                            @enderror
                        </div>
                        <button type="submit" class="btn btn-primary w-100">
                            <span>Create</span>
                        </button>
                    </form>
                </div>
            </div>
        </div>
    </div>

    @push('script')
        <script>
            const brandNameModal = new bootstrap.Modal(document.getElementById('brandNameModal'))
            brandNameModal.show();
        </script>
    @endpush
</div>
