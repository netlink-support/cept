//PAN card upload
document.getElementById("pan_copy").onchange = function () {
    document.getElementById("pdfuploadFile").value = this.value.split('\\').pop();
    document.getElementById("pay_card").value = this.value.split('\\').pop();
    document.getElementById("pdfuploadFile").style.borderBottom = "1px solid #E4891B";
};

//Endowment Functions
var endowment = {
    isInt: function (value) {
        return !isNaN(value) &&
                parseInt(Number(value)) == value &&
                !isNaN(parseInt(value, 10));
    },
    changeEndType: function (val) {
        $('.pay-currency').css('display', '');
        $('#faculty').removeAttr('required');
        $('#program').removeAttr('required');
        $('#year_enroll').removeAttr('required');
        if (val == 'B') {
            $('.pay-currency').css('display', 'none');
            $('#faculty').attr('required', 'required');
            $('#program').attr('required', 'required');
            $('#year_enroll').attr('required', 'required');

            $('.pay_cats').removeAttr('checked');
            $('.cat_value').val('');

        } else if (val == 'I') {

        }
    },
    changeTranType: function (val) {
        $('.recurring-div').css('display', '');
        $('#frequency').removeAttr('required');
        $('#no_installments').removeAttr('required');
        if (val == 'O') {
            $('.recurring-div').css('display', 'none');
        } else if (val == 'R') {
            $('#frequency').attr('required', 'required');
            $('#no_installments').attr('required', 'required');
        }
    },
    requestPan: function (val) {
        $('.pan-details').css('display', 'none');
        $('#pay_pan_number').removeAttr('required');
        $('#pay_pan_number').removeAttr('required');
        if (val) {
            $('.pan-details').css('display', '');
            $('#pay_pan_number').attr('required', 'required');
            $('#pay_pan_number').attr('required', 'required');
        }
    },
    showRccMessage: function () {
        var amount = $('#amount').val();
        var transaction_type = $("input[name='transaction_type']:checked").val();
        var frequency = $('#frequency').val();
        var installments = $('#no_installments').val();

        var msg = '';
        $('.rec-msg').html('');

        if (transaction_type == 'R') {
            if (parseInt(amount) > 0 && parseInt(frequency) > 0 && parseInt(installments) > 0) {
                var recurring_amount = parseInt(Math.ceil(amount / installments));
                msg = "<b>Please note:</b> You have chosen to pay <u><em>" + recurring_amount + " INR every " + frequency + " month(s) with " + installments + " installments</em></u>";
                $('.rec-msg').html(msg);
                $("#rec_amount").val(recurring_amount);
            }
        }
    },
    openText: function (val, pc_id) {
        var ele = $(document).find("input[data-pct-id='" + pc_id + "']");
        ele.removeAttr('required');
        ele.attr('disabled', 'disabled');
        ele.attr('readonly', 'readonly');
        ele.val('');
        if (val) {
            ele.attr('required', 'required');
            ele.removeAttr('disabled');
            ele.removeAttr('readonly');
        }
    },
    calculateBreakup: function () {
        //var end_type = $('.endowment_type').val();
        var end_type =  $('input[name=endowment_type]:checked').val();
        if (end_type != 'B') {
            var amount = $('#amount').val();
            var total_amount = 0;
            var msg = '';
            $('.breakup-details').html('');
            $(".pay-categories-div .cat_value").each(
                function () {
                    var curr = $(this).val();
                    if (endowment.isInt(curr)) {
                        total_amount = parseInt(total_amount) + parseInt(curr);
                    }
                }
            );
            if (amount != total_amount) {
                msg = "<em style='color:red'>Total sum of break-up amount doesn't match with " + amount + " INR endowment amount</em>";
                $('.breakup-details').html(msg);
                return false;
            }
            return true;
        }
        return true;
    }
}


//Dynamic fields according to user selections

$(document).on(
    'ready', function (e) {
        $('.endowment_type').on(
            'change', function (e) {
                endowment.changeEndType($(this).val());
            }
        )
        $('.transaction_type').on(
            'change', function (e) {
                endowment.changeTranType($("input[name='transaction_type']:checked").val());
            }
        )
        $('.pan_request').on(
            'change', function (e) {
                endowment.requestPan($(this).is(':checked'));
            }
        )
        $('.transaction_type, #frequency, #amount, #no_installments').on(
            'change', function (e) {
                endowment.showRccMessage();
            }
        )
        $('.pay_cats').on(
            'change', function (e) {
                endowment.openText($(this).is(':checked'), $(this).data('pc-id'));
            }
        )
        $('.cat_value').on(
            'change', function (e) {
                endowment.calculateBreakup();
            }
        )
    }
);

//Form validation methods

$.validator.addMethod(
    "lettersonly", function (value, element) {
        return this.optional(element) || /^[a-z ]+$/i.test(value);
    }, "Only letters allowed"
);

$.validator.addMethod(
    "validatePAN", function (value, element) {
        var regExp = /[a-zA-z]{5}\d{4}[a-zA-Z]{1}/;
        if (value.length == 10) {
            if (value.match(regExp)) {
                return true;
            } else
            {
                return false;
            }
        } else
        {
            return false;
        }
    }, "Invalid PAN number"
);



$.validator.addMethod(
    "duplicateEmail", function (value, element) {
        var valid = true;
        $.ajax(
            {url: js_base + 'ajax/check_duplicate',
                data: {field: 'email', value: value},
                async: false,
                method: 'post',
                beforeSend: function () {
                    $(element).after('<div style="margin-top: -40px; float: right;" id="loader_' + $(element).attr('name') + '"><img style="height:25px;" src="' + js_base + '/assets/img/loader.gif"></div>');
                },
                complete: function () {
                    setTimeout(
                        function () {
                            $('#loader_' + $(element).attr('name')).remove();
                        }, 500
                    );
                },
                success: function (msg) {
                    valid = msg === "true" ? true : false
                }
            }
        );
        return valid;
    }, 'Email ID already registered'
);

$.validator.addMethod(
    'filesize', function (value, element, param) {
        return this.optional(element) || (element.files[0].size <= param)
    }, 'File size must less than 500KB'
);


$.validator.addMethod("nameRequired", $.validator.methods.required, "Enter Insturctor Name");
$.validator.addMethod("emailRequired", $.validator.methods.required, "Enter Insturctor Email");
$.validator.addMethod("phoneRequired", $.validator.methods.required, "Enter Insturctor Phone");
$.validator.addMethod("profileRequired", $.validator.methods.required, "Enter Insturctor Profile");
$.validator.addMethod("photoRequired", $.validator.methods.required, "Upload Insturctor Photograph");
$.validator.addMethod("facultyrequired", $.validator.methods.required, "Please select an option");
$.validator.addMethod("frequencyrequired", $.validator.methods.required, "Please select frequency");
$.validator.addMethod("insrequired", $.validator.methods.required, "Please select number of installments");
$.validator.addMethod("pnrequired", $.validator.methods.required, "Please enter valid PAN number");
$.validator.addMethod("pcrequired", $.validator.methods.required, "Please select PAN card file in image or pdf format");
$.validator.addMethod("catrequired", $.validator.methods.required, "Total amount value doesn't match");

$.validator.addClassRules(
    {
        cat_value: {
            catrequired: function (element) {
                var val = $(element).closest('input.pay_cats').is(':checked');
                if (val) {
                    return true;
                } else
                {
                    return false;
                }
            },
            digits: true
        }
    }
);

//Endowment Form Validation

$("#payment_form").submit(
    function (e) {
        e.preventDefault();
    }
).validate(
    {
        onkeyup: false,
        rules: {
            endowment_type: {
                required: true
            },
            faculty: {
                facultyrequired: function (element) {
                    var val = $('#endowment_type').val();
                    if (val == 'B') {
                        return true;
                    } else
                    {
                        return false;
                    }
                },
            },
            program: {
                facultyrequired: function (element) {
                    var val = $('#endowment_type').val();
                    if (val == 'B') {
                        return true;
                    } else
                    {
                        return false;
                    }
                },
            },
            year_enroll: {
                facultyrequired: function (element) {
                    var val = $('#endowment_type').val();
                    if (val == 'B') {
                        return true;
                    } else
                    {
                        return false;
                    }
                },
            },
            payment_type: {
                required: true
            },
            transaction_type: {
                required: true
            },
            frequency: {
                frequencyrequired: function (element) {
                    var val = $('#transaction_type').val();
                    if (val == 'R') {
                        return true;
                    } else
                    {
                        return false;
                    }
                },
            },
            no_installments: {
                insrequired: function (element) {
                    var val = $('#transaction_type').val();
                    if (val == 'R') {
                        return true;
                    } else
                    {
                        return false;
                    }
                },
            },
            amount: {
                required: true,
                digits: true
            },
            fname: {
                required: true
            },
            lname: {
                required: true
            },
            address1: {
                required: true
            },
            address2: {
                required: true
            },
            email: {
                required: true,
                email: true
            },
            phone_num1: {
                digits: true,
                required: true,
                minlength: 10,
                maxlength: 10
            },
            state: {
                required: true
            },
            city: {
                required: true
            },
            country: {
                required: true
            },
            pin_code: {
                required: true
            },
            pan_number: {
                pnrequired: function (element) {
                    var val = $('#pan_request').is(':checked');
                    if (val) {
                        return true;
                    } else
                    {
                        return false;
                    }
                },
                alphanumeric: true,
                validatePAN: true
            },
            pan_copy: {
                pcrequired: function (element) {
                    var val = $('#pan_request').is(':checked');
                    if (val) {
                        return true;
                    } else
                    {
                        return false;
                    }
                },
                accept: "application/pdf,image/jpeg,image/png",
                filesize: 2000000   //max size 2MB
            },
        
        },
        messages: {
            endowment_type: "Select one option",
            facultyrequired: "Select one option.",
            amount: "Enter amount.",
            transaction_type: "Select one option.",
            payment_type: "Select one option.",
            fname: "Enter first name.",
            lname: "Enter last name.",
            pin_code: "Enter PIN number.",
            address1: "Enter last address1.",
            address2: "Enter last address2.",
            phone_num1: {required: "Only numbers (10 digits)."},
            state: "Enter state.",
            city: "Enter City",
            country: "Select country",
            email: "Please enter a valid email id.",
            pan_copy: "Please select PAN card file in Image or PDF format.",
            pan_number: "Enter valid PAN number.",
        },
        errorPlacement: function (error, element) {
            if (element.attr('type') == 'checkbox') {
                error.insertAfter($(element).closest('div.chk-group'));
            } else if (element.attr('type') == 'radio') {
                error.insertAfter($(element).closest('div.chk-group'));
            } else
            {
                error.insertAfter(element);
            }
        },
        submitHandler: function (form) {
            var check = endowment.calculateBreakup();
            if (check) {
                form.submit();
            }
        }
    }
);




