<div id="payment-form" class="Box_container__azYY2_cs" style="background-color:#F0F2F7;">
<h4>Pay with Credit or Debit Card</h4>
<script src="https://js.stripe.com/v3/"></script>			
<div id="card-element"><!-- Stripe.js will inject the card element here --></div>
<!--<div>
	<label for="card-number">Card Number</label>
	<div id="card-number"></div>
</div>
<div>
	<label for="card-expiry">Expiration Date</label>
	<div id="card-expiry"></div>
</div>
<div>
	<label for="card-cvc">CVC</label>
	<div id="card-cvc"></div>
</div>-->
<input type="submit" id="makePayment" value="Book now" class="chbs-button chbs-button-style-1 chb1s-button-step-next btn btn-success">
<div id="card-errors" role="alert"></div>
<style>#makePayment{padding:10px 32px 10px 32px;width: auto !important;margin-top: 15px;}.loader_gif{
		        width: 30px;
                margin: 0 auto;
	}.chbs-main-content-step-4 .chbs-button-step-next{display: none;}#card-element{margin-bottom: 20px;margin-top: 32px;}</style>
</div>
<div class="loader_gif" style="display: none;"><img decoding="async" src="image/loader.gif"></div>
<div id="payment-request-button"></div>
<script src="js/stripe.js"></script>		