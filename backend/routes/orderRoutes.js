const express = require("express");

const router = express.Router();

const Order = require("../models/Order");
const auth = require("../middleware/authMiddleware");


// =====================================================
// PLACE ORDER
// =====================================================

router.post("/", auth, async (req, res) => {
  try {

    console.log("🔥 Order request received");

    console.log(req.body);


    const {
      name,
      email,
      phone,
      address,
      items,
      total,
      paymentMethod
    } = req.body;


    if (
      !name ||
      !email ||
      !phone ||
      !address ||
      !items ||
      items.length === 0 ||
      total === undefined ||
      !paymentMethod
    ) {

      return res.status(400).json({

        success: false,

        message: "Missing order information"

      });

    }


    const order = new Order({

      name,

      email,

      phone,

      address,
       
      userId: req.user.userId,

      items,

      total,

      paymentMethod

    });


    const savedOrder =
      await order.save();


    console.log(
      "✅ Order saved:",
      savedOrder._id
    );


    res.status(201).json({

      success: true,

      message: "Order placed successfully",

      order: savedOrder

    });


  } catch (error) {

    console.error(
      "❌ Order Error:",
      error
    );


    res.status(500).json({

      success: false,

      message: "Failed to place order",

      error: error.message

    });

  }

});


// =====================================================
// GET ALL ORDERS
// =====================================================

router.get("/", async (req, res) => {

  try {

    console.log("📦 Getting all orders...");


    const orders =
      await Order.find()
        .sort({ createdAt: -1 });


    res.json({

      success: true,

      count: orders.length,

      orders

    });


  } catch (error) {

    console.error(
      "❌ Get Orders Error:",
      error
    );


    res.status(500).json({

      success: false,

      message: "Failed to get orders",

      error: error.message

    });

  }

});


// =====================================================
// UPDATE ORDER STATUS
// =====================================================

router.put("/:id/status", async (req, res) => {

  try {

    const {
      status
    } = req.body;


    const allowedStatuses = [

      "Pending",

      "Confirmed",

      "Shipped",

      "Delivered"

    ];


    if (
      !allowedStatuses.includes(status)
    ) {

      return res.status(400).json({

        success: false,

        message: "Invalid order status"

      });

    }


    const order =
      await Order.findByIdAndUpdate(

        req.params.id,

        {
          status: status
        },

        {
          new: true
        }

      );


    if (!order) {

      return res.status(404).json({

        success: false,

        message: "Order not found"

      });

    }


    console.log(
      `📦 Order ${order._id} → ${status}`
    );


    res.json({

      success: true,

      message:
        "Order status updated successfully",

      order

    });


  } catch (error) {

    console.error(
      "❌ Status Error:",
      error
    );


    res.status(500).json({

      success: false,

      message: "Failed to update order status",

      error: error.message

    });

  }

});


// =====================================================
// DELETE ORDER
// =====================================================

router.delete("/:id", async (req, res) => {

  try {

    const order =
      await Order.findByIdAndDelete(
        req.params.id
      );


    if (!order) {

      return res.status(404).json({

        success: false,

        message: "Order not found"

      });

    }


    res.json({

      success: true,

      message:
        "Order deleted successfully"

    });


  } catch (error) {

    console.error(
      "❌ Delete Order Error:",
      error
    );


    res.status(500).json({

      success: false,

      message: "Failed to delete order",

      error: error.message

    });

  }

});


module.exports = router;