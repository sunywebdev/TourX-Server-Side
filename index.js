const express = require("express");
const { MongoClient } = require("mongodb");
const cors = require("cors");
require("dotenv").config();

//To select ID from MongoDB
const ObjectId = require("mongodb").ObjectId;

const app = express();
const port = process.env.PORT || 5000;

//Middleware
app.use(cors());
app.use(express.json());

//MongoDB linking
const uri = `mongodb+srv://${process.env.DB_USER}:${process.env.DB_PASS}@tourx-agency.kufwr.mongodb.net/myFirstDatabase?retryWrites=true&w=majority`;
const client = new MongoClient(uri);

async function run() {
	try {
		await client.connect();

		//DB Folder and Subfolder
		const database = client.db("TourX_Agency");
		const packagesCollection = database.collection("packages");
		const newsCollection = database.collection("news");
		const commentsCollection = database.collection("comments");
		const knowledgeCollection = database.collection("knowledge");
		const pendingCollection = database.collection("pending_Order");

		/* -------- post new packages , news , comments , knowledge ------------- */

		//To post new packages
		app.post("/packages", async (req, res) => {
			const newPackages = req.body;
			console.log("Request from UI ", newPackages);
			const result = await packagesCollection.insertOne(newPackages);
			console.log("Successfully Added New package ", result);
			res.json(result);
		});
		//To post new news
		app.post("/news", async (req, res) => {
			const newNews = req.body;
			console.log("Request from UI ", newNews);
			const result = await newsCollection.insertOne(newNews);
			console.log("Successfully Added New news ", result);
			res.json(result);
		});
		//To post new comments
		app.post("/comments", async (req, res) => {
			const newComments = req.body;
			console.log("Request from UI ", newComments);
			const result = await commentsCollection.insertOne(newComments);
			console.log("Successfully Added New comments ", result);
			res.json(result);
		});
		//To post new knowledge
		app.post("/knowledge", async (req, res) => {
			const newKnowledge = req.body;
			console.log("Request from UI ", newKnowledge);
			const result = await knowledgeCollection.insertOne(newKnowledge);
			console.log("Successfully Added New comments ", result);
			res.json(result);
		});
		//To post new pending order
		app.post("/pending", async (req, res) => {
			const newPending = req.body;
			console.log("Request for order ", newPending);
			const result = await pendingCollection.insertOne(newPending);
			console.log("Successfully Added New pending order ", result);
			res.json(result);
		});

		/* -------- show all packages , news , comments , knowledge ------------- */

		//To show all packages on client site
		app.get("/packages", async (req, res) => {
			console.log(req.query);
			const get = packagesCollection.find({});
			console.log("Request to find packages");
			const packages = await get.toArray();
			res.send(packages);
			console.log("Successfully Found packages", packages);
		});
		//To show all news on client site
		app.get("/news", async (req, res) => {
			console.log(req.query);
			const get = newsCollection.find({});
			console.log("Request to find news");
			const news = await get.toArray();
			res.send(news);
			console.log("Successfully Found news", news);
		});
		//To show all comments on client site
		app.get("/comments", async (req, res) => {
			console.log(req.query);
			const get = commentsCollection.find({});
			console.log("Request to find comments");
			const comments = await get.toArray();
			res.send(comments);
			console.log("Successfully Found packages", comments);
		});
		//To show all knowledge on client site
		app.get("/knowledge", async (req, res) => {
			console.log(req.query);
			const get = knowledgeCollection.find({});
			console.log("Request to find knowledge");
			const knowledge = await get.toArray();
			res.send(knowledge);
			console.log("Successfully Found knowledge", knowledge);
		});
		//To show all pending on client site
		app.get("/pending", async (req, res) => {
			console.log(req.query);
			const get = pendingCollection.find({});
			console.log("Request to find pending");
			const pending = await get.toArray();
			res.send(pending);
			console.log("Successfully Found knowledge", pending);
		});

		/* -------- show single packages , news , comments , knowledge ------------- */

		//To load single packages data by id
		app.get("/packages/:id", async (req, res) => {
			const id = req.params.id;
			console.log("Request to find ", id);
			const packagesId = { _id: ObjectId(id) };
			const result = await packagesCollection.findOne(packagesId);
			res.send(result);
			console.log("Found one", result);
		});
		//To load single news data by id
		app.get("/news/:id", async (req, res) => {
			const id = req.params.id;
			console.log("Request to find ", id);
			const newsId = { _id: ObjectId(id) };
			const result = await newsCollection.findOne(newsId);
			res.send(result);
			console.log("Found one", result);
		});
		//To load single comments data by id
		app.get("/comments/:id", async (req, res) => {
			const id = req.params.id;
			console.log("Request to find ", id);
			const commentsId = { _id: ObjectId(id) };
			const result = await commentsCollection.findOne(commentsId);
			res.send(result);
			console.log("Found one", result);
		});
		//To load single knowledge data by id
		app.get("/knowledge/:id", async (req, res) => {
			const id = req.params.id;
			console.log("Request to find ", id);
			const knowledgeId = { _id: ObjectId(id) };
			const result = await knowledgeCollection.findOne(knowledgeId);
			res.send(result);
			console.log("Found one", result);
		});
		//To load single knowledge data by Product id
		app.get("/pending/:id", async (req, res) => {
			const id = req.params.id;
			console.log("Request to find ", id);
			const result = await pendingCollection.findOne({ productId: id });
			res.send(result);
			console.log("Found one", result);
		});
		//To load order list by Product id
		app.get("/confirmed/:id", async (req, res) => {
			const id = req.params.id;
			console.log("Request to find ", id);
			const result = await pendingCollection.find({ userId: id }).toArray();
			res.send(result);
			console.log("Found using uid", result);
		});

		//To Delete user order one by one
		app.delete("/delete/:id", async (req, res) => {
			const id = req.params.id;
			console.log("Request to delete ", id);
			const deleteId = { _id: ObjectId(id) };
			const result = await pendingCollection.deleteOne(deleteId);
			res.send(result);
			console.log("Successfully Deleted", result);
		});

		//To store/update single pending data
		app.put("/pendings/:id", async (req, res) => {
			const id = req.params.id;
			console.log("Request to update ", id);
			const pendingId = { _id: ObjectId(id) };
			const updatedReq = req.body;
			console.log("Comming form UI", updatedReq);
			const options = { upsert: true };
			const updatedBookNow = {
				$set: {
					phoneNumber: updatedReq.phoneNumber,
					address: updatedReq.address,
					specialRequirements: updatedReq.specialRequirements,
				},
			};
			const result = await pendingCollection.updateOne(
				pendingId,
				updatedBookNow,
				options,
			);
			res.json(result);
			console.log("Updated Successfully", result);
		});

		//To store/update single pending to confirm
		app.put("/pendingconfirm/:id", async (req, res) => {
			const id = req.params.id;
			console.log("Request to update ", id);
			const pendingId = { _id: ObjectId(id) };
			const updatedReq = req.body;
			console.log("Comming form UI", updatedReq);
			const options = { upsert: true };
			const updatedBookNow = {
				$set: {
					orderStatus: updatedReq.orderStatus,
				},
			};
			const result = await pendingCollection.updateOne(
				pendingId,
				updatedBookNow,
				options,
			);
			res.json(result);
			console.log("Updated Successfully", result);
		});

		/*  

		//To Show all volunteers results from DB
		app.get("/volunteers", async (req, res) => {
			console.log(req.query);
			const get = volunteerCollection.find({});
			console.log("Request to find volunteers");
			volunteers = await get.toArray();
			res.send(volunteers);
			console.log("Found all volunteers", volunteers);
		});

		//TO get single volunteers data by uid
		app.get("/volunteers/:userId", async (req, res) => {
			const id = req.params.userId;
			console.log("Request to find ", id);
			const volunteer = await volunteerCollection
				.find({ userId: id })
				.toArray();
			res.send(volunteer);
			console.log("Found", volunteer);
		});

		//To Delete user and user data
		app.delete("/volunteers/:userId", async (req, res) => {
			const id = req.params.userId;
			console.log("Request to delete ", id);
			const result = await volunteerCollection.deleteMany({ userId: id });
			res.send(result);
			console.log("Successfully Deleted", result);
		});

		//To Delete user event one by one
		app.delete("/volunteerss/:id", async (req, res) => {
			const id = req.params.id;
			console.log("Request to delete ", id);
			const volunteerId = { _id: ObjectId(id) };
			const result = await volunteerCollection.deleteOne(volunteerId);
			res.send(result);
			console.log("Successfully Deleted", result);
		}); */

		/* //UPDATE
		//To store/update single volunteer data
		app.put("/volunteers/:id", async (req, res) => {
			const id = req.params.id;
			console.log("Request to update ", id);
			const volunteerId = { _id: ObjectId(id) };
			const updatedReq = req.body;
			console.log("Comming form UI", updatedReq);
			const options = { upsert: true };
			const updatedVolunteer = {
				$set: {
					name: updatedReq.name,
					email: updatedReq.email,
					date: updatedReq.date,
					date: updatedReq.date,
					eventName: updatedReq.eventName,
				},
			};
			const result = await volunteerCollection.updateOne(
				volunteerId,
				updatedVolunteer,
				options,
			);
			res.json(result);
			console.log("Updated Successfully", result);
		}); */
	} finally {
		//await client.close();
	}
}
run().catch(console.dir);

app.get("/", (req, res) => {
	res.send("TourX Agency Server is running just fine");
});

app.listen(port, () => {
	console.log("TourX Agency Server running on port :", port);
});
