class Validator {
    constructor(formSelector) {
        this.formSelector = formSelector;
        this.formElement = document.querySelector(formSelector);
        this.formRules = {};
        this.validatorRules = {
            required: (value) => (value ? undefined : 'Trường này không được phép để trống'),
            email: (value) => {
                const regex = /^[a-z][a-z0-9_.]{5,32}@[a-z0-9]{2,}(\.[a-z0-9]{2,4}){1,2}$/gm;
                return regex.test(value) ? undefined : 'Địa chỉ Email không hợp lệ';
            },
            // eslint-disable-next-line arrow-body-style
            min: (min) => (value) => {
                return value.length >= min ? undefined : `Trường này yêu cầu tối thiểu ${min} ký tự`;
            },
        };
        this.inputs = this.formElement.querySelectorAll('[name][data-rules]');
        this.inputs.forEach((input) => {
            const rules = input.dataset.rules.split('|');
            rules.forEach((rule) => {
                const isRuleHasValue = rule.includes(':');
                let ruleDetail;

                if (isRuleHasValue) {
                    ruleDetail = rule.split(':');
                    // eslint-disable-next-line no-param-reassign
                    [rule] = ruleDetail;
                }

                let ruleFunction = this.validatorRules[rule];

                if (isRuleHasValue) ruleFunction = ruleFunction(ruleDetail[1]);
                if (Array.isArray(this.formRules[input.name])) {
                    this.formRules[input.name].push(ruleFunction);
                } else this.formRules[input.name] = [ruleFunction];
                // eslint-disable-next-line no-param-reassign
                input.onblur = this.handleValidate;
                // eslint-disable-next-line no-param-reassign
                input.oninput = this.clearError;
            });
        });
        this.formElement.onsubmit = (e) => {
            e.preventDefault();
            let isValid = true;
            this.inputs.forEach((input) => {
                if (!this.handleValidate({ target: input })) isValid = false;
            });
            if (isValid) {
                const formData = {};
                this.inputs.forEach((input) => {
                    const { name, value } = input;
                    formData[name] = value;
                });
                if (this.onSubmit) this.onSubmit(formData);
                else this.formElement.submit();
            }
        };
    }

    getParent = (element, selector) => {
        this.parentElement = element.parentElement;
        while (this.parentElement) {
            if (this.parentElement.matches(selector)) return this.parentElement;
            this.parentElement = this.parentElement.parentElement;
        }
        return undefined;
    };

    handleValidate = (event) => {
        const rules = this.formRules[event.target.name];
        let errorMessage;
        // eslint-disable-next-line no-restricted-syntax
        for (const rule of rules) {
            errorMessage = rule(event.target.value);
            if (errorMessage) break;
        }
        if (errorMessage) {
            const formGroup = this.getParent(event.target, '.form-group');
            const formMessage = formGroup.querySelector('.form-message');

            formGroup.classList.add('invalid');
            if (formMessage) formMessage.innerText = errorMessage;
        }
        return !errorMessage;
    };

    clearError = (event) => {
        const formGroup = this.getParent(event.target, '.form-group');
        formGroup.classList.remove('invalid');
    };

    toggleError = (selector, isShow, message) => {
        const inputElement = document.querySelector(selector);
        if (inputElement) {
            const formGroup = this.getParent(inputElement, '.form-group');
            const formMessage = formGroup.querySelector('.form-message');
            formMessage.innerText = message;
            if (isShow) formGroup.classList.add('invalid');
            else formGroup.classList.remove('invalid');
        }
    };

    changeInputsVisibility = (isDisabled, showSpinnerSelector = undefined) => {
        const buttons = this.formElement.querySelectorAll('button');
        buttons.forEach((button) => {
            const { id, type } = button;
            const spinner = button.querySelector('.spinner-border');
            button.disabled = isDisabled;
            if (!showSpinnerSelector && type === 'submit') {
                spinner.classList.add('show');
            } else if (id.indexOf(showSpinnerSelector) !== -1) {
                spinner.classList.add('show');
            }
        });
        this.inputs.forEach((input) => {
            const inputElement = input;
            inputElement.disabled = isDisabled;
        });
    };
}

export default Validator;
