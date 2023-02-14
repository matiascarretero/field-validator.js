# FieldValidator
The `input` `select` `textarea` validator I always wanted! Written in vanilla JavaScript (no-dependencies) with a bunch of cool features and integrations.
## Features
- **Successful validation message**
You can set a custom message when the validation is successful by passing the option `successMessage`. It's not mandatory no provide this message.
- **Custom validators**
Some validators are available by default, but you can provide your custom validators via `FieldValidator.addCustomValidator( <function> )`. They must be a callback function with this schema:
    ```javascript
    function (value, HTMLElement) {
        if(HTMLElement.tagName === "INPUT" && value.length > 128) {
            return "The error message";
        }
    }
    ``` 
    - The first parameter passed is the input value, usually a string.
    - The second paramenter is the HTMLElement object itself. It can be useful to read field type, attributes or classes.
    - You should only return a string when validation fails, with the message to be displayed in the error message. 
    - If validation is successful, you **must not** return anything or the whole validation will fail. But, if you really need to return something, you must `return false;` (which can be confusing, I know).
- **Listen to events**
Validates field when a `change` and `blur` event is triggered (when option `validateOnBlur` is `true`, default behavior). 
- **Live validation**
It can validate in real time while user is typing, listening to `keyup` event when option `validateLive` is set to `true`. This is default behaviour but you can override in initialization.
- **Throttle**
To improve performance when live validation is enabled, you can use the `throttle` option to reduce the number of calls to validate(). This option specifies the number of milliseconds that should elapse between consecutive live validations.
- **Select2 compatibility**
If your field implement Select2, it will listen to `select2:close` and `change` events with jQuery. You should call FieldValidator after Select2 is initialized, otherwise you should call to FieldValidator.initSelect2() later.
- **Manual control**
    - Validate field with `HTMLElement.isValid()`
    - Set field as valid with `HTMLElement.setValid()`
    - Set field as invalid with `HTMLElement.setInvalid()`
- **Preset rules**
Required, minLength, maxLength, pattern test and isEmail is available by default. Set this options in initialization.
## How to use
- You can validate field with `HTMLElement.isValid()` method available in field.
- You can manually mark the field as valid with `HTMLElement.setValid()` and `HTMLElement.setInvalid()`
- FieldValidator class will be available as a property in the DOM element, so you can call `HTMLElement.FieldValidator` to access its properties and methods.
## Styling 🎨
You should use CSS rules to `.is-valid` and `.is-invalid` classes (or the ones you set in options). Here is an example of rules based on Bootstrap 5, please note this implement `var()` and `box-shadow` property.
```css
input,
select,
textarea,
.form-control,
.was-validated {
    --validation-valid-color: #6bd283;
    --validation-invalid-color: #d2786b;
}

input.is-valid,
select.is-valid,
textarea.is-valid,
.was-validated:valid,
.form-control.is-valid,
.was-validated .form-control:valid {
  border-color: var(--validation-valid-color, #28a745);
  padding-right: calc(1.5em + 0.75rem);
  background-image: url("data:image/svg+xml,%3csvg xmlns='http://www.w3.org/2000/svg' width='8' height='8' viewBox='0 0 8 8'%3e%3cpath fill='%236bd283' d='M2.3 6.73L.6 4.53c-.4-1.04.46-1.4 1.1-.8l1.1 1.4 3.4-3.8c.6-.63 1.6-.27 1.2.7l-4 4.6c-.43.5-.8.4-1.1.1z'/%3e%3c/svg%3e");
  background-repeat: no-repeat;
  background-position: right calc(0.375em + 0.1875rem) center;
  background-size: calc(0.75em + 0.375rem) calc(0.75em + 0.375rem);
  box-shadow: 0 0 10px -6px var(--validation-valid-color, #28a745);
}

.custom-select.is-valid,
.was-validated .custom-select:valid {
  border-color: var(--validation-valid-color, #28a745);
  padding-right: calc(0.75em + 2.3125rem);
  background: url("data:image/svg+xml,%3csvg xmlns='http://www.w3.org/2000/svg' width='4' height='5' viewBox='0 0 4 5'%3e%3cpath fill='%236bd283' d='M2 0L0 2h4zm0 5L0 3h4z'/%3e%3c/svg%3e")
      no-repeat right 0.75rem center/8px 10px, url("data:image/svg+xml,%3csvg xmlns='http://www.w3.org/2000/svg' width='8' height='8' viewBox='0 0 8 8'%3e%3cpath fill='%236bd283' d='M2.3 6.73L.6 4.53c-.4-1.04.46-1.4 1.1-.8l1.1 1.4 3.4-3.8c.6-.63 1.6-.27 1.2.7l-4 4.6c-.43.5-.8.4-1.1.1z'/%3e%3c/svg%3e")
      #fff no-repeat center right 1.75rem / calc(0.75em + 0.375rem) calc(
        0.75em + 0.375rem
      );
  box-shadow: 0 0 10px -6px var(--validation-valid-color, #28a745);
}

input.is-invalid,
select.is-invalid,
textarea.is-invalid,
.was-validated:invalid,
.form-control.is-invalid,
.was-validated .form-control:invalid {
  border-color: var(--validation-invalid-color, #dc3545);
  box-shadow: 0 0 10px -6px var(--validation-invalid-color, #dc3545);
  padding-right: calc(1.5em + 0.75rem);
  background-image: url("data:image/svg+xml,%3csvg xmlns='http://www.w3.org/2000/svg' width='12' height='12' fill='none' stroke='%23d2786b' viewBox='0 0 12 12'%3e%3ccircle cx='6' cy='6' r='4.5'/%3e%3cpath stroke-linejoin='round' d='M5.8 3.6h.4L6 6.5z'/%3e%3ccircle cx='6' cy='8.2' r='.6' fill='%23dc3545' stroke='none'/%3e%3c/svg%3e");
  background-repeat: no-repeat;
  background-position: right calc(0.375em + 0.1875rem) center;
  background-size: calc(0.75em + 0.375rem) calc(0.75em + 0.375rem);
}

.custom-select.is-invalid,
.was-validated .custom-select:invalid {
  border-color: var(--validation-invalid-color, #dc3545);
  padding-right: calc(0.75em + 2d2786b);
  background: url("data:image/svg+xml,%3csvg xmlns='http://www.w3.org/2000/svg' width='4' height='5' viewBox='0 0 4 5'%3e%3cpath fill='%23d2786b' d='M2 0L0 2h4zm0 5L0 3h4z'/%3e%3c/svg%3e")
      no-repeat right 0.75rem center/8px 10px, url("data:image/svg+xml,%3csvg xmlns='http://www.w3.org/2000/svg' width='8' height='8' viewBox='0 0 8 8'%3e%3cpath fill='%236bd283' d='M2.3 6.73L.6 4.53c-.4-1.04.46-1.4 1.1-.8l1.1 1.4 3.4-3.8c.6-.63 1.6-.27 1.2.7l-4 4.6c-.43.5-.8.4-1.1.1z'/%3e%3c/svg%3e")
      #fff no-repeat center right 1.75rem / calc(0.75em + 0.375rem) calc(
        0.75em + 0.375rem
      );
  box-shadow: 0 0 10px -6px var(--validation-invalid-color, #dc3545);
}
```
If you implement Select2 fields, you should also include styles for the Select2 container visible to users.

```css
.select2.is-valid span.select2-selection {
  border-color: var(--validation-valid-color, #28a745);
  box-shadow: 0 0 10px -6px var(--validation-valid-color, #28a745);
  padding-right: calc(0.75em + 2rem);
  background: url("data:image/svg+xml,%3csvg xmlns='http://www.w3.org/2000/svg' width='8' height='8' viewBox='0 0 8 8'%3e%3cpath fill='%236bd283' d='M2.3 6.73L.6 4.53c-.4-1.04.46-1.4 1.1-.8l1.1 1.4 3.4-3.8c.6-.63 1.6-.27 1.2.7l-4 4.6c-.43.5-.8.4-1.1.1z'/%3e%3c/svg%3e")
    #fff no-repeat center right 1.75rem / calc(0.75em + 0.375rem) calc(
      0.75em + 0.375rem
    );
}

.select2.is-invalid span.select2-selection {
  border-color: var(--validation-invalid-color, #dc3545);
  box-shadow: 0 0 10px -6px var(--validation-invalid-color, #dc3545);
  padding-right: calc(0.75em + 2rem);
  background: url("data:image/svg+xml,%3csvg xmlns='http://www.w3.org/2000/svg' width='12' height='12' fill='none' stroke='%23dc3545' viewBox='0 0 12 12'%3e%3ccircle cx='6' cy='6' r='4.5'/%3e%3cpath stroke-linejoin='round' d='M5.8 3.6h.4L6 6.5z'/%3e%3ccircle cx='6' cy='8.2' r='.6' fill='%23dc3545' stroke='none'/%3e%3c/svg%3e")
    #fff no-repeat center right 1.75rem / calc(0.75em + 0.375rem) calc(
      0.75em + 0.375rem
    );
}
```
