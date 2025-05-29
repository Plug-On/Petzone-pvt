<?php

namespace App\Http\Controllers\Admin;

use App\Http\Controllers\Controller;
use Illuminate\Http\Request;

use App\Models\Product;
use App\Models\Brand;
use App\Models\Order;
use App\Models\Category;

class DashboardController extends Controller
{
    public function getCounts()
    {
        return response()->json([
            'brands' => Brand::count(),
            'orders' => Order::count(),
            'products' => Product::count(),
            'categories' => Category::count(),
        ]);
    }
}
