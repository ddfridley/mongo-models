"use strict"
const MongoModels = require("../")
const Customer = require("./customer")

const main = async function () {
  await MongoModels.connect(
    { uri: process.env.MONGODB_URI },
    { useUnifiedTopology: true }
  )

  console.log("Models are now connected.")

  const b = await Customer.create("Bob Dow", "bd@email.com", "5551212")
  console.info("customer Bob created", b)

  const watchCursor = await Customer.watch(
    [{ $match: { "fullDocument.name": "John Dow" } }],
    {
      fullDocument: "updateLookup",
    }
  )
  console.info("Got watchCursor")

  watchCursor.on("change", (change) =>
    console.info("watch", JSON.stringify(change, null, 2))
  )

  async function createCustomer() {
    const c = await Customer.create("John Dow", "jd@email.com", "5551212")
    console.info("customer created", c)
    process.exit(0)
  }
  setTimeout(createCustomer, 1000)
}

main()
