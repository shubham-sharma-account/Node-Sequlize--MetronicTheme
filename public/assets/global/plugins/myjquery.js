$(document).ready(function () {
    $('.error').delay(2000).fadeOut();
    $('#flashMsg').delay(4000).fadeOut();
    $("#submit-btn").click(function () {
        $( "#myform" ).validate()
        {
            $('input[name=name]').rules('add',                         //Author name validation
            {
                required:true
            });
            $('input[name="name"]').rules('add', {
                messages: {
                    required: "*Name is required"
                }
            });
            $('[name=phone]').rules('add',                             //Author phone validation
            {
                required:true
            });
            $('input[name="phone"]').rules('add', {                    
                messages: {
                    required: "*Phone number is required"
                }
            });
            $('[name=date]').rules('add',                             //Author date of birth validation
            {
                required:true
            });
            $('input[name="date"]').rules('add', {                    
                messages: {
                    required: "*Date is required"
                }
            });
            $('[name=salary]').rules('add',                             //Author salary validation
            {
                required:true
            });
            $('input[name="salary"]').rules('add', {                    
                messages: {
                    required: "*Salary is required"
                }
            });
            $('[name=email]').rules('add',                             //Author email of birth validation
            {
                required:true
            });
            $('input[name="email"]').rules('add', {                    
                messages: {
                    required: "*Email is required"
                }
            });
            $('[name=password]').rules('add',                             //Author password validation
            {
                required:true
            });
            $('input[name="password"]').rules('add', {                    
                messages: {
                    required: "*Password is required"
                }
            });
            $('[name=address1]').rules('add',                             //Author address validation
            {
                required:true
            });
            $('input[name="address1"]').rules('add', {                    
                messages: {
                    required: "*Address1 is required"
                }
            });
            $('[name=address2]').rules('add',                             //Author address validation
            {
                required:true
            });
            $('input[name="address2"]').rules('add', {                    
                messages: {
                    required: "*Address2 is required"
                }
            });
            $('[name=city]').rules('add',                             //Author city validation
            {
                required:true
            });
            $('input[name="city"]').rules('add', {                    
                messages: {
                    required: "*City is required"
                }
            });
            $('[name=state]').rules('add',                             //Author state validation
            {
                required:true
            });
            $('input[name="state"]').rules('add', {                    
                messages: {
                    required: "*State is required"
                }
            });
            $('[name=zip]').rules('add',                             //Author zip validation
            {
                required:true
            });
            $('input[name="zip"]').rules('add', {                    
                messages: {
                    required: "*Zip is required"
                }
            });
        }
    });
});



