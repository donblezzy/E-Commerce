import catchAsyncError from "../middlewares/catchAsyncError.js";
import Stripe from "stripe";
import product from "../models/product.js";

const stripe = Stripe(process.env.STRIPE_SECRET_KEY);

// Create stripe checkout session => /api/payment/checkout_session
export const stripeCheckoutSession = catchAsyncError(async (req, res, next) => {
  const body = req?.body;
  const line_items = body?.orderItems?.map((item) => {
    return {
        price_data: {
            currency: "usd",
            product_data: {
                name: item?.name,
                images: [item?.image],
                metadata: { productId: item?.product },
            },
            // because we want it to be in dollars
            unit_amount: item?.price * 100
        },
        tax_rates: ["txr_1PIWD605HB41KwPhWwtRnZGB"],
        quantity: item?.quantity
    };
  });

  const shippingInfo = body?.shippingInfo

  const shipping_rate =
    body?.itemsPrice >= 200
      ? "shr_1PIW0i05HB41KwPhjcUG16Ls"
      : "shr_1PIVzo05HB41KwPhou63FufW";

  const session = await stripe.checkout.sessions.create({
    payment_method_types: ["card"],
    success_url: `${process.env.FRONTEND_URL}/me/orders`,
    cancel_url: `${process.env.FRONTEND_URL}`,
    customer_email: req?.user?.email,
    client_reference_id: req?.user?._id?.toString(),
    mode: "payment",
    metadata: { ...shippingInfo, itemsPrice: body?.itemsPrice},
    shipping_options: [
      {
        shipping_rate,
      },
    ],
    line_items,
  });

  console.log(session);
  res.status(200).json({
    url: session.url
  })
});

const getOrderItems = async (line_items) => {
  return new Promise((resolve, reject) => {
    let cartItems = []

    line_items?.data?.forEach[async (item) => {
      const product = await stripe.products.retrieve(item.price.product)
      const productId = product.metadata.productId

      console.log('item', item);
      console.log('product', product);
      

      cartItems.push({
        product: productId,
        name: product.name,
        price: item.price.unit_amount_decimal / 100,
        quantity: item.quantity,
        image: product.images[0]
      })

      if (cartItems.length === line_items?.data?.length) {
        resolve(cartItems)
      }
    }]
  })
}

// Create new order after payment => /api/payment/webhook
export const stripeWebhook = catchAsyncError(async (req, res, next) => {
  try {
    const signature = req.headers["stripe-signature"]
    const event = stripe.webhooks.constructEvent(req.rawBody, signature, process.env.STRIPE_WEBHOOK_SECRET)
    if (event.type === "checkout.session.completed") {

      const session = event.data.object

      const line_items = await stripe.checkout.sessions.listLineItems(session.id)
      const orderItems = await getOrderItems(line_items)
      console.log(orderItems);

      res.status(200).json({ success: true })
    }
  } catch (error) {
    console.log("Error =>", error);
  }
})
