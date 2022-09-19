function NumberCounter(target_frame, target_number) {
    this.count = 0; this.diff = 0;
    this.target_count = parseInt(target_number);
    this.target_frame = document.getElementById(target_frame);
    this.timer = null;
    this.counter();
}

NumberCounter.prototype.counter = function() {
    let self = this;
    this.diff = this.target_count - this.count;

    if(this.diff > 0) self.count += Math.ceil(this.diff / 5);

    this.target_frame.innerHTML = this.count.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ',');

    if(this.count < this.target_count) this.timer = setTimeout(function() { self.counter(); }, 20);
    else clearTimeout(this.timer);
};