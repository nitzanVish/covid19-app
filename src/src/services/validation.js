
import { extend } from 'vee-validate';
import { required, email, numeric, digits } from 'vee-validate/dist/rules';

extend('email', email);
extend('numeric', numeric);
extend('digits', digits);
extend('required', {
    ...required,
    message: 'This field is required'
});

extend('min', {
    validate(value, args) {
        return value.length >= args.length;
    },
    params: ['length'],
    message: 'This field must have at least {length} characters'
});

extend('max', {
    validate(value, args) {
        return value.length <= args.length;
    },
    params: ['length'],
    message: 'This field must have max {length} characters'
});

export default extend; 

