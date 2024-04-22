import APIFilters from "../Utils/apiFilter.js"
import ErrorHandler from "../Utils/errorHandler.js"
import catchAsyncError from "../middlewares/catchAsyncError.js"
import Product from "../models/product.js"

// get Product => /api/products
export const getProducts = async (req, res) => {

    const resPerPage = 4
    const apiFilters = new APIFilters(Product, req.query).search().filters()
    let products = await apiFilters.query
    let filteredProductCount = products.length

    apiFilters.pagination(resPerPage)
    products = await apiFilters.query.clone()

    res.status(200).json({
        resPerPage,
       filteredProductCount,
       products,
    })
}

// Create new Product => /api/admin/products
export const newProducts = async (req, res) => {
    const product = await Product.create(req.body)

    res.status(200).json({
        product,
    })
}

// Get a single Product details => /api/products/:id
export const getProductDetails = catchAsyncError(async (req, res, next) => {
    
    const product = await Product.findById(req?.params?.id)
    
    if (!product) {
    return next(new ErrorHandler("Product not found", 404))

    }
    res.status(200).json({
        product
    })
})

// Update Product details => /api/products/:id
export const updateProduct = catchAsyncError(async (req, res) => {
    let product = await Product.findById(req?.params?.id)
    
    if (!product) {
        return next(new ErrorHandler("Product not found", 404))
    
        }

    product = await Product.findByIdAndUpdate(req?.params?.id, req.body, { new: true })

    res.status(200).json({
        product
    })
})

// Delete Product => /api/products/:id
export const deleteProduct = catchAsyncError(async (req, res) => {
    const product = await Product.findById(req?.params?.id)
    
    if (!product) {
        return next(new ErrorHandler("Product not found", 404))
    
        }

    await product.deleteOne()
    
    res.status(200).json({
        message: "Product Deleted"
    })
})

