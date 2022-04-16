const request = require('axios').default;
const config = require('../../config');
const paypal_config = config.services.paypal;

const PAYPAL_API = config.server.enviroment === "production" ? "https://api-m.paypal.com" : "https://api-m.sandbox.paypal.com"

function resolve_error(err) {
  const res = err.response;
  if (!res) throw err // Internal internal error, throw it 
  // Service error, parse error handler response
  const error = new Error(err.cause);
  const dataError = res.data;
  error.errorDetails = {
    paypal: {
      name: dataError.name,
      details: dataError.details
    }
  };
  throw error;
}


async function createOrder(purchase_units) {
  const accessToken = await generateAccessToken();
  const body = {
    intent: 'CAPTURE',
    purchase_units: purchase_units,
    application_context: {
      brand_name: "Delilah resto",
      landing_page: "NO_PREFERENCE",
      user_action: "PAY_NOW",
      return_url: paypal_config.return_callback_url,
      cancel_url: paypal_config.cancel_callback_url,
    }
  }
  let response;
  try {
    response = await request.post(`${PAYPAL_API}/v2/checkout/orders`, 
      body,
      {
        headers: {
          "Content-Type": "application/json",
          "Authorization": `Bearer ${accessToken}`
        }
      }
    );
  } catch (err) {
    resolve_error(err)
  }

  return response.data;
}

async function capturePayment(orderId) {
  const accessToken = await generateAccessToken();
  const url = `${base}/v2/checkout/orders/${orderId}/capture`;
  const response = await fetch(url, {
    method: "post",
    headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer ${accessToken}`,
    },
  });
  const data = await response.json();
  return data;
}

async function generateAccessToken() {
  const auth = Buffer.from(`${paypal_config.client_id}:${paypal_config.client_secret}`).toString("base64");
  try {
    const response = await request.post(`${PAYPAL_API}/v1/oauth2/token`,
      "grant_type=client_credentials",
      { headers: { Authorization: `Basic ${auth}` } }
    );
    const data = response.data
    return data.access_token;
  } catch (err) {
    const res = err.response;
    throw new Error(err.message, {
      status: res.status,
      body: res.data
    });
  }
}

module.exports = {
  createOrder,
}