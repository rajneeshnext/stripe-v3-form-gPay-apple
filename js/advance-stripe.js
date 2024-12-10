//const stripe = Stripe('bbbb');
// This updated the price on dynamic class
const stripe = Stripe('bbbb');
const elements = stripe.elements();
const style = {
    base: {
        color: '#32325d',
        fontFamily: '"Helvetica Neue", Helvetica, sans-serif',
        fontSmoothing: 'antialiased',
        fontSize: '16px',
        '::placeholder': {
            color: '#aab7c4',
        },
        borderColor: '#cecece',
        borderWidth: '1px',
        borderRadius: '4px'
    },
    invalid: {
        color: '#fa755a',
        iconColor: '#fa755a'
    }
};
const card = elements.create('card', { style , hidePostalCode: true});
card.mount('#card-element');
let paymentRequest = stripe.paymentRequest({
    country: 'DK',
    currency: 'eur',
    total: {
        label: 'Cart Total',
        amount: 5000, // Default total in cents
    },
    requestPayerName: true,
    requestPayerEmail: true,
});

/*
const cardNumber = elements.create('cardNumber', { style });
cardNumber.mount('#card-number');

const cardExpiry = elements.create('cardExpiry', { style });
cardExpiry.mount('#card-expiry');

const cardCvc = elements.create('cardCvc', { style });
cardCvc.mount('#card-cvc');
*/
function getDynamicCartDetails() {
    var priceText = jQuery(".chbs-summary-price-element-total span:nth-of-type(2)").text();
    const total_amount = parseFloat(parseFloat(priceText.replace(/[^\d.-]/g, '')).toFixed(2) * 100);
	return {
        totalAmount: parseInt(total_amount), // Amount in cents
        currency: 'eur',       // Currency
        label: 'Booking Payment' // Dynamic label
    };
}
function getTempDynamicCartDetails() {
    var priceText = jQuery(".chbs-state-selected-li .chbs-vehicle-content-price span span").text();
    const total_amount = parseFloat(parseFloat(priceText.replace(/[^\d.-]/g, '')).toFixed(2) * 100);
	return {
        totalAmount: parseInt(total_amount), // Amount in cents
        currency: 'eur',       // Currency
        label: 'Booking Payment' // Dynamic label
    };
}
// Using dynamic values from getDynamicCartDetails
jQuery(document).on('click', '.chbs-main-content-step-4 .chbs-coupon-code-section .chbs-button', function() {
	//alert("Coupon"+cartDetails.totalAmount);
	// Update the payment request total
	setTimeout(function() {
		const cartDetails = getDynamicCartDetails();
		paymentRequest.update({
			total: {
				label: cartDetails.label,
				amount: cartDetails.totalAmount, // New total in cents
			},
		});
	}, 1000); 
});
//jQuery(document).on('click', '.chbs-main-content-step-4 .chbs-coupon-code-section .chbs-button', function() {
//jQuery('.chbs-main-content-step-4 .chbs-coupon-code-section .chbs-button').on('click', async (event) => {  
jQuery('.chbs-main-content-step-2 .chbs-button-step-next').on('click', async (event) => {  
	//alert("fffff");
    event.preventDefault();jQuery('.or-divider').hide();
    const cartDetails = getTempDynamicCartDetails();
    //alert(JSON.stringify(cartDetails));
    paymentRequest.update({
		total: {
			label: cartDetails.label,
			amount: cartDetails.totalAmount, // New total in cents
		},
	});
    //alert("nnnn");
    //alert("Payment Request Object: " + JSON.stringify(paymentRequest));
    paymentRequest.canMakePayment().then(function(result) {
        //alert("mmm"+result);
        if (result) {//alert("qqqq");
            jQuery('.or-divider').show();
            const prButton = elements.create('paymentRequestButton', { paymentRequest });
            prButton.mount('#payment-request-button');
        } else {//alert("llll");
            jQuery('.or-divider').hide();
            document.getElementById('payment-request-button').style.display = 'none';
        }
    }).catch(function(error) {
        alert("Error with canMakePayment, try other mode: " + error.message);
    });
    
    paymentRequest.on('paymentmethod', async (ev) => {
        try {			
            const response = await fetch('/stripe/process-payment.php', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ paymentMethodId: ev.paymentMethod.id, amount: cartDetails.totalAmount })
            });
            const data = await response.json();
    
            if (data.error) {
                ev.complete('fail');
                document.getElementById('card-errors').textContent = data.error;
            } else {
                ev.complete('success');
                alert('Payment successful!');
                jQuery('.chbs-main-content-step-4 .chbs-button-step-next').trigger('click');
            }
        } catch (error) {
            ev.complete('fail');
            document.getElementById('card-errors').textContent = error.message;
        }
    });

});

document.getElementById('makePayment').addEventListener('click', async (event) => {
    jQuery('.loader_gif').show();
    event.preventDefault();
    var priceText = jQuery(".chbs-summary-price-element-total span").eq(1).text();
	const total_amount = parseFloat(parseFloat(priceText.replace(/[^\d.-]/g, '')).toFixed(2) * 100);
    var email = jQuery(".chbs-summary-field-E-mail-address .chbs-summary-field-value").text();
    //return;
    const { error, paymentMethod } = await stripe.createPaymentMethod({
        type: 'card',
        card: card,
        billing_details: { email: email}
    });

    if (error) {
        document.getElementById('card-errors').textContent = error.message;
        jQuery('.loader_gif').hide();
    } else {
        const response = await fetch('/stripe/process-payment.php', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ paymentMethodId: paymentMethod.id, amount: parseInt(total_amount) })
        });
        const data = await response.json();

        if (data.error) {
            jQuery('.loader_gif').hide();
            document.getElementById('card-errors').textContent = data.error;
        } else {
            //jQuery('.loader_gif').hide();
            //alert('Payment successful!');
            jQuery('.chbs-main-content-step-4 .chbs-button-step-next').trigger('click');
        }
    }
});
