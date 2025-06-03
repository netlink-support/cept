function showMyModalSetTitle(id)
{
    $('.pay_cats').prop('checked', false);
    $("#pc_" + id).prop('checked', true);
    $('#catModal').modal('show');
}

$.validator.addMethod(
    "lettersonly", function (value, element) {
        return this.optional(element) || /^[a-z ]+$/i.test(value);
    }, "Only letters allowed"
);

$.validator.addMethod(
    'multicheckbox_rule', function (value, element) {
        if ($('.check_parent').find('.pay_cats').is(':checked')) {
            return true;
        }
        return false;
    }, 'Select one'
);

$("#cat_form").submit(
    function (e) {
        e.preventDefault();
    }
).validate(
    {
        onkeyup: false,
        rules: {
            fname: {
                required: true
            },
            lname: {
                required: true
            },
            email: {
                required: true,
                email: true
            },
            phone_num: {
                digits: true,
                minlength: 10,
                maxlength: 10
            },
            'cats[]': {
                required: true
            }

        },
        messages: {
            fname: "Enter first name.",
            lname: "Enter last name.",
            phone_num1: "Only numbers (10 digits).",
            email: "Enter a valid email id.",
            'cats[]': "Select atleast one."
        },
        errorPlacement: function (error, element) {
            if (element.attr('type') == 'checkbox') {
                error.insertAfter($(element).closest('div.check_parent'));
            } else
            {
                error.insertAfter(element);
            }
        },
        submitHandler: function (form) {
            var formData = $("#cat_form").serialize();

            $("#cat_form").html('<p>Thank you for downloading, you will receive an email with download link on given email id.</p>')

            setTimeout(
                function () {
                    $('#catModal').modal('hide');
                }, 4000
            );
        
                $.ajax(
                    {
                        url: site_url + "ajax.php?downloadcatalog",
                        type: "post",
                        async: false,
                        data: formData,
                        success: function (res) {

                        }
                    }
                );


                // form.submit();
        }
    }
);




