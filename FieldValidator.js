class FieldValidator {
  constructor(field, options = {}) {
    this.validationErrors = [];
    this.throttleTimeout = false;
    this.defaultOptions = {
      successMessage: "", // Allows you to set a custom success message to be displayed when the field is valid
      validateOnBlur: true, // Validates the field when it loses focus
      validateLive: true, // Allows you to control whether validations should be performed live as the user types, or only when the field loses focus
      throttle: 700, // The throttle property specifies the number of milliseconds that should elapse between consecutive live validations. You can use the throttle property to reduce the number of calls to validate() and improve performance when validateLive is set to true.
      customValidators: [],

      elementSelect2: false,

      errorDisplay: "container",
      errorContainer: false, // HTML Element where the error messages should be displayed

      classValid: "is-valid",
      classInvalid: "is-invalid",
      classWasValidated: "was-validated",

      // Generic rules
      required: false,
      minLength: false,
      maxLength: false,
      pattern: false,
      isEmail: false,
    };

    if(typeof field === "string") {
      const queriedField = document.querySelector(field);
      if(queriedField) field = queriedField;
    } else if (typeof field === "object" && (field instanceof HTMLElement)) {
      this.field = field;
    } else {
      return false;
    }
    this.field.classList.add("will-validate");
    this.field.FieldValidator = this;
    
    this.options = { ...this.defaultOptions, ...options };
    this.customValidators = this.options.customValidators || [];
    this.errorContainer = this.options.errorContainer;

    // Find a possible Select2 element
    if(this.field.tagName === "SELECT") setTimeout( () => this.initSelect2(), 1000);
    
    // Bind these methods to the HTML Element
    this.field.isValid = this.isValid.bind(this);
    this.field.setValid = this.setValid.bind(this);
    this.field.setInvalid = this.setInvalid.bind(this);

    // Attach change/blur/keyup events
    this.addListeners();
  }

  addListeners() {
      this.field.addEventListener("input", this.validate.bind(this));

      if (this.options.validateOnBlur) {
        this.field.addEventListener("blur", this.validate.bind(this));
      }

      // If validateLive is set to true, you can call validate() in the keyup event handler to perform validations as the user types
      this.field.addEventListener("keyup", () => {
        if (this.options.validateLive) {
          clearTimeout(this.throttleTimeout);
          this.throttleTimeout = setTimeout(() => {
            this.validate();
          }, this.options.throttle);
        }
      });
  }

  removeListeners() {
    this.field.removeEventListener("input", this.validate.bind(this));
    this.field.removeEventListener("blur", this.validate.bind(this));
    
    if (this.options.elementSelect2 instanceof HTMLElement && "undefined" != globalThis.jQuery) {
      // Dettach event listener with jQuery
      const self = this;
      jQuery(this.field).off("change select2:close", self.validate.bind(self));
    }
  }

  addCustomValidator(validator) {
    this.customValidators.push(validator);
  }

  getErrorContainer() {
    if (this.errorContainer instanceof HTMLElement) {
      return this.errorContainer;
    }

    if (
      this.errorContainer === false &&
      this.field &&
      this.field.nextElementSibling
    ) {
      let i = 0;
      let errorContainerFound = false;
      let maybeErrorContainer = this.field.nextElementSibling;
      do {
        if (
          maybeErrorContainer instanceof HTMLElement &&
          maybeErrorContainer.tagName == "DIV" &&
          (maybeErrorContainer.classList.contains("feedback") ||
            maybeErrorContainer.classList.contains("valid-feedback") ||
            maybeErrorContainer.classList.contains("invalid-feedback"))
        ) {
          errorContainerFound = true;
          this.errorContainer = maybeErrorContainer;
          return maybeErrorContainer;
        }
        i++
        maybeErrorContainer = maybeErrorContainer.nextElementSibling;

      } while (maybeErrorContainer && !errorContainerFound && i < 3);
    }

    return false;
  }

  isValid() {
    this.validate();
    if (this.validationErrors.length === 0) return true;
    return false;
  }

  validate() {
    this.reset();
    const value = this.field.value;

    // Common validators
    if (this.options.required && value === "") {
      this.validationErrors.push("This field is required.");
    }
    if (this.options.minLength && value.length < this.options.minLength) {
      this.validationErrors.push(
        `This field must be at least ${this.options.minLength} characters long.`
      );
    }
    if (this.options.maxLength && value.length > this.options.maxLength) {
      this.validationErrors.push(
        `This field cannot be more than ${this.options.maxLength} characters long.`
      );
    }
    if (this.options.isEmail) {
      const emailRegex =
        /^(([^<>()\[\]\\.,;:\s@"]+(\.[^<>()\[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/;
      if (!emailRegex.test(this.field.value)) {
        this.validationErrors.push(`This field must be a valid email address.`);
      }
    }
    if (this.options.pattern) {
      const pattern = new RegExp(this.options.pattern);
      if (!pattern.test(value)) {
        this.validationErrors.push("This field is invalid.");
      }
    }

    // Test for custom validators
    for (const validator of this.customValidators) {
      const error = validator(value, this.field);
      if (error) {
        this.validationErrors.push(error);
      }
    }

    this.field.setCustomValidity(
      this.validationErrors.length > 0 ? this.validationErrors[0] : ""
    );

    this.displayFeedback();

    console.log("Validating ",this.validationErrors.length == 0);
    return this.validationErrors.length == 0;
  }

  setValid() {
    this.field.classList.add(this.options.classValid);
    this.field.classList.remove(this.options.classInvalid);

    if (this.options.errorDisplay === "container" && this.getErrorContainer()) {
      this.getErrorContainer().classList.add("feedback-valid");
      this.getErrorContainer().classList.remove("feedback-invalid");
    }

    if(this.options.elementSelect2) {
      this.options.elementSelect2.classList.add(this.options.classValid);
      this.options.elementSelect2.classList.remove(this.options.classInvalid);
    }
  }

  setInvalid() {
    this.field.classList.add(this.options.classInvalid);
    this.field.classList.remove(this.options.classValid);

    if (this.options.errorDisplay === "container" && this.getErrorContainer()) {
      this.getErrorContainer().classList.remove("feedback-valid");
      this.getErrorContainer().classList.add("feedback-invalid");
    }

    
    if(this.options.elementSelect2) {
      this.options.elementSelect2.classList.remove(this.options.classValid);
      this.options.elementSelect2.classList.add(this.options.classInvalid);
    }
  }

  reset() {
    this.field.classList.remove([
      this.options.classValid,
      this.options.classInvalid,
    ]);
    this.validationErrors = [];
    this.field.setCustomValidity("");
    if (this.getErrorContainer()) this.getErrorContainer().innerHTML = "";
  }

  displayFeedback() {
    this.field.classList.add(this.options.classWasValidated);

    if (this.validationErrors.length > 0) {
      this.setInvalid();

      if (this.options.errorDisplay === "container") {
        this.displayErrorsInContainer();
      } else if (this.options.errorDisplay === "inline") {
        this.displayErrorsInline();
      } else {
        console.log(this.validationErrors);
      }
    } else {
      this.setValid();

      if (this.options.successMessage && this.options.successMessage != "") {
        if (this.options.errorDisplay === "container") {
          this.getErrorContainer().innerHTML = this.options.successMessage;
        } else {
          console.log(this.options.successMessage);
        }
      }
    }
  }

  displayErrorsInline() {
    this.field.setAttribute(
      "title",
      this.validationErrors.length > 0 ? this.validationErrors[0] : ""
    );
  }

  displayErrorsInContainer() {
    if (!this.getErrorContainer()) {
      return;
    }

    this.getErrorContainer().innerHTML = "";
    if (this.validationErrors.length > 0) {
      for (const error of this.validationErrors) {
        const errorItem = document.createElement("div");
        errorItem.innerText = error;
        this.getErrorContainer().appendChild(errorItem);
      }
    }
  }

  getErrors() {
    return this.validationErrors;
  }

  initSelect2() {
    if(this.options.elementSelect2 == false) {
      this.options.elementSelect2 = (this.field.classList.contains("select2-hidden-accessible") && this.field.nextElementSibling && this.field.nextElementSibling.classList.contains("select2-container")) ? this.field.nextElementSibling : false;
    }
    if (this.options.elementSelect2 instanceof HTMLElement && "undefined" != globalThis.jQuery) {
      // Attach event listener with jQuery
      const self = this;
      jQuery(this.field).on("change select2:close", self.validate.bind(self));
      return true;
    }
    return false;
  }
}
