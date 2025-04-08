import mongoose from 'mongoose';
import 'dotenv/config';

let connection = undefined;

let Albums = undefined;

async function connect() {
    try{
        await mongoose.connect(process.env.MONGODB_CONNECT_STRING)
        connection = mongoose.connection;
        Albums = createModel();
    } catch(err) {
        throw Error(`Error detected: ${err.message}`)
    }
}

function createModel() {
    const albumSchema = mongoose.Schema({
        title: {type: String, required: true},
        artists: {type: String, required: true},
        producers: {type: String, required: true},
        releaseYear: {type: Number, required: true},
        ranking: {type: Number, required: true},
        notes: {type: String, required: false}
    }, {collection: 'myRankingsList'});
    return  mongoose.model('Album', albumSchema)
}

//create
async function createAlbumRanking(title, artists, producers, releaseYear, ranking, notes) {
    let album = new Albums({title: title, artists: artists, producers: producers, releaseYear: releaseYear, ranking: ranking, notes: notes});
    return album.save();
}

//get all
const getRankings= async (filter) => {
    const albums = Albums.find(filter).exec();
    return albums;
}

const getAlbumRanking = async (id) => {
    const albums = await Albums.findById(id).exec();
    return albums;
}
//update
async function updateAlbumRanking(id, updateValues) {
    const updatedAlbum = await Albums.updateOne({_id: id}, updateValues);
    return updatedAlbum.modifiedCount;
}

//remove
const deleteAlbumRanking = async (id) => {
    const updatedAlbums = await Albums.deleteOne({_id: id});
    return updatedAlbums.deletedCount;
}

export {connect, createAlbumRanking, getAlbumRanking, getRankings, updateAlbumRanking, deleteAlbumRanking}