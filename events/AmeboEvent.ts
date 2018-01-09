import {EventEmitter, Listener} from 'typed-event-emitter';
/**
 * Created by barthclem on 11/25/17.
 */

export class AmeboEvent <T>  extends EventEmitter {

    onValueChanged = this.registerEvent<(newValue: any) => any>();

    private _value: T;

    constructor () {
        super();
    }

    get value(): T {
        return this._value;
    }

    set value(value: T) {
        this._value = value;
        this.emit(this.onValueChanged, this._value);
    }

    destroyListener() {
        this.removeListener();
    }
}