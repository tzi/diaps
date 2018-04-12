const Timer = function (selector) {
    const _node = document.querySelector(selector);
    let _time = 0;
    let _interval;

    const set = function (time) {
        _time = time;
        update();
    };

    const start = function () {
        if (!_interval) {
            update();
            _interval = setInterval(() => {
                _time++;
                update();
            }, 1000);
        }
    };

    const update = function () {
        _node.innerHTML = `${_time}s`;
    };

    const stop = function () {
        clearInterval(_interval);
        _interval = null;
    };

    const toggle = function (force) {
        if (_interval || force === false) {
            stop();

            return false;
        }
        start();

        return true;
    };

    const getTime = function () {
        return _time;
    }

    return {set, start, stop, toggle, getTime}
};