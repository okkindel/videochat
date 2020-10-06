import * as CustomerSDK from "@livechat/customer-sdk";

const LICENSE_ID = "abc";
const CLIENT_ID = "def";

let customerSDK = null;
try {
    customerSDK = CustomerSDK.init({
     licenseId: LICENSE_ID,
     clientId: CLIENT_ID,
   });
} catch (error) {
    console.error(error);
}

customerSDK && customerSDK.on("connected", (payload) => {
  const { customer, availability, greeting } = payload;
  console.log("connected", { customer, availability, greeting });
});

export default customerSDK;