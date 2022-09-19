function FNSearchParams(formId, storeId){
    this.searchObject = document.getElementById(formId);
    this.searchItems = {};
    this.storeId = storeId;
}

FNSearchParams.prototype.init = function() {
    this.searchItems = {};
    localStorage.removeItem(this.storeId);
};

FNSearchParams.prototype.store = function() {
    this.searchItems = {};
    let items = this.searchObject.querySelectorAll('input, select');
    for (let i =0; i< items.length ; i++ ) {
        let key = items[i].name;
        let value = items[i].value;
        if (key && value) {
            this.searchItems[key] = value;
        }
    }

    localStorage.removeItem(this.storeId);
    localStorage.setItem(this.storeId, JSON.stringify(this.searchItems));
};

FNSearchParams.prototype.setSearchParams = function() {

    let storedData = localStorage.getItem(this.storeId);
    if (!storedData) return;

    this.searchItems = JSON.parse(storedData);

    if (1 > Object.keys(storedData).length) return;

    let formObjectEls = this.searchObject.querySelectorAll('input, select');
    for (let i=0 ; i < formObjectEls.length ; i++ ) {
        let name = formObjectEls[i].name;
        if (name) {
            let val = this.searchItems[name];
            if (val) formObjectEls[i].value = val;
        }
    }
};
