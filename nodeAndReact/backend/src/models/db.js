const { MongoClient, ObjectId } = require('mongodb');

const uri = 'mongodb://localhost:27017';
const dbName = 'media_upload';
const client = new MongoClient(uri);

const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');
require('dotenv').config();

const crypto = require('crypto');
const JWT_SECRET = process.env.JWT_SECRET;

const connect = async (collection_Name) => {
    await client.connect();
    const db = client.db(dbName);
    return db.collection(collection_Name);
}

exports.get_All_Media = async () => {
    try {
        const collection = await connect("upload_db");
        const documents = await collection.find({}).toArray();
        result = documents.map(doc => ({ id: doc._id, filename: doc.filename }));
        return result;
    } catch (e) {
        console.error('Error:', e);
    } finally {
        await client.close();
    }
}


exports.get_Media_count_db = async () => {
    try {
        const collection = await connect("upload_db");
        const count = await collection.countDocuments({});
        return count;
    } catch (e) {
        console.error('Error:', e);
    } finally {
        await client.close();
    }
}

exports.set_media = async (media) => {
    try {
        const collection = await connect("upload_db");
        const insertResult = await collection.insertOne(media);
        return insertResult;
    } catch (e) {
        console.error('Error:', e);
    } finally {
        await client.close();
    }
}

exports.delete_single_media = async (id) => {

    try {
        const collection = await connect("upload_db");
        const result = await collection.deleteOne({ _id: new ObjectId(id) });
        if (result.deletedCount > 0) {
            return true;
        } else {
            return false;
        }

    } catch (e) {
        console.error('Error:', e);
    } finally {
        await client.close();
    }
}


exports.users = async () => {
    try {
        const collection = await connect("users");
        const documents = await collection.find({}).toArray();
        console.log(collection);
        return;
        result = documents.map(doc => ({ id: doc._id, filename: doc.filename }));
        return result;
    } catch (e) {
        console.error('Error:', e);
    } finally {
        await client.close();
    }
}

exports.user_register = async (newUser) => {
    try {
        const collection = await connect("users");
        const documents = await collection.findOne({
            $or: [
                { username: newUser.username },
                { email: newUser.email }
            ]
        });
        
        if (documents) {
            return { status: false, message: "User already exist" };
        }

        const hashedPassword = await bcrypt.hash(newUser.password, 10);
        const newUserInsert = { username : newUser.username,email : newUser.email, password: hashedPassword };
        const user = await collection.insertOne(newUserInsert);
        if (user.acknowledged) {
            return { status: true, message: "New user registered" };
        } else {
            return { status: false, message: "some error occur" };
        }
    } catch (e) {
        console.error('Error:', e);
    } finally {
        await client.close();
    }
}

exports.user_login = async (newUser) => {
    try {
        const collection = await connect("users");
        const user = await collection.findOne({
            $or: [
                { username: newUser.username },
            ]
        });
        if (!user) {
            return { status: false, message: "User not found" };
        }
        const isMatch = await bcrypt.compare(newUser.password, user.password);
        const token = jwt.sign({ id: user._id }, JWT_SECRET, { expiresIn: '4h' });
        if (!isMatch) {
            return { status: false, message: "Invalid credentials" };
        }else{
            return { status: true, message: "login success", token : token };
        }
    } catch (e) {
        console.error('Error:', e);
    } finally {
        await client.close();
    }
}

exports.user_profile = async (id) => {
    try {
        const collection = await connect("users");
        const user = await collection.findOne({ _id: new ObjectId(id) },{ projection: { _id: 1, username: 1, email: 1 } });
        if (!user) {
            return { status: false, message: "User not found" };
        }
        return { status: true, data : user };
    } catch (e) {
        console.error('Error:', e);
    } finally {
        await client.close();
    }
}
