import {EventEmitter} from 'typed-event-emitter';
/**
 * Created by barthclem on 11/25/17.
 */

class Sample extends EventEmitter {

    onValueChanged = this.registerEvent<(newValue: number) => any>();

    private _value: number;

    constructor(value: number) {
        super();
        this._value = value;
    }

    get value(): number {
        return this._value;
    }

    set value(value: number) {
        this._value = value;
        this.emit(this.onValueChanged, this._value);
    }

}

// let instance = new Sample(1);
// instance.onValueChanged(newValue: any => {
//     console.log(`Value changed: ${newValue}`);
// });
//
// instance.value = 27;