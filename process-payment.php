
<?php
require 'vendor/autoload.php';
\Stripe\Stripe::setApiKey('secret_key');
header('Content-Type: application/json');
$input = json_decode(file_get_contents('php://input'), true);

try {
    if (isset($input['paymentMethodId'])) {
        $paymentIntent = \Stripe\PaymentIntent::create([
            'amount' => $input['amount'], // Amount in cents (e.g., $50.00)
            'currency' => 'eur',
            'payment_method' => $input['paymentMethodId'],
            'confirm' => true,
            'automatic_payment_methods' => [
                'enabled' => true,
                'allow_redirects' => 'never'
            ],
             // Set to "always" or "never"
        ]);

        if ($paymentIntent->status === 'requires_action' || $paymentIntent->status === 'requires_source_action') {
            echo json_encode(['requiresAction' => true, 'paymentIntentId' => $paymentIntent->id]);
        } else if ($paymentIntent->status === 'succeeded') {
            session_start();
			$_SESSION['transaction_id'] = $paymentIntent->id;
            echo json_encode(['success' => true]);
        } else {
            throw new Exception('Invalid PaymentIntent status');
        }
    } else {
        throw new Exception('PaymentMethod ID not provided');
    }
} catch (\Stripe\Exception\ApiErrorException $e) {
    echo json_encode(['error' => $e->getMessage()]);
} catch (Exception $e) {
    echo json_encode(['error' => $e->getMessage()]);
}
