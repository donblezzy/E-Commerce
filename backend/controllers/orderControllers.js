import ErrorHandler from "../Utils/errorHandler.js";
import catchAsyncError from "../middlewares/catchAsyncError.js";
import Order from "../models/order.js";
import Product from "../models/product.js"

//CREATE NEW ORDER => /api/orders/new
export const newOrder = catchAsyncError(async (req, res, next) => {
    const {
        orderItems,
        shippingInfo,
        itemsPrice,
        taxAmount,
        shippingAmount,
        totalAmount,
        paymentMethod,
        paymentInfo
    } = req.body

    const order = await Order.create({
        orderItems,
        shippingInfo,
        itemsPrice,
        taxAmount,
        shippingAmount,
        totalAmount,
        paymentMethod,
        paymentInfo,
        user: req.user._id
    })

    res.status(200).json(
        order
    )
})

//GET ORDER DETAILS => /api/orders/:id
export const getOrderDetails = catchAsyncError(async (req, res, next) => {
    const order = await Order.findById(req.params.id).populate("user", "name email")

    if(!order) {
        return next(new ErrorHandler("No order found with this ID", 404))
    }

    res.status(200).json(
        order
    )
})

//GET CURRENT USER ORDER DETAILS => /api/me/orders
export const myOrders = catchAsyncError(async (req, res, next) => {
    const orders = await Order.find({ user: req.user._id})

    res.status(200).json(
        orders
    )
})

//GET ALL ORDER |(ADMIN) => /api/admin/orders
export const allOrders = catchAsyncError(async (req, res, next) => {
    const orders = await Order.find()

    res.status(200).json(
        orders
    )
})

//UPDATE ORDER |(ADMIN) => /api/admin/orders/:id
export const updateOrder = catchAsyncError(async (req, res, next) => {
    const order = await Order.findById(req.params.id)

    if(!order) {
        return next(new ErrorHandler("No order found with this ID", 404))
    }
    
    //OPTIONAL
    if(order?.orderStatus === "Delivered") {
        return next(new ErrorHandler("You have already delivered this order", 404))
    }

    // SUBTRACTING THE ORDER FROM THE PRODUCTLIST/ UPDATING PRODUCTS STOCK AFTER SHIPPING THE ORDER
    order?.orderItems?.forEach(async (item) => {
        const product = await Product.findById(item?.product?.toString())

        if(!product) {
            return next(new ErrorHandler("No Product found with this ID", 404))
        }

        product.stock = product.stock - item.quantity
        await product.save({ validateBeforeSave: false })
    })

    order.orderStatus = req.body.status
    order.deliveredAt = Date.now()

    await order.save()

    res.status(200).json({
        success: "Order Shipped Successfully"
        })
})

//  DELETE ORDER => /api/admin/orders/:id
export const deleteOrder = catchAsyncError(async (req, res, next) => {
    const order = await Order.findById(req.params.id)

    if(!order) {
        return next(new ErrorHandler("No order found with this ID", 404))
    }

    await order.deleteOne()

    res.status(200).json({
        success: "Order deleted Successfully"
    })
})


async function getSalesData(startDate, endDate) {

    const salesData = await Order.aggregate([
        {
            // Stage 1 - Filter results
            $match: {
                createdAt: {
                    $gte: new Date(startDate),
                    $lte: new Date(endDate)
                }
            }
        },

        {
            // Stage 2 - Group Data
            $group: {
                _id: {
                    date: { $dateToString: { format:"%d-%m-%Y", date: "$createdAt" }}
                },
                totalSales: { $sum: "$totalAmount"},
                numOrder: { $sum: 1} // Count the number of orders
            }
        }
    ])

    console.log(salesData);
}

// Get Sales Data => /api/admin/get_sales
export const getSales = catchAsyncError(async (req, res, next) => {

    const startDate = new Date(req.query.startDate)
    const endDate = new Date(req.query.endDate)

    startDate.setHours(0, 0, 0, 0)
    endDate.setHours(23, 59, 59, 999)

    getSalesData(startDate, endDate)

    res.status(200).json({
        success: "true"
    })
})


