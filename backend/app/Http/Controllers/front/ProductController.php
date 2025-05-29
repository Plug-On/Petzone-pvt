<?php

namespace App\Http\Controllers\front;
use App\Models\OrderItem;
use Illuminate\Support\Facades\DB;
use App\Http\Controllers\Controller;
use App\Models\Brand;
use App\Models\Category;
use App\Models\Product;
use Illuminate\Http\Request;

class ProductController extends Controller
{
    public function getProducts(Request $request) {
        $products = Product::orderBy('created_at', 'desc')
                    ->where('status', 1);


    // Filter products by category
    if(!empty($request->category)) {
        $catArray = explode(',',$request->category);
        $products = $products->whereIn('category_id',$catArray);
    }

    // Filter brands by category
    if(!empty($request->brand)) {
        $brandArray = explode(',',$request->brand);
        $products = $products->whereIn('brand_id',$brandArray);
    }

        $products = $products->get();

        return response()->json([
            'status' => 200,
            'data' => $products
        ],200);
    }

    Public function latestProducts(){
        $products = Product::orderBy('created_at', 'desc')
                    ->where('status', 1)
                    ->limit(8)
                    ->get();
        return response()->json([
            'status' => 200,
            'data' => $products
        ],200);
    }

    Public function featuredproducts(){
        $products = Product::orderBy('created_at', 'desc')
                    ->where('status', 1)
                    ->where('is_featured', 'yes')
                    ->limit(8)
                    ->get();
        return response()->json([
            'status' => 200,
            'data' => $products
        ],200);
    }

    public function getCategories() {
        $categories = Category::orderBy('name','ASC')
        ->where('status' ,1 )
        ->get();

        return response()->json([
            'status' => 200,
            'data' => $categories
        ],200);
    }

    public function getBrands() {
        $brands = Brand::orderBy('name','ASC')
        ->where('status' ,1 )
        ->get();

        return response()->json([
            'status' => 200,
            'data' => $brands
        ],200);
    }

    public function getProduct($id) {

        $product = Product::with('product_images','product_sizes.size')->find($id);

        if($product==null){
            return response()->json([
                'status' => 404,
                'message' => 'Product not found'
            ],404);
        }

        return response()->json([
            'status' => 200,
            'data' => $product
        ],200);
    }

     public function getProductsByCategory($categoryId){
    $products = Product::with('product_images')
        ->where('category_id', $categoryId)
        ->where('status', 1)
        ->latest()
        ->get();

    return response()->json([
        'status' => 200,
        'data' => $products
    ],200);
    }

public function topSold()
{
 $topProducts = OrderItem::select('product_id')
    ->selectRaw('COUNT(*) as total_sold')
    ->groupBy('product_id')
    ->orderByDesc('total_sold')
    ->take(4)
    ->get()
    ->pluck('product_id');

$products = Product::with('product_images')
    ->whereIn('id', $topProducts)
    ->get();

return response()->json([
    'status' => 200,
    'data' => $products
], 200);

}
}
