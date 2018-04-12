const TimeChain = function () {
    let _next;
    let _resolved = false;
    let _time = 0;
    let _callback;
    let _timeout;
    const _startHandler = [];
    const _pauseHandler = [];

    const wait = function (time) {
        _time += time;

        return this;
    };

    const exec = function (callback = false) {
        _callback = callback;
        _next = TimeChain();

        return _next;
    };

    const delayed = function (callback, delay) {
        return exec(function() {
            setTimeout(callback, delay * 1000);
        });
    };

    const sequence = function (callback, dataList) {
        const chain = TimeChain();
        let step = chain;
        dataList.forEach((data, index) => step = callback(step, data, index, dataList));
        _next = chain;

        return step;
    };

    const getNext = function () {
        return _next;
    };

    const getCurrent = function () {
        if (_resolved && _next) {
            return _next.getCurrent();
        }

        return this;
    };

    const fastForward = function (until) {
        if (until - _time > 0) {
            _resolved = true;
            if (_callback) {
                _callback();
            }
            if (_next) {
                return _next.fastForward(until - _time);
            }

            return false;
        }
        wait(_time - until);

        return this;
    };

    const resolve = function () {
        _resolved = true;
        if (_callback) {
            _callback();
        }
        if (_next) {
            _next.start();
        }
    };

    const onStart = function (handler) {
        _startHandler.push(handler);
    };

    const start = function () {
        if (!_resolved) {
            if (_time === 0) {
                resolve();
            } else {
                _timeout = setTimeout(resolve, _time * 1000);
            }
        }

        _startHandler.forEach(handler => handler());
    };

    const onPause = function (handler) {
        _pauseHandler.push(handler);
    };

    const pause = function () {
        if (!_resolved) {
            clearTimeout(_timeout);
            _timeout = null;
        }

        _pauseHandler.forEach(handler => handler());
    };

    const toggle = function (force) {
        const current = getCurrent.call(this);
        if (current.isActive() || force === false) {
            pause();
            current.pause();
            return false;
        }

        start();
        current.start();
        return true;
    };

    const isActive = function () {
        return !!_timeout;
    };

    const debug = function () {
        if (_time) {
            console.log(`wait ${_time}s`);
        }
        if (_callback && _callback.name) {
            console.log(`exec ${_callback.name}()`);
        }
        if (_next) {
            return _next.debug();
        }
    };

    return {
        wait,
        exec,
        delayed,
        sequence,
        getNext,
        getCurrent,
        start,
        onPause,
        pause,
        toggle,
        isActive,
        onStart,
        fastForward,
        debug
    };
};
