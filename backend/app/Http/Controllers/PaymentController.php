<?php

namespace App\Http\Controllers;

use App\Models\Order;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Http;

class PaymentController extends Controller
{
   public function esewaSuccess(Request $request)
{
    $pid = $request->query('pid');
    $refId = $request->query('refId');
    $amt = $request->query('amt');

    $verifyResponse = Http::asForm()->post('https://rc-epay.esewa.com.np/api/epay/verify/v1', [
        'amt' => $amt,
        'refId' => $refId,
        'pid' => $pid,
        'scd' => 'EPAYTEST'
    ]);

    if ($verifyResponse->successful() && str_contains($verifyResponse->body(), 'Success')) {
        Order::where('id', $pid)->update([
            'payment_status' => 'paid',
            'status' => 'processing'
        ]);

        return redirect("http://localhost:5173/confirmation/{$pid}");

    }

    return redirect("/order/failure");
}

public function esewaFailure(Request $request)
{
    $pid = $request->query('pid');

    Order::where('id', $pid)->update([
        'status' => 'failed',
        'payment_status' => 'failed'
    ]);

    return redirect("/order/failure");
}

}
